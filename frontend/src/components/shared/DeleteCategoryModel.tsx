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
import type { Category } from "@/api/handlers/categories";

type DeleteCategoryModelProps = {
  category: Category | null;
  isDeleting: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
};

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
          Delete “{category?.name}” from the category list? Existing posts will
          keep this category.
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
