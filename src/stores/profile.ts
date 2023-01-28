import { User } from '@models/index';
import { create } from 'zustand';

interface ProfileState {
  info: User | null;
  updateProfile: (user: User | null) => void;
}

export const useProfileStore = create<ProfileState>(set => ({
  info: null,
  updateProfile: user => {
    set({ info: user });
  },
}));
