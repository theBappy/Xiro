"use client";

import { DropdownMenuContentProps } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link2, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { ConfirmModal } from "./confirm-modal";
import { Button } from "./ui/button";
import { useRenameModal } from "@/store/use-rename-modal";

interface ActionProps {
  children: React.ReactNode;
  side?: DropdownMenuContentProps["side"];
  sideOffset?: DropdownMenuContentProps["sideOffset"];
  id: string;
  title: string;
}

export const Actions = ({
  children,
  side,
  sideOffset,
  id,
  title,
}: ActionProps) => {
   const { mutate, pending } = useApiMutation(api.board.remove)
   const { onOpen } = useRenameModal()

   const onDelete = () => {
    mutate({id})
    .then(() => toast.success('Board deleted'))
    .catch(() => toast.error('Failed to delete board'))
   }


  const onCopyLink = () => {
    navigator.clipboard.writeText(
        `${window.location.origin}/board/${id}`
    )
    .then(() => toast.success('Link copied'))
    .catch(()=> toast.error('Failed to copy link'))
  }
  
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        onClick={(e) => e.stopPropagation()}
        side={side}
        sideOffset={sideOffset}
        className="w-60"
      >
        <DropdownMenuItem 
        onClick={onCopyLink}
        className="p-3 cursor-pointer">
          <Link2 className="h-4 w-4 mr-2" /> Copy board link
        </DropdownMenuItem>
        <DropdownMenuItem 
        onClick={() => onOpen(id, title)}
        className="p-3 cursor-pointer">
          <Pencil className="h-4 w-4 mr-2" /> Rename
        </DropdownMenuItem>
        <ConfirmModal
        header="Delete board?"
        description="This will delete the board and all of it&apos;s contents."
        disabled={pending}
        onConfirm={onDelete}
        >
        <Button
        variant='ghost'
        className="p-3 w-full text-sm justify-start font-normal cursor-pointer">
          <Trash2 className="h-4 w-4 mr-2" />Delete
        </Button>
        </ConfirmModal>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
