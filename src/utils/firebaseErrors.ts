import { FirebaseError } from 'firebase/app';

export function friendlyAuthError(error: unknown): string {
  const fb = error as FirebaseError | undefined;
  const code = fb?.code ?? '';
  switch (code) {
    case 'auth/configuration-not-found':
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled. Enable it in Firebase Console → Authentication → Sign-in method.';
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/weak-password':
      return 'Password is too weak (min 6 characters).';
    case 'auth/email-already-in-use':
      return 'This email is already in use.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Email or password is incorrect.';
    default:
      return fb?.message ?? 'Unknown authentication error';
  }
}
