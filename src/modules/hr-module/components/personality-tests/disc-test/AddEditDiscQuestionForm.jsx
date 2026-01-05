import { closeDialog } from "@/store/reducers/dialogSlice";
import { useDispatch, useSelector } from "react-redux";

import { Formik } from "formik";
import InputField from "@/components/form-fields/InputField";

import { FormButtons } from "@/components/form-fields/FormButtons";
import { AddNewQuestionIcon } from "@/components/icons/HrIcons";
import TextareaField from "@/components/form-fields/TextareaField";
import { SelectField } from "@/components/form-fields/SelectField";
import { DISC_PERSONALITY_ENUM } from "../../../lib/hrEnums";
import {
  addNewDiscQuestion,
  updateDiscQuestion,
} from "@/modules/hr-module/services/personalityTestService";
import { addEditDiscQuestionSchema } from "@/modules/hr-module/validations/personalityTestValidationSchema";

const AddEditDiscQuestionForm = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { type: formType, props: questionInfo } = useSelector(
    (state) => state.dialog
  );

  const initialValues = {
    question: questionInfo?.question || "",

    answer_one: questionInfo?.answer_one || "",
    answer_two: questionInfo?.answer_two || "",
    answer_three: questionInfo?.answer_three || "",
    answer_four: questionInfo?.answer_four || "",

    personality_one: questionInfo?.personality_one
      ? DISC_PERSONALITY_ENUM.find(
          (p) => p.label == questionInfo?.personality_one
        ).value
      : "",
    personality_two: questionInfo?.personality_two
      ? DISC_PERSONALITY_ENUM.find(
          (p) => p.label == questionInfo?.personality_two
        ).value
      : "",
    personality_three: questionInfo?.personality_three
      ? DISC_PERSONALITY_ENUM.find(
          (p) => p.label == questionInfo?.personality_three
        ).value
      : "",
    personality_four: questionInfo?.personality_four
      ? DISC_PERSONALITY_ENUM.find(
          (p) => p.label == questionInfo?.personality_four
        ).value
      : "",
  };

  const handleFormSubmit = function (values, { setSubmitting }) {
    const data = { ...values };
    const action =
      formType === "editDiscQuestion"
        ? updateDiscQuestion(
            user?.organisation_id,
            questionInfo.id,
            data,
            dispatch
          )
        : addNewDiscQuestion(user?.organisation_id, data, dispatch);
    action
      .then(() => dispatch(closeDialog()))
      .catch(() => setSubmitting(false));
  };

  return (
    <section>
      <div className="-mt-6 mb-8">
        <AddNewQuestionIcon className="mx-auto size-16 drop-shadow-md" />
        <h2 className="text-center text-xl mt-2 font-medium">
          {formType === "addNewDiscQuestion"
            ? "Add New Question"
            : "Edit Question"}
        </h2>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={addEditDiscQuestionSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          setFieldValue,
          isSubmitting,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="my-1 space-y-4 grid grid-cols-1 gap-x-4"
          >
            <TextareaField
              fieldName="question"
              label="question"
              value={values.question}
              error={errors.question}
              touched={touched.question}
              handleChange={handleChange}
              placeholder="Enter question"
            />

            <div>
              <p>Answer</p>
              <div className="space-y-4 border p-2 pt-0 px-0 rounded-md">
                <div className="text-sm grid grid-cols-1 md:grid-cols-[100px_1fr_0.5fr] gap-4 bg-primary/5 p-2 py-2.5">
                  <div>Option</div>
                  <div>Answer</div>
                  <div>Type</div>
                </div>
                {[
                  {
                    label: "A",
                    answerKey: "answer_one",
                    personalityKey: "personality_one",
                  },
                  {
                    label: "B",
                    answerKey: "answer_two",
                    personalityKey: "personality_two",
                  },
                  {
                    label: "C",
                    answerKey: "answer_three",
                    personalityKey: "personality_three",
                  },
                  {
                    label: "D",
                    answerKey: "answer_four",
                    personalityKey: "personality_four",
                  },
                ].map(({ label, answerKey, personalityKey }) => (
                  <div
                    key={answerKey}
                    className="grid grid-cols-1 md:grid-cols-[100px_1fr_0.5fr] gap-4 px-2"
                  >
                    <div className="flex items-center">
                      <div className="size-7 grid rounded-full place-items-center bg-gray-200 dark:bg-accent text-sm">
                        {label}
                      </div>
                    </div>

                    <InputField
                      fieldName={answerKey}
                      label={`Answer ${label}`}
                      value={values[answerKey]}
                      error={errors[answerKey]}
                      touched={touched[answerKey]}
                      handleChange={handleChange}
                      placeholder="Enter answer"
                      showLabel={false}
                    />
                    <SelectField
                      options={DISC_PERSONALITY_ENUM}
                      fieldName={personalityKey}
                      label={`Personality ${label}`}
                      value={values[personalityKey]}
                      error={errors[personalityKey]}
                      touched={touched[personalityKey]}
                      setFieldValue={setFieldValue}
                      placeholder="Select type"
                      showLabel={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <FormButtons isSubmitting={isSubmitting} />
            </div>
          </form>
        )}
      </Formik>
    </section>
  );
};

export default AddEditDiscQuestionForm;
