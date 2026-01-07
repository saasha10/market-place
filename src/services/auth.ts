import { auth } from '@/firebase/app';

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';

export function watchAuthState(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export async function signIn(email: string, password: string) {
  const res = await signInWithEmailAndPassword(auth, email.trim(), password);
  return res.user;
}

export async function register(email: string, password: string) {
  const res = await createUserWithEmailAndPassword(auth, email.trim(), password);
  return res.user;
}

export async function logout() {
  await signOut(auth);
}
