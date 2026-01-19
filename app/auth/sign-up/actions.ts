'use server';

import { authServer } from '@/lib/auth/server';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { users } from '@/lib/schema';

export async function signUpWithEmail(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !email || !password) {
    return { error: 'All fields are required' };
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' };
  }

  const { data, error } = await authServer.signUp.email({
    name,
    email,
    password,
  });

  if (error) {
    return { error: error.message || 'Failed to create account. Please try again.' };
  }

  // Create local profile if user was created
  if (data?.user) {
    try {
      await db.insert(users).values({
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        username: email.split('@')[0] + '_' + Math.random().toString(36).substring(2, 7),
        // Use initial or default values
      });
    } catch (e) {
      console.error('Failed to create profile:', e);
      // Fallback: we might wanted to delete the auth user if profile creation fails 
      // to keep consistency, but for now we proceed.
    }
  }

  redirect('/');
}

