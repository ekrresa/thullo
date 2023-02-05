import React from 'react';

export function Footer() {
  return (
    <div className="py-2 px-4 flex justify-center text-light-pencil">
      <span>&copy;</span>
      <span className="ml-2">{new Date().getFullYear()}</span>
      <span className="ml-2">Ochuko Ekrresa</span>
    </div>
  );
}
