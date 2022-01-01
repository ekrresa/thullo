export interface UserProfile {
  id: string;
  name: string;
  username: string;
  is_profile_setup: boolean;
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
