'use server';

import { authServer } from '@/lib/auth/server';
import db from '@/lib/db';
import { tweets, users, likes } from '@/lib/schema';
import { desc, eq, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Schema for creating a tweet
const createTweetSchema = z.object({
  content: z.string().min(1, "Tweet cannot be empty").max(280, "Tweet too long"),
  parentId: z.string().optional(),
});

export type TweetWithAuthor = {
  id: string;
  content: string;
  createdAt: Date;
  parentId: string | null;
  author: {
    id: string;
    name: string;
    username: string | null;
    avatarUrl: string | null;
  };
  likesCount: number;
  hasLiked: boolean;
};

export async function createTweet(prevState: any, formData: FormData) {
  const { data: session } = await authServer.getSession();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  const content = formData.get('content') as string;
  const parentId = formData.get('parentId') as string;
  
  const validated = createTweetSchema.safeParse({ content, parentId });

  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  try {
    await db.insert(tweets).values({
      content: validated.data.content,
      parentId: validated.data.parentId || null,
      authorId: session.user.id,
    });

    const path = parentId ? `/tweet/${parentId}` : '/';
    revalidatePath(path);
    return { success: true };
  } catch (error) {
    console.error('Failed to create tweet:', error);
    return { error: 'Failed to post tweet. Please try again.' };
  }
}

export async function toggleLike(tweetId: string) {
  const { data: session } = await authServer.getSession();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  try {
    // Check if like exists
    const existingLikes = await db
      .select()
      .from(likes)
      .where(and(eq(likes.userId, session.user.id), eq(likes.tweetId, tweetId)))
      .limit(1);

    if (existingLikes.length > 0) {
      await db.delete(likes).where(
        and(
          eq(likes.userId, session.user.id),
          eq(likes.tweetId, tweetId)
        )
      );
    } else {
      await db.insert(likes).values({
        userId: session.user.id,
        tweetId,
      });
    }

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle like:', error);
    return { error: 'Failed to update like' };
  }
}

export async function getTweets(): Promise<TweetWithAuthor[]> {
  const { data: session } = await authServer.getSession();
  const currentUserId = session?.user?.id;

  const tweetsData = await db
    .select({
      tweet: tweets,
      author: users,
      likesCount: sql<number>`count(${likes.userId})::int`,
    })
    .from(tweets)
    .innerJoin(users, eq(tweets.authorId, users.id))
    .leftJoin(likes, eq(tweets.id, likes.tweetId))
    .where(eq(tweets.parentId, null)) // Only fetch top-level tweets for the feed
    .groupBy(tweets.id, users.id)
    .orderBy(desc(tweets.createdAt))
    .limit(20);

  // If user is logged in, we need to know which of these they liked
  const likedTweetIds = new Set<string>();
  if (currentUserId && tweetsData.length > 0) {
    const userLikes = await db
      .select({ tweetId: likes.tweetId })
      .from(likes)
      .where(
        and(
          eq(likes.userId, currentUserId),
          sql`${likes.tweetId} IN ${tweetsData.map(t => t.tweet.id)}`
        )
      );
    userLikes.forEach(l => likedTweetIds.add(l.tweetId));
  }

  return tweetsData.map(({ tweet, author, likesCount }) => ({
    id: tweet.id,
    content: tweet.content,
    createdAt: tweet.createdAt,
    parentId: tweet.parentId,
    author: {
      id: author.id,
      name: author.name,
      username: author.username,
      avatarUrl: author.avatarUrl,
    },
    likesCount: likesCount,
    hasLiked: likedTweetIds.has(tweet.id),
  }));
}

export async function getTweet(id: string): Promise<{ tweet: TweetWithAuthor, replies: TweetWithAuthor[] } | null> {
  const { data: session } = await authServer.getSession();
  const currentUserId = session?.user?.id;

  // Validate UUID format to prevent DB errors
  const uuidSchema = z.string().uuid();
  const validatedId = uuidSchema.safeParse(id);
  
  if (!validatedId.success) {
    return null;
  }

  // 1. Fetch the main tweet
  const tweetMetadata = await db
    .select({
      tweet: tweets,
      author: users,
      likesCount: sql<number>`count(${likes.userId})::int`,
    })
    .from(tweets)
    .innerJoin(users, eq(tweets.authorId, users.id))
    .leftJoin(likes, eq(tweets.id, likes.tweetId))
    .where(eq(tweets.id, id))
    .groupBy(tweets.id, users.id)
    .limit(1);

  if (tweetMetadata.length === 0) return null;

  // 2. Fetch replies
  const repliesData = await db
    .select({
      tweet: tweets,
      author: users,
      likesCount: sql<number>`count(${likes.userId})::int`,
    })
    .from(tweets)
    .innerJoin(users, eq(tweets.authorId, users.id))
    .leftJoin(likes, eq(tweets.id, likes.tweetId))
    .where(eq(tweets.parentId, id))
    .groupBy(tweets.id, users.id)
    .orderBy(desc(tweets.createdAt));

  // 3. Check likes for both main tweet and replies
  const allTweetIds = [id, ...repliesData.map(r => r.tweet.id)];
  const likedTweetIds = new Set<string>();
  
  if (currentUserId && allTweetIds.length > 0) {
    const userLikes = await db
      .select({ tweetId: likes.tweetId })
      .from(likes)
      .where(
        and(
          eq(likes.userId, currentUserId),
          sql`${likes.tweetId} IN ${allTweetIds}`
        )
      );
    userLikes.forEach(l => likedTweetIds.add(l.tweetId));
  }

  // Helper to format
  const formatTweet = (row: any) => ({
    id: row.tweet.id,
    content: row.tweet.content,
    createdAt: row.tweet.createdAt,
    parentId: row.tweet.parentId,
    author: {
      id: row.author.id,
      name: row.author.name,
      username: row.author.username,
      avatarUrl: row.author.avatarUrl,
    },
    likesCount: row.likesCount,
    hasLiked: likedTweetIds.has(row.tweet.id),
  });

  return {
    tweet: formatTweet(tweetMetadata[0]),
    replies: repliesData.map(formatTweet),
  };
}


