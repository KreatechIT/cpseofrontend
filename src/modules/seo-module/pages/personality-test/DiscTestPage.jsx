import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { SuccessIcon } from "@/components/icons/Icons";
import { getPublicDiscQuestions } from "../../services/personalityTestService";
import DISCTestForm from "../../components/personality-tests/disc-test/DiscTestForm";

const DiscTestPage = () => {
  const { organisation_id, disc_link_id } = useParams();

  const [discQuestions, setDiscQuestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAppliedSuccessfully, setIsAppliedSuccessfully] = useState(false);

  useEffect(() => {
    const fetchDiscQuestions = async () => {
      try {
        setLoading(true);
        const data = await getPublicDiscQuestions(organisation_id);
        setDiscQuestions(data);
      } catch (err) {
        console.error("Failed to fetch test:", err);
        setError("Test not found or an error occurred.");
      } finally {
        setLoading(false);
      }
    };

    if (organisation_id) {
      fetchDiscQuestions();
    }
  }, [organisation_id]);

  return (
    <div className="dark:bg-white h-screen">
      <title>DISC Test - Core360</title>

      <main className="flex h-full flex-col justify-center items-center mx-auto text-sm">
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && discQuestions && (
          <>
            {isAppliedSuccessfully ? (
              <div className="text-center">
                <div className="flex justify-center">
                  <SuccessIcon className="size-16 mb-2" />
                </div>
                <h2 className="text-2xl font-semibold text-black">
                  DISC Test Submitted Successfully!
                </h2>
                <p className="text-base mt-2 font-medium text-black/70">
                  Thank you for submitting the test!
                </p>
              </div>
            ) : (
              <DISCTestForm
                questions={discQuestions}
                organisation_id={organisation_id}
                disc_link_id={disc_link_id}
                setIsAppliedSuccessfully={setIsAppliedSuccessfully}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default DiscTestPage;
