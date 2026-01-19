'use server';

import { authServer } from '@/lib/auth/server';
import db from '@/lib/db';
import { tweets, users } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';
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
};

export async function createTweet(prevState: any, formData: FormData) {
  const { data: session } = await authServer.getSession();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  const content = formData.get('content') as string;
  // If we had a parentId for replies, we'd get it here too.
  
  const validated = createTweetSchema.safeParse({ content });

  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  try {
    await db.insert(tweets).values({
      content: validated.data.content,
      authorId: session.user.id,
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Failed to create tweet:', error);
    return { error: 'Failed to post tweet. Please try again.' };
  }
}

export async function getTweets(): Promise<TweetWithAuthor[]> {
  const data = await db
    .select({
      id: tweets.id,
      content: tweets.content,
      createdAt: tweets.createdAt,
      parentId: tweets.parentId,
      author: {
        id: users.id,
        name: users.name,
        username: users.username,
        avatarUrl: users.avatarUrl,
      },
    })
    .from(tweets)
    .innerJoin(users, eq(tweets.authorId, users.id))
    .where(eq(tweets.parentId, null)) // Only fetch top-level tweets for the feed for now
    .orderBy(desc(tweets.createdAt))
    .limit(20);

  return data as TweetWithAuthor[];
}


