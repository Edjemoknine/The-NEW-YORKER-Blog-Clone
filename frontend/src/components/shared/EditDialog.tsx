/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { PostForm } from "./PostForm";
import { Button } from "../ui/button";

export function EditPostDialog({ open, setOpen, post }: { open: boolean; setOpen: (open: boolean) => void; post: any }) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogTrigger>
          <Button className="absolute top-0 right-0">X</Button>
        </AlertDialogTrigger>
        <PostForm type={"Edit"} post={post} close={() => setOpen(false)} />
      </AlertDialogContent>
    </AlertDialog>
  );
}
