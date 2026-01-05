import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { getAllProjects } from "@/modules/seo-module/services/projectService"; // adjust path

const DeleteProjectConfirmation = ({ project, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/seo/projects/${project.id}/`);
      toast.success(`"${project.project_name}" has been deleted successfully.`);
      
      // Refetch projects to update the list
      await getAllProjects(user.organisation_id, dispatch);
      
      onClose(); // close dialog
    } catch (error) {
      toast.error("Failed to delete project. Please try again.");
      console.error(error);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete <strong>"{project.project_name}"</strong>?
          <br />
          <span className="text-destructive">This action cannot be undone.</span>
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="mt-6">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          Yes, Delete Project
        </Button>
      </DialogFooter>
    </>
  );
};

export default DeleteProjectConfirmation;