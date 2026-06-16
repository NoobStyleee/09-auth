'use client';

import { useQuery, keepPreviousData } from '@tanstack/react-query';
import css from './Notes.client.module.css';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import { useState } from 'react';
import { fetchNotes } from '@/lib/api/clientApi';
import NoteList from '@/components/NoteList/NoteList';
import { useDebouncedCallback } from 'use-debounce';
import { Toaster } from 'react-hot-toast';
import { NoteTag } from '@/types/note';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';

type Props = {
  tag?: NoteTag;
};

function Notes({ tag }: Props) {
  const [input, setInput] = useState('');
  const [querySe, setQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isSuccess, isFetching } = useQuery({
    queryKey: ['notes', { page, querySe, tag }],
    queryFn: () =>
      fetchNotes({
        page,
        search: querySe || undefined,
        perPage: 12,
        tag: tag,
      }),
    placeholderData: keepPreviousData,
  });

  const debouncedSetQuery = useDebouncedCallback((value: string) => {
    setQuery(value);
    setPage(1);
  }, 500);

  const totalPages = data?.totalPages ?? 0;
  const notes = data?.notes ?? [];

  const isEmpty = isSuccess && notes.length === 0;
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={input}
          onChange={val => {
            setInput(val);
            debouncedSetQuery(val);
          }}
        />

        {isSuccess && totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>
      {!isAuthenticated ? (
        <p>Please login</p>
      ) : isEmpty ? (
        <p>
          {tag || querySe ? 'No notes found for this filter' : 'No notes yet'}
        </p>
      ) : (
        !isLoading &&
        !isFetching &&
        isSuccess &&
        data.notes.length > 0 && <NoteList notes={data.notes} />
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default Notes;