import { createClient } from 'pexels';
import { PEXELS_API_KEY } from './constants';

export const pexelsClient = createClient(PEXELS_API_KEY!);
export * from 'pexels';
