import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@lib/utils';

interface DropdownProps extends DropdownMenu.DropdownMenuProps {
  trigger: React.ReactNode;
  header?: React.ReactNode;
  children: React.ReactNode[];
}
export function Dropdown({ header, children, trigger }: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="cursor-pointer" asChild>
        {trigger}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-max origin-top-right overflow-hidden rounded-md border border-slate-50 bg-white shadow-lg animate-in slide-in-from-top-2 md:w-32"
          sideOffset={3}
        >
          {header}
          {children}

          <DropdownMenu.Arrow className="fill-gray-100" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

interface MenuItemProps extends DropdownMenu.DropdownMenuItemProps {}
export function DropdownItem({ className, ...props }: MenuItemProps) {
  return (
    <DropdownMenu.Item
      {...props}
      className={cn(
        'select-none py-1.5 px-3 text-sm text-slate-600 outline-none transition-colors hover:bg-astronaut-600 hover:text-white',
        className
      )}
    >
      {props.children}
    </DropdownMenu.Item>
  );
}
