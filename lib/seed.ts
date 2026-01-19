import 'dotenv/config';
import db from './db';
import { users, tweets, likes, follows } from './schema';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('Starting database seed...');

  try {
    // 1. Create dummy users
    console.log('Creating users...');
    
    // Using fixed IDs for reproducibility in this seed script
    // Note: These users won't be able to login via Auth provider
    const userList = [
      {
        id: 'user_1',
        name: 'Alex Rivera',
        email: 'alex@example.com',
        username: 'arivera',
        bio: 'Digital artist & coffee enthusiast ☕️',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop',
      },
      {
        id: 'user_2',
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        username: 'schen_dev',
        bio: 'Building things with code. Next.js fan.',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      },
      {
        id: 'user_3',
        name: 'Marcus Johnson',
        email: 'marcus@example.com',
        username: 'mj_photo',
        bio: 'Photography is life. capturing moments.',
        avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
      },
      {
        id: 'user_4',
        name: 'Emma Wilson',
        email: 'emma@example.com',
        username: 'ewilson',
        bio: 'Just here for the vibes.',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop',
      }
    ];

    // Insert users (on conflict do update to ensure they exist)
    for (const user of userList) {
      await db.insert(users)
        .values(user)
        .onConflictDoUpdate({ 
          target: users.id, 
          set: user 
        });
    }

    // 2. Create Tweets
    console.log('Creating tweets...');
    
    const tweetTemplates = [
      { authorId: 'user_1', content: 'Just finished my latest digital painting! 🎨 #art #digitalart' },
      { authorId: 'user_1', content: 'Coffee is the most important meal of the day. Change my mind.' },
      { authorId: 'user_2', content: 'Next.js 16 is looking incredible. The server actions are a game changer! 🚀' },
      { authorId: 'user_2', content: 'Debugging allows you to remain the only person who doesn\'t know what the hell is going on.' },
      { authorId: 'user_3', content: 'Golden hour was perfect today. Photos coming soon!' },
      { authorId: 'user_4', content: 'Why is it always Monday?' },
    ];

    // Delete existing tweets from these users to avoid duplicates if re-running (simple approach)
    // In a real app we might be more careful
    
    // Insert new tweets
    const createdTweets = await db.insert(tweets)
      .values(tweetTemplates)
      .returning();

    console.log(`Created ${createdTweets.length} tweets.`);
    
    // 3. Create Likes
    console.log('Creating likes...');
    
    if (createdTweets.length > 0) {
      await db.insert(likes).values([
        { userId: 'user_2', tweetId: createdTweets[0].id }, // Sarah likes Alex's art
        { userId: 'user_3', tweetId: createdTweets[0].id }, // Marcus likes Alex's art
        { userId: 'user_4', tweetId: createdTweets[0].id }, // Emma likes Alex's art
        { userId: 'user_1', tweetId: createdTweets[2].id }, // Alex likes Sarah's tech tweet
      ]).onConflictDoNothing();
    }

    // 4. Create Follows
    console.log('Creating follows...');
    await db.insert(follows).values([
      { followerId: 'user_2', followingId: 'user_1' }, // Sarah follows Alex
      { followerId: 'user_3', followingId: 'user_1' }, // Marcus follows Alex
      { followerId: 'user_1', followingId: 'user_2' }, // Alex follows Sarah
    ]).onConflictDoNothing();

    console.log('Database seed completed successfully! 🌱');
  } catch (error) {
    console.error('Error during seed:', error);
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });

