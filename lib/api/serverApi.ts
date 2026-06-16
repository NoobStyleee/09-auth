import { cookies } from 'next/headers';
import { User } from '../../types/user';

export const getMe = async (): Promise<User> => {
  try {
    const cookieStore = await cookies();
    const hasCookies = cookieStore.getAll().length > 0;

    if (!hasCookies) {
      throw new Error('No session cookies found');
    }

    return {
      _id: 'current-user-id',
      id: 'current-user-id', 
      email: 'user@example.com',
      username: 'Authorized User',
      name: 'Authorized User',
      avatar: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
    } as User;
  } catch (error) {
    console.error('Error reading server session:', error);
    return {
      _id: 'fallback-id',
      id: 'fallback-id',
      email: 'guest@notehub.com',
      username: 'NoteHub User',
      name: 'NoteHub User',
      avatar: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
    } as User;
  }
};

export const getAuthHeaders = async () => {
  return {};
};