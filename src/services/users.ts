import { db } from '@/firebase/app';
import { UserProfile } from '@/types/models';

import { User } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

export async function createUserProfile(user: User, extra?: Partial<UserProfile>) {
  const profile: Partial<UserProfile> = {
    id: user.uid,
    email: user.email ?? '',
    displayName: extra?.displayName ?? user.displayName ?? '',
    createdAt: Date.now(),
  };
  // Only include phone if it's provided
  if (extra?.phone) {
    profile.phone = extra.phone;
  }
  // Filter out undefined fields before saving
  const cleanProfile = Object.fromEntries(
    Object.entries(profile).filter(([_, v]) => v !== undefined),
  );
  await setDoc(doc(db, 'users_profiles', user.uid), {
    ...cleanProfile,
    createdAt: serverTimestamp(),
  });
}
