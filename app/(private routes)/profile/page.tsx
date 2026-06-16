import type { Metadata } from 'next';
import { getMe } from '@/lib/api/serverApi';
import Image from 'next/image';
import Link from 'next/link';
import css from './ProfilePage.module.css';

export async function generateMetadata(): Promise<Metadata> {
  const user = await getMe();

  return {
    title: user.username,
    description: `${user.username} profile page`,
    openGraph: {
      title: user.username,
      description: `${user.username} profile`,
      url: '/profile',
      siteName: 'NoteHub',
      images: [
        {
          url: user.avatar,
          width: 1200,
          height: 630,
          alt: user.username,
        },
      ],
      type: 'profile',
    },
  };
}

export default async function ProfilePage() {
  const user = await getMe();
  const avatar =
    user.avatar?.trim() ||
    'https://ac.goit.global/fullstack/react/default-avatar.jpg';
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>

          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>

        <div className={css.avatarWrapper}>
          <Image
            src={avatar}
            alt={user.username}
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>

        <div className={css.profileInfo}>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
        </div>
      </div>
    </main>
  );
}