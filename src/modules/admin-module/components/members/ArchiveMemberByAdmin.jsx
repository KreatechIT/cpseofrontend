import { useDispatch, useSelector } from "react-redux";
import { archiveMember } from "../../services/organisationByAdminService";
import { closeDialog } from "@/store/reducers/dialogSlice";
import { ArchiveButtons } from "@/components/form-fields/FormButtons";

const ArchiveMemberByAdmin = () => {
  const dispatch = useDispatch();
  const { organisation_id, memberInfo } = useSelector(
    (state) => state.dialog.props
  );

  const handleConfirm = () => {
    archiveMember(organisation_id, memberInfo?.id, dispatch).then(() => {
      dispatch(closeDialog());
    });
  };

  return (
    <div className="-mt-4">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold">Archive Member</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 w-full">
          Are you sure you want to archive{" "}
          <span className="font-semibold">{`${memberInfo?.first_name} ${memberInfo?.last_name}`}</span>
          ? This action cannot be undone.
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 w-full">
          Archiving this member will also archive all its associated data. Make
          sure you have backed up any necessary information before proceeding.
        </p>
      </div>

      <ArchiveButtons handleConfirm={handleConfirm} />
    </div>
  );
};

export default ArchiveMemberByAdmin;
