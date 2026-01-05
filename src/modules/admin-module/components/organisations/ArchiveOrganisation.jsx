import { useDispatch, useSelector } from "react-redux";
import { archiveOrganisation } from "../../services/organisationByAdminService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { ArchiveButtons } from "@/components/form-fields/FormButtons";

const ArchiveOrganisation = () => {
  const dispatch = useDispatch();
  const organisationInfo = useSelector((state) => state.dialog.props);

  const handleConfirm = () => {
    archiveOrganisation(organisationInfo?.id, dispatch).then(() => {
      dispatch(closeDialog());
    });
  };

  return (
    <div className="-mt-4">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold">Archive Organisation</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Are you sure you want to archive{" "}
          <span className="font-semibold">{organisationInfo?.name}</span>? This
          action cannot be undone.
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 w-full">
          Archiving this organisation will also archive all its associated data
          including members, roles, permissions, and settings. Make sure you
          have backed up any necessary information before proceeding.
        </p>
      </div>

      <ArchiveButtons handleConfirm={handleConfirm} />
    </div>
  );
};

export default ArchiveOrganisation;
