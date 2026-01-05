import organisationReducer from "./organisationSlice";
import companyReducer from "./companySlice";
import departmentReducer from "./departmentSlice";

const memberReducers = {
  organisation: organisationReducer,
  company: companyReducer,
  department: departmentReducer,
};

export default memberReducers;
