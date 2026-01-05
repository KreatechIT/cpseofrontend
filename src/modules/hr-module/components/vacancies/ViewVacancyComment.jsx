import { useSelector } from "react-redux";

const ViewVacancyRejectComment = () => {
  const { props: vacancy } = useSelector((state) => state.dialog);

  return (
    <div className="-mt-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold">Reject Reason</h2>

        <div className="bg-white/50 dark:bg-black/30 rounded-md p-3 text-foreground w-full whitespace-pre-wrap text-left text-sm">
          {vacancy.reject_reason || "-"}
        </div>
      </div>
    </div>
  );
};

export default ViewVacancyRejectComment;
