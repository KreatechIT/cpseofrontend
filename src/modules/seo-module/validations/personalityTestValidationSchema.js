import * as Yup from "yup";

export const addEditDiscQuestionSchema = Yup.object()
  .shape({
    question: Yup.string().required("Question is required"),

    answer_one: Yup.string().required("Answer is required"),
    answer_two: Yup.string().required("Answer is required"),
    answer_three: Yup.string().required("Answer is required"),
    answer_four: Yup.string().required("Answer is required"),

    personality_one: Yup.string().required("Type is required"),
    personality_two: Yup.string().required("Type is required"),
    personality_three: Yup.string().required("Type is required"),
    personality_four: Yup.string().required("Type is required"),
  })
  .test(
    "unique-personalities",
    "Personality types must be unique",
    function (values) {
      const personalities = [
        values.personality_one,
        values.personality_two,
        values.personality_three,
        values.personality_four,
      ];
      const unique = new Set(personalities);
      return unique.size === personalities.length;
    }
  );
