'use client';
import { useRouter } from 'next/navigation';
import css from './EditProfilePage.module.css';
import { updateMe } from '@/lib/api/clientApi';
import { useState, useEffect } from 'react';
import { getMe } from '@/lib/api/clientApi';
import { User } from '@/types/user';
import { ApiError } from '../../../../types/note';
import { useAuthStore } from '@/lib/store/authStore';
import Image from 'next/image';
type NoteFormValues = {
  avatar?: string;
  email?: string;
  username: string;
};
export default function Edit() {
  const [error, setError] = useState('');
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getMe();
      setUserData(data);
    }

    load();
  }, []);
  const handleSubmit = async (formData: FormData) => {
    const values = Object.fromEntries(formData) as NoteFormValues;

    try {
      const user = await updateMe(values);
      console.log(values);
      if (user) {
        setUser(user);
        router.push('/profile');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError(
        (error as ApiError).response?.data?.error ??
          (error as ApiError).message ??
          'Oops... some error'
      );
    }
  };
  const avatar = userData?.avatar?.trim()
    ? userData?.avatar
    : '/default-avatar.png';
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={avatar}
          alt={userData?.username || 'User Avatar'}
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} action={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:{userData?.username}</label>
            <input
              id="username"
              type="text"
              name="username"
              defaultValue={userData?.username}
              className={css.input}
            />
          </div>

          <p>Email: {userData?.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={() => {
                router.push('/profile');
              }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}