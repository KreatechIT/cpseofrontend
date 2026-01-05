import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import DISCBgImg from "@/assets/images/disc-bg.png";
import { toast } from "sonner";
import axiosInstance from "@/services/axiosInstance";

export default function DISCTestForm({
  questions,
  organisation_id,
  disc_link_id,
  setIsAppliedSuccessfully,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    if (!selected) {
      toast.error("Please select an answer.");
      return;
    }

    const updated = [...answers];
    updated[currentIndex] = {
      question_id: currentQuestion.id,
      answer: parseInt(selected),
    };

    setAnswers(updated);
    setSelected(null);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelected(updated[currentIndex + 1]?.answer?.toString() ?? null);
    } else {
      submitResults(updated);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelected(answers[currentIndex - 1]?.answer?.toString() ?? null);
    }
  };

  const submitResults = async (finalAnswers) => {
    let d = 0,
      i = 0,
      s = 0,
      c = 0;

    finalAnswers.forEach(({ question_id, answer }) => {
      const q = questions.find((q) => q.id === question_id);
      if (!q) return;

      const personality = {
        1: q.personality_one,
        2: q.personality_two,
        3: q.personality_three,
        4: q.personality_four,
      }[answer];

      if (personality === "D") d++;
      else if (personality === "I") i++;
      else if (personality === "S") s++;
      else if (personality === "C") c++;
    });

    const payload = {
      d_count: d,
      i_count: i,
      s_count: s,
      c_count: c,
      question_set: finalAnswers,
    };

    try {
      await axiosInstance.post(
        `/hr/${organisation_id}/${disc_link_id}/post-disc-results/`,
        payload
      );
      setIsAppliedSuccessfully(true);
    } catch {
      toast.error("Failed to submit", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <section className="h-screen w-full relative text-black">
      {/* Background Layer */}
      <div className="absolute w-full h-full bg-gradient-to-br from-white to-[#C0D3FF] z-0" />
      <div className="absolute w-full h-full z-0 top-0 left-0">
        <img
          src={DISCBgImg}
          className="w-full h-full object-cover"
          alt="Background"
        />
      </div>

      {/* Content */}
      <div className="w-full h-full relative grid place-items-center px-4 py-12 z-10">
        <div className="w-full border max-w-xl bg-white rounded-lg p-6 shadow-md space-y-6">
          <h2 className="text-primary font-bold text-2xl">DISC Test</h2>
          <h2 className="text-black font-medium text-lg">
            Question {currentIndex + 1}/{questions.length}
          </h2>

          <div className="border border-black/5 p-3 rounded-lg">
            <p className="text-base font-semibold mb-4">
              {currentQuestion.question}
            </p>

            <RadioGroup
              value={selected ?? ""}
              onValueChange={setSelected}
              className="space-y-4"
            >
              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value="1"
                  id="opt1"
                  className="border-black/30"
                />
                <label htmlFor="opt1">A. {currentQuestion.answer_one}</label>
              </div>
              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value="2"
                  id="opt2"
                  className="border-black/30"
                />
                <label htmlFor="opt2">B. {currentQuestion.answer_two}</label>
              </div>
              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value="3"
                  id="opt3"
                  className="border-black/30"
                />
                <label htmlFor="opt3">C. {currentQuestion.answer_three}</label>
              </div>
              <div className="flex items-start gap-3">
                <RadioGroupItem
                  value="4"
                  id="opt4"
                  className="border-black/30"
                />
                <label htmlFor="opt4">D. {currentQuestion.answer_four}</label>
              </div>
            </RadioGroup>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                className="border border-black/50 dark:border-black/10 hover:text-black"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                Previous
              </Button>
              <Button onClick={handleNext}>
                {currentIndex === questions.length - 1 ? "Submit" : "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
