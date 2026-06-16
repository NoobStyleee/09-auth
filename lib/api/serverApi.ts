import { type Note } from '../../types/note';
import { api } from './api';
import { cookies } from 'next/headers';
import { type User } from '../../types/user';
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
interface checkSessionParams {
  message: string;
}
export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<NotesResponse> => {
  const cookieStore = await cookies();

  const { data } = await api.get('/notes', {
    params: {
      page,
      perPage,
      search,
      tag: tag,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const { data } = await api.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
export const checkSession = async () => {
  const cookieStore = await cookies();
  const response = await api.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response;
};
export const getMe = async () => {
  const cookieStore = await cookies();
  const { data } = await api.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};