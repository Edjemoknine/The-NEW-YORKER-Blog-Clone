import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { DeleteCategoryModelProps } from "@/types/categories";

const DeleteCategoryModel = ({
  category,
  isDeleting,
  onOpenChange,
  onConfirm,
}: DeleteCategoryModelProps) => (
  <AlertDialog
    open={category !== null}
    onOpenChange={(open) => {
      if (!isDeleting) onOpenChange(open);
    }}
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete category?</AlertDialogTitle>
        <AlertDialogDescription>
          A category can only be deleted when no posts use it. Remove it from
          all related posts before trying again.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isDeleting}>
          Cancel
        </AlertDialogCancel>
        <Button
          type="button"
          variant="destructive"
          disabled={isDeleting}
          onClick={onConfirm}
        >
          {isDeleting ? "Deleting..." : "Delete category"}
        </Button>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default DeleteCategoryModel;
