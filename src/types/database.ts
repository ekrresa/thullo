export interface UserProfile {
  id: string;
  name: string;
  username: string;
  is_profile_setup: boolean;
  image_id: string;
  image_version: string;
}

export interface SupabaseUser {
  id: string;
  aud: string;
  role: string;
  email: string;
  email_confirmed_at: string;
  phone: '';
  user_metadata: {
    is_demo_user: boolean;
  };
  identities: null;
  password?: string;
}

export interface Board {
  id: number;
  title: string;
  owner: UserProfile;
  members: string[];
  visibility: 'public' | 'private';
  description: string;
  image_id: string;
  image_version: string;
  cover: string;
  created_at: string;
  updated_at: string;
}

export interface List {
  id: number;
  title: string;
  position: number;
  board_id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Card {
  id: number;
  title: string;
  position: number;
  description: string;
  list_id: number;
  board_id: number;
  created_by: string;
  image_id: string;
  image_version: string;
  cover: string;
  created_at: string;
  updated_at: string;
}
