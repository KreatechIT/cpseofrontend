import * as Yup from "yup";

const addEditReferralSchema = Yup.object().shape({
  refferals_id: Yup.string().required("Referrals id is required"),
  referrer_name: Yup.string().required("Referrer name is required"),
  referee_name: Yup.string().required("Referre name is required"),
  job_reffered: Yup.string().required("Job referred is required"),
  refferals_bonus: Yup.number().required(
    "Referrals bonus referred is required"
  ),
});

export { addEditReferralSchema };
