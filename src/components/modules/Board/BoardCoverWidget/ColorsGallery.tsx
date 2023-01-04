import { Button } from '@components/common/Button';

interface ColorsGalleryProps {
  selectCover: (input: string) => void;
}

//TODO: Add color picker
export function ColorsGallery({ selectCover }: ColorsGalleryProps) {
  return (
    <div className="grid grid-cols-colors gap-2">
      <Button
        className="h-28 cursor-pointer rounded-lg bg-sky-600 hover:opacity-70 focus:ring-2 focus:ring-sky-600 focus:ring-offset-1"
        onClick={() => selectCover('rgb(2 132 199)')}
      ></Button>
      <Button
        className="h-28 cursor-pointer rounded-lg bg-amber-500 hover:opacity-70 focus:ring-2 focus:ring-amber-500 focus:ring-offset-1"
        onClick={() => selectCover('rgb(245 158 11)')}
      ></Button>
      <Button
        className="h-28 cursor-pointer rounded-lg bg-emerald-500 hover:opacity-70 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
        onClick={() => selectCover('rgb(16 185 129)')}
      ></Button>
      <Button
        className="h-28 cursor-pointer rounded-lg bg-red-500 hover:opacity-70 focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        onClick={() => selectCover('rgb(239 68 68)')}
      ></Button>
      <Button
        className="h-28 cursor-pointer rounded-lg bg-purple-600 hover:opacity-70 focus:ring-2 focus:ring-purple-600 focus:ring-offset-1"
        onClick={() => selectCover('rgb(147 51 234)')}
      ></Button>
      <Button
        className="h-28 cursor-pointer rounded-lg bg-fuchsia-600 hover:opacity-70 focus:ring-2 focus:ring-fuchsia-600 focus:ring-offset-1"
        onClick={() => selectCover('rgb(192 38 211)')}
      ></Button>
      <Button
        className="h-28 cursor-pointer rounded-lg bg-teal-500 hover:opacity-70 focus:ring-2 focus:ring-teal-500 focus:ring-offset-1"
        onClick={() => selectCover('rgb(20 184 166)')}
      ></Button>
      <Button
        className="h-28 cursor-pointer rounded-lg bg-cyan-600 hover:opacity-70 focus:ring-2 focus:ring-cyan-600 focus:ring-offset-1"
        onClick={() => selectCover('rgb(8 145 178)')}
      ></Button>
      <Button
        className="h-28 cursor-pointer rounded-lg bg-slate-500 hover:opacity-70 focus:ring-2 focus:ring-slate-500 focus:ring-offset-1"
        onClick={() => selectCover('rgb(100 116 139)')}
      ></Button>
    </div>
  );
}
