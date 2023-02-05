import { Button } from '@components/common/Button';

interface ColorsGalleryProps {
  selectCover: (input: string) => void;
}

export function ColorsGallery({ selectCover }: ColorsGalleryProps) {
  return (
    <div className="grid gap-2 grid-cols-colors">
      <Button
        className="rounded-lg cursor-pointer bg-sky-600 h-28 hover:opacity-70 focus:ring-offset-1 focus:ring-2 focus:ring-sky-600"
        onClick={() => selectCover('rgb(2 132 199)')}
      ></Button>
      <Button
        className="rounded-lg cursor-pointer bg-amber-500 h-28 focus:ring-offset-1 focus:ring-2 focus:ring-amber-500 hover:opacity-70"
        onClick={() => selectCover('rgb(245 158 11)')}
      ></Button>
      <Button
        className="rounded-lg cursor-pointer h-28 bg-emerald-500 hover:opacity-70 focus:ring-offset-1 focus:ring-2 focus:ring-emerald-500"
        onClick={() => selectCover('rgb(16 185 129)')}
      ></Button>
      <Button
        className="bg-red-500 rounded-lg cursor-pointer h-28 hover:opacity-70 focus:ring-offset-1 focus:ring-2 focus:ring-red-500"
        onClick={() => selectCover('rgb(239 68 68)')}
      ></Button>
      <Button
        className="bg-purple-600 rounded-lg cursor-pointer h-28 hover:opacity-70 focus:ring-offset-1 focus:ring-2 focus:ring-purple-600"
        onClick={() => selectCover('rgb(147 51 234)')}
      ></Button>
      <Button
        className="rounded-lg cursor-pointer h-28 bg-fuchsia-600 hover:opacity-70 focus:ring-offset-1 focus:ring-2 focus:ring-fuchsia-600"
        onClick={() => selectCover('rgb(192 38 211)')}
      ></Button>
      <Button
        className="bg-teal-500 rounded-lg cursor-pointer h-28 hover:opacity-70 focus:ring-offset-1 focus:ring-2 focus:ring-teal-500"
        onClick={() => selectCover('rgb(20 184 166)')}
      ></Button>
      <Button
        className="rounded-lg cursor-pointer h-28 bg-cyan-600 hover:opacity-70 focus:ring-offset-1 focus:ring-2 focus:ring-cyan-600"
        onClick={() => selectCover('rgb(8 145 178)')}
      ></Button>
      <Button
        className="rounded-lg cursor-pointer h-28 bg-slate-500 hover:opacity-70 focus:ring-offset-1 focus:ring-2 focus:ring-slate-500"
        onClick={() => selectCover('rgb(100 116 139)')}
      ></Button>
    </div>
  );
}
