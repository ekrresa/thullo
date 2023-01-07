import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@lib/utils';

interface DropdownProps {
  trigger: React.ReactNode;
  header?: React.ReactNode;
  list: React.ReactNode[];
}
export function Dropdown({ header, list, trigger }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="cursor-pointer" asChild>
        {trigger}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-max origin-top-right overflow-hidden rounded-md border border-slate-100 bg-white shadow-md animate-in slide-in-from-top-2 md:w-32"
          sideOffset={5}
        >
          {header}
          {list.map((item, index) => (
            <DropdownMenuItem key={index}>{item}</DropdownMenuItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

interface MenuItemProps extends DropdownMenu.DropdownMenuItemProps {}
export function DropdownMenuItem({ className, ...props }: MenuItemProps) {
  return (
    <DropdownMenu.Item
      {...props}
      className={cn('select-none py-1 px-3 text-sm text-slate-600 ', className)}
    >
      {props.children}
    </DropdownMenu.Item>
  );
}
