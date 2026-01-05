import adminReducer from "./adminSlice";
import organisationByAdminReducer from "./organisationByAdminSlice";

const adminReducers = {
  admins: adminReducer,
  organisationsByAdmin: organisationByAdminReducer,
};

export default adminReducers;
