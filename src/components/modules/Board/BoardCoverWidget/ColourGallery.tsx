import { Button } from '@components/common/Button';

interface ColourGalleryProps {
  selectCover: (input: string) => void;
}

export function ColourGallery({ selectCover }: ColourGalleryProps) {
  return (
    <div className="grid grid-cols-colors gap-2">
      <Button
        className="h-28 cursor-pointer rounded-lg bg-[rgb(61,117,186)] hover:ring-2 hover:ring-[#3d75ba] hover:ring-offset-1"
        onClick={() => selectCover('rgb(61,117,186)')}
      ></Button>
      <Button
        className="h-28 cursor-pointer rounded-lg bg-emerald-500 hover:ring-2 hover:ring-emerald-500 hover:ring-offset-1"
        onClick={() => selectCover('rgb(16 185 129)')}
      ></Button>
      <Button
        className="h-28 cursor-pointer rounded-lg bg-red-500 hover:ring-2 hover:ring-red-500 hover:ring-offset-1"
        onClick={() => selectCover('rgb(239 68 68)')}
      ></Button>
      <Button
        className="h-28 cursor-pointer rounded-lg bg-purple-600 hover:ring-2 hover:ring-purple-600 hover:ring-offset-1"
        onClick={() => selectCover('rgb(147 51 234)')}
      ></Button>
      <Button
        className="h-28 cursor-pointer rounded-lg bg-fuchsia-600 hover:ring-2 hover:ring-fuchsia-600 hover:ring-offset-1"
        onClick={() => selectCover('rgb(192 38 211)')}
      ></Button>
      <Button
        className="h-28 cursor-pointer rounded-lg bg-[rgb(249,139,7)] hover:ring-2 hover:ring-[rgb(249,139,7)] hover:ring-offset-1"
        onClick={() => selectCover('rgb(249,139,7)')}
      ></Button>
      <Button
        className="h-28 cursor-pointer rounded-lg bg-[rgb(250,57,114)] hover:ring-2 hover:ring-[rgb(250,57,114)] hover:ring-offset-1"
        onClick={() => selectCover('rgb(250,57,114)')}
      ></Button>
      <Button
        className="h-28 cursor-pointer rounded-lg bg-[#05c7b7] hover:ring-2 hover:ring-[#05c7b7] hover:ring-offset-1"
        onClick={() => selectCover('#05c7b7')}
      ></Button>
    </div>
  );
}
