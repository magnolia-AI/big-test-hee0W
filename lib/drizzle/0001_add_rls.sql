ALTER TABLE "follows" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "likes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "tweets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_users" ON "users" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "owner_modify_users" ON "users" AS PERMISSIVE FOR ALL TO public USING (id = (select current_setting('request.jwt.claims', true)::json->>'sub'));

CREATE POLICY "public_read_follows" ON "follows" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "follower_modify_follows" ON "follows" AS PERMISSIVE FOR ALL TO public USING (follower_id = (select current_setting('request.jwt.claims', true)::json->>'sub'));

CREATE POLICY "public_read_likes" ON "likes" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "user_modify_likes" ON "likes" AS PERMISSIVE FOR ALL TO public USING (user_id = (select current_setting('request.jwt.claims', true)::json->>'sub'));

CREATE POLICY "public_read_tweets" ON "tweets" AS PERMISSIVE FOR SELECT TO public USING (true);
CREATE POLICY "author_modify_tweets" ON "tweets" AS PERMISSIVE FOR ALL TO public USING (author_id = (select current_setting('request.jwt.claims', true)::json->>'sub'));

