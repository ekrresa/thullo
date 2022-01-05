export function getInitials(name: string) {
  if (!name) throw new Error('No name specified');

  const initials = name
    .split(' ')
    .map(name => name[0])
    .join('');

  return initials.length > 1 ? initials.substring(0, 2) : initials;
}

export function getCloudinaryUrl(publicId: string) {
  return `https://res.cloudinary.com/chuck-huey/image/upload/c_scale,dpr_auto,w_auto,q_auto,f_auto/${publicId}.jpg`;
}
