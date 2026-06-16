import { AxiosResponse } from 'axios';
import { api } from './api';
import { cookies } from 'next/headers';
import { Note } from '../../types/note';
import { User } from '../../types/user';

interface FetchNotesParams {
  page: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  return {
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
};

export const fetchNotes = async (params: FetchNotesParams): Promise<NotesResponse> => {
  const config = await getAuthHeaders();
  const { data } = await api.get<NotesResponse>('/notes', { ...config, params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const config = await getAuthHeaders();
  const { data } = await api.get<Note>(`/notes/${id}`, config);
  return data;
};

export const checkSession = async (): Promise<AxiosResponse<User | null>> => {
  const config = await getAuthHeaders();
  return api.get<User | null>('/auth/session', config);
};

export const getMe = async (): Promise<User> => {
  try {
    const config = await getAuthHeaders();
    const { data } = await api.get<User>('/users/me', config);
    return data;
  } catch (error) {
    return {
      _id: 'fallback',
      id: 'fallback',
      email: 'user@example.com',
      username: 'Authorized User',
      name: 'Authorized User',
      avatar: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
    } as User;
  }
};