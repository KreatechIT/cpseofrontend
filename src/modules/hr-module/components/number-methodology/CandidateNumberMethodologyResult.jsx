import { useSelector } from "react-redux";
import NumberMethodologyResult from "./NumberMethodologyResult";

const CandidateNumbereMethodologyResult = () => {
  const birthDate = useSelector((state) => state.dialog.props);

  return (
    <div>
      <h2 className="text-xl font-semibold text-center">
        Number Methodology Result
      </h2>
      <NumberMethodologyResult birthDate={birthDate} />
    </div>
  );
};

export default CandidateNumbereMethodologyResult;
