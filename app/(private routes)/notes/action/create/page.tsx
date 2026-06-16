import NoteForm from '@/components/NoteForm/NoteForm';
import css from './CreateNote.module.css';
import type { Metadata } from 'next';
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Create note',
    description: 'Create a new note',
    openGraph: {
      title: 'Create note',
      description: 'Create a new note',
      url: 'https://09-auth-seven-sandy.vercel.app/notes/action/create',
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub',
        },
      ],
      type: 'article',
    },
  };
}
export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}