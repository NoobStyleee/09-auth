import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/serverApi';
import type { Metadata } from 'next';
import NotePreviewClient from '../../../@modal/(.)notes/[id]/NotePreview.client';

type Props = {
  params: Promise<{ id: string }>;
};
type GenerateMetadataProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: GenerateMetadataProps): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);
  return {
    title: `${note.title}`,
    description: `${note.content.slice(0, 100)}...`,
    openGraph: {
      title: `${note.title}`,
      description: `${note.content.slice(0, 100)}...`,
      url: `/notes/filter/${id}`,
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

const NoteDetails = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreviewClient id={''} />
    </HydrationBoundary>
  );
};

export default NoteDetails;