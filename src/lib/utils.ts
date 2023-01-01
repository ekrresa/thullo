import { Prisma } from '@prisma/client';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import request from './request';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  if (!name) return;

  const initials = name
    .split(' ')
    .map(name => name[0])
    .join('');

  return initials.length > 1 ? initials.substring(0, 2) : initials;
}

export function getCloudinaryUrl(publicId: string, version: string) {
  return `https://res.cloudinary.com/chuck-huey/image/upload/c_thumb,dpr_auto,w_auto,q_auto,f_auto,g_face/${version}/${publicId}.jpg`;
}

export function profileCloudinaryUrl(publicId: string, version: string) {
  return `https://res.cloudinary.com/chuck-huey/image/upload/c_thumb,dpr_auto,w_200,q_auto,f_auto,g_face/${version}/${publicId}.jpg`;
}

export function parseError(error: unknown): string {
  if (request.isAxiosError(error)) {
    if (error.response?.data?.message) {
      return error.response?.data?.message;
    } else {
      return error.message || 'Something went wrong. Please try again!';
    }
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return 'Something went wrong. Please try again!';
  }

  return 'Something went wrong. Please try again!';
}

export function reloadSession() {
  const event = new Event('visibilitychange');
  document.dispatchEvent(event);
}
