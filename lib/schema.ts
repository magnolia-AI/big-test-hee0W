import { pgTable, text, timestamp, uuid, pgPolicy } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// Users table (profiles)
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Matches Neon Auth User ID
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  username: text('username').unique(),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => ({
  publicRead: pgPolicy("public_read_users", {
    for: "select",
    to: "public",
    using: sql`true`,
  }),
  ownerModify: pgPolicy("owner_modify_users", {
    for: "all",
    to: "public",
    using: sql`id = (select current_setting('request.jwt.claims', true)::json->>'sub')`,
  }),
})).enableRLS();

// Tweets table
export const tweets = pgTable('tweets', {
  id: uuid('id').defaultRandom().primaryKey(),
  content: text('content').notNull(),
  authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id'), // For replies - self reference
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
}, (table) => ({
  publicRead: pgPolicy("public_read_tweets", {
    for: "select",
    to: "public",
    using: sql`true`,
  }),
  authorModify: pgPolicy("author_modify_tweets", {
    for: "all",
    to: "public",
    using: sql`author_id = (select current_setting('request.jwt.claims', true)::json->>'sub')`,
  }),
})).enableRLS();

// Likes join table
export const likes = pgTable('likes', {
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  tweetId: uuid('tweet_id').notNull().references(() => tweets.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: [table.userId, table.tweetId],
  publicRead: pgPolicy("public_read_likes", {
    for: "select",
    to: "public",
    using: sql`true`,
  }),
  userModify: pgPolicy("user_modify_likes", {
    for: "all",
    to: "public",
    using: sql`user_id = (select current_setting('request.jwt.claims', true)::json->>'sub')`,
  }),
})).enableRLS();

// Follows join table
export const follows = pgTable('follows', {
  followerId: text('follower_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  followingId: text('following_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: [table.followerId, table.followingId],
  publicRead: pgPolicy("public_read_follows", {
    for: "select",
    to: "public",
    using: sql`true`,
  }),
  followerModify: pgPolicy("follower_modify_follows", {
    for: "all",
    to: "public",
    using: sql`follower_id = (select current_setting('request.jwt.claims', true)::json->>'sub')`,
  }),
})).enableRLS();

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  tweets: many(tweets),
  likes: many(likes),
  followers: many(follows, { relationName: 'followers' }),
  following: many(follows, { relationName: 'following' }),
}));

export const tweetsRelations = relations(tweets, ({ one, many }) => ({
  author: one(users, {
    fields: [tweets.authorId],
    references: [users.id],
  }),
  parent: one(tweets, {
    fields: [tweets.parentId],
    references: [tweets.id],
    relationName: 'replies',
  }),
  replies: many(tweets, { relationName: 'replies' }),
  likes: many(likes),
}));

export const likesRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    fields: [likes.userId],
    references: [users.id],
  }),
  tweet: one(tweets, {
    fields: [likes.tweetId],
    references: [tweets.id],
  }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    fields: [follows.followerId],
    references: [users.id],
    relationName: 'following',
  }),
  following: one(users, {
    fields: [follows.followingId],
    references: [users.id],
    relationName: 'followers',
  }),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Tweet = typeof tweets.$inferSelect;
export type NewTweet = typeof tweets.$inferInsert;
export type Like = typeof likes.$inferSelect;
export type Follow = typeof follows.$inferSelect;

