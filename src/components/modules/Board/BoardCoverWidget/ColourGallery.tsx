import { Button } from '@components/common/Button';
import { cn } from '@lib/utils';

interface ColourGalleryProps {
  selectCover: (input: string) => void;
  selectedColour: string | null;
}
export function ColourGallery(props: ColourGalleryProps) {
  const { selectCover, selectedColour } = props;

  return (
    <div className="grid grid-cols-colors gap-2">
      <Button
        className={cn(
          'h-28 cursor-pointer rounded-lg bg-[#3d75ba] hover:ring-2 hover:ring-[#3d75ba] hover:ring-offset-1',
          selectedColour === '#3d75ba' ? 'ring-2 ring-[#3d75ba] ring-offset-1' : ''
        )}
        onClick={() => selectCover('#3d75ba')}
      ></Button>

      <Button
        className={cn(
          'h-28 cursor-pointer rounded-lg bg-[#10b981] hover:ring-2 hover:ring-[#10b981] hover:ring-offset-1',
          selectedColour === '#10b981' ? 'ring-2 ring-[#10b981] ring-offset-1' : ''
        )}
        onClick={() => selectCover('#10b981')}
      ></Button>

      <Button
        className={cn(
          'h-28 cursor-pointer rounded-lg bg-[#ef4444] hover:ring-2 hover:ring-[#ef4444] hover:ring-offset-1',
          selectedColour === '#ef4444' ? 'ring-2 ring-[#ef4444] ring-offset-1' : ''
        )}
        onClick={() => selectCover('#ef4444')}
      ></Button>

      <Button
        className={cn(
          'h-28 cursor-pointer rounded-lg bg-[#9333ea] hover:ring-2 hover:ring-[#9333ea] hover:ring-offset-1',
          selectedColour === '#9333ea' ? 'ring-2 ring-[#9333ea] ring-offset-1' : ''
        )}
        onClick={() => selectCover('#9333ea')}
      ></Button>

      <Button
        className={cn(
          'h-28 cursor-pointer rounded-lg bg-[#c026d3] hover:ring-2 hover:ring-[#c026d3] hover:ring-offset-1',
          selectedColour === '#c026d3' ? 'ring-2 ring-[#c026d3] ring-offset-1' : ''
        )}
        onClick={() => selectCover('#c026d3')}
      ></Button>

      <Button
        className={cn(
          'h-28 cursor-pointer rounded-lg bg-[#f98b07] hover:ring-2 hover:ring-[#f98b07] hover:ring-offset-1',
          selectedColour === '#f98b07' ? 'ring-2 ring-[#f98b07] ring-offset-1' : ''
        )}
        onClick={() => selectCover('#f98b07')}
      ></Button>

      <Button
        className={cn(
          'h-28 cursor-pointer rounded-lg bg-[#fa3972] hover:ring-2 hover:ring-[#fa3972] hover:ring-offset-1',
          selectedColour === '#fa3972' ? 'ring-2 ring-[#fa3972] ring-offset-1' : ''
        )}
        onClick={() => selectCover('#fa3972')}
      ></Button>

      <Button
        className={cn(
          'h-28 cursor-pointer rounded-lg bg-[#05c7b7] hover:ring-2 hover:ring-[#05c7b7] hover:ring-offset-1',
          selectedColour === '#05c7b7' ? 'ring-2 ring-[#05c7b7] ring-offset-1' : ''
        )}
        onClick={() => selectCover('#05c7b7')}
      ></Button>
    </div>
  );
}
