import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}

/** Slides in from the right on desktop and fills the screen on phones. */
export function Drawer({ open, onOpenChange, title, description, children }: DrawerProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-night/60 backdrop-blur-sm data-[state=open]:animate-[fade-in_200ms_ease-out]" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-y-auto bg-surface shadow-lift outline-none sm:max-w-xl sm:rounded-l-3xl data-[state=open]:animate-[drawer-in_320ms_cubic-bezier(0.2,0.8,0.2,1)]"
        >
          <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-surface/90 px-6 py-4 backdrop-blur">
            <div>
              <Dialog.Title className="m-0 text-lg font-bold text-ink">{title}</Dialog.Title>
              {description ? (
                <Dialog.Description className="m-0 text-sm text-muted">{description}</Dialog.Description>
              ) : (
                <Dialog.Description className="sr-only">{title}</Dialog.Description>
              )}
            </div>
            <Dialog.Close
              aria-label="Close"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-muted hover:bg-line hover:text-ink"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
