import { api } from './api';
import { cookies } from 'next/headers';
import { Note } from '../../types/note';
import { User } from '../../types/user';

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export const fetchNotes = async (params: any): Promise<any> => {
  const config = await getAuthHeaders();
  const { data } = await api.get('/notes', { ...config, params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const config = await getAuthHeaders();
  const { data } = await api.get<Note>(`/notes/${id}`, config);
  return data;
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const config = await getAuthHeaders();
    const { data } = await api.get<User | null>('/auth/session', config);
    return data;
  } catch {
    return null;
  }
};

export const getMe = async (): Promise<User> => {
  try {
    const config = await getAuthHeaders();
    const { data } = await api.get<User>('/users/me', config);
    return data;
  } catch (error) {
    return {
      _id: 'fallback',
      email: 'user@example.com',
      username: 'Authorized User',
      name: 'Authorized User',
      avatar: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
    } as User;
  }
};