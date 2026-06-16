import { api } from './api';
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

export const fetchNotes = async (params: FetchNotesParams): Promise<NotesResponse> => {
  const { data } = await api.get<NotesResponse>('/notes', { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (note: Omit<Note, 'id'>): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

export const register = async (credentials: Record<string, string>): Promise<User> => {
  const { data } = await api.post<User>('/auth/register', credentials);
  return data;
};

export const login = async (credentials: Record<string, string>): Promise<User> => {
  const { data } = await api.post<User>('/auth/login', credentials);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User | null> => {
  const { data } = await api.get<User | null>('/auth/session');
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export const updateMe = async (userData: Partial<User>): Promise<User> => {
  const { data } = await api.patch<User>('/users/me', userData);
  return data;
};