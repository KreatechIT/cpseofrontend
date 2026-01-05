import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { useState } from "react";
import { getAllCompetitors } from "../../services/competitorDetailsService";
import { useDispatch } from "react-redux";

const DeleteCompetitorConfirmation = ({ competitor, onClose }) => {
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await axiosInstance.delete(`/seo/competitors/${competitor.id}/`);
      toast.success(`Competitor "${competitor.company}" deleted successfully!`);
      await getAllCompetitors(dispatch);
      onClose();
    } catch (error) {
      toast.error("Failed to delete competitor");
      console.error(error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="text-center space-y-4 py-4">
      <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
      <h2 className="text-xl font-semibold">Delete Competitor</h2>
      <p className="text-muted-foreground">
        Are you sure you want to delete <strong>{competitor.company}</strong>?
        <br />
        This action cannot be undone.
      </p>
      <div className="flex justify-center gap-4 mt-4">
        <Button variant="outline" onClick={onClose} disabled={deleting}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          onClick={handleConfirmDelete}
          disabled={deleting}
        >
          {deleting ? "Deleting..." : "Yes, Delete"}
        </Button>
      </div>
    </div>
  );
};

export default DeleteCompetitorConfirmation;
