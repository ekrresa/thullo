export function getInitials(name: string) {
  if (!name) throw new Error('No name specified');

  const initials = name
    .split(' ')
    .map(name => name[0])
    .join('');

  return initials.length > 1 ? initials.substring(0, 2) : initials;
}
