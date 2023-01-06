import * as React from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { BoardVisibility } from '@prisma/client';
import { cn } from '@lib/utils';

interface VisibilitySelectProps {
  getVisibility: (input: BoardVisibility) => void;
  value: BoardVisibility;
}
export function VisibilitySelect({ getVisibility, value }: VisibilitySelectProps) {
  return (
    <form>
      <RadioGroup.Root
        className="flex gap-4"
        onValueChange={value => {
          getVisibility(value as BoardVisibility);
        }}
      >
        <RadioGroup.Item
          className={cn(
            'flex-1 rounded-lg border border-astronaut-200 p-4 transition duration-300',
            value === 'PUBLIC' ? 'ring-2 ring-astronaut-500 ring-offset-1' : ''
          )}
          value="PUBLIC"
        >
          <header className="flex justify-between text-astronaut-500">
            <p className="text-sm font-medium">Public</p>

            <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-astronaut-500">
              {value === 'PUBLIC' && (
                <span className="h-2 w-2 rounded-full bg-astronaut-500"></span>
              )}
            </div>
          </header>

          <p className="mt-4 text-left text-xs text-slate-500">
            Anyone on the internet can view this board
          </p>
        </RadioGroup.Item>

        <RadioGroup.Item
          className={cn(
            'flex-1 rounded-lg border border-astronaut-200 p-4 transition duration-300',
            value === 'PRIVATE' ? 'ring-2 ring-astronaut-500 ring-offset-1' : ''
          )}
          value="PRIVATE"
        >
          <header className="flex justify-between">
            <p className="text-sm font-medium text-astronaut-500">Private</p>

            <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-astronaut-500">
              {value === 'PRIVATE' && (
                <span className="h-2 w-2 rounded-full bg-astronaut-500"></span>
              )}
            </div>
          </header>

          <p className="mt-4 text-left text-xs text-slate-500">
            Only board members can view this board
          </p>
        </RadioGroup.Item>
      </RadioGroup.Root>
    </form>
  );
}
