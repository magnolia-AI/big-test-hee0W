'use server';

import { authServer } from '@/lib/auth/server';
import db from '@/lib/db';
import { users } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")
    .optional()
    .or(z.literal('')),
});

export async function updateProfile(data: { name: string; username: string }) {
  const { data: session } = await authServer.getSession();
  if (!session?.user) {
    return { error: 'Unauthorized' };
  }

  const validated = updateProfileSchema.safeParse(data);

  if (!validated.success) {
    return { error: validated.error.errors[0].message };
  }

  try {
    const updateData: { name: string; username?: string | null } = {
      name: validated.data.name,
    };
    
    // Only update username if provided and not empty
    if (validated.data.username && validated.data.username.trim() !== '') {
      updateData.username = validated.data.username;
    } else if (validated.data.username === '') {
        // If empty string is sent, do we want to clear it? 
        // Or just ignore? The regex allows empty via literal('').
        // Let's assume user wants to set it.
        // But unique constraint might fail if multiple nulls? No, null is unique.
        // But empty string might be duplicate.
        // Let's set to null if empty.
        updateData.username = null;
    }

    await db.update(users)
      .set(updateData)
      .where(eq(users.id, session.user.id));

    revalidatePath('/');
    revalidatePath('/account/settings');
    return { success: true };
  } catch (error: any) {
    console.error('Failed to update profile:', error);
    if (error.code === '23505') { // Postgres unique constraint violation
      return { error: 'Username is already taken' };
    }
    return { error: 'Failed to update profile. Please try again.' };
  }
}

