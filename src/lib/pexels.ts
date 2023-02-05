import { createClient } from 'pexels';

const pexelsAPIKEY = process.env.NEXT_PUBLIC_PEXELS_API_KEY as string;
export const pexelsClient = createClient(pexelsAPIKEY);
export * from 'pexels';
