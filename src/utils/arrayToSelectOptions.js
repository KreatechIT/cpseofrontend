/**
 * Converts an array of objects into an array of options
 * formatted for use in <select> elements, dropdowns, or similar UI components.
 *
 * @param {Array<Object>} originalArray - The original array of data objects.
 * @param {string} labelName - The key name in each object to use as the label in the option.
 * @param {string} valueName - The key name in each object to use as the value in the option.
 *
 * @returns {Array<{ label: string, value: any }>} - An array formatted as select options.
 *
 * @example
 * const users = [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }];
 * const options = makeSelectOptionsFormat(users, "name", "id");
 * // options => [{ label: "Alice", value: 1 }, { label: "Bob", value: 2 }]
 */
export const arrayToSelectOptions = (originalArray, labelName, valueName) => {
  if (!Array.isArray(originalArray)) return [];

  const options = originalArray.map((element) => ({
    label: element[labelName], // Use specified field as label
    value: element[valueName], // Use specified field as value
  }));

  return options;
};

/**
 * Filters departments by a single selected company ID.
 *
 * @param {string} company_id - Selected company ID
 * @param {Array} departments - Array of department objects
 * @returns {Array} - Filtered departments formatted as select options
 */
export const filterDepartmentsBySelectedCompany = (company_id, departments) => {
  if (!company_id) return []; // Return empty array if no company is selected

  // Filter departments that belong to the selected company
  const filteredDepartments = departments.filter((dept) =>
    dept.companies.some((company) => company.id === company_id)
  );

  // Convert filtered departments to select options ({ label, value })
  return arrayToSelectOptions(filteredDepartments, "name", "id");
};

/**
 * Filters departments by multiple selected companies.
 *
 * @param {Array} companies - Array of selected company objects ({ value, label })
 * @param {Array} departments - Array of department objects
 * @returns {Array} - Filtered departments formatted as select options
 */
export const filterDepartmentsBySelectedCompanies = (
  companies,
  departments
) => {
  if (!Array.isArray(companies)) return [];

  // Extract IDs of selected companies
  const companyIds = companies.map((company) => company.value);

  // Filter departments that belong to any of the selected companies
  const filteredDepartments = departments?.filter((dept) =>
    dept.companies.some((company) => companyIds.includes(company.id))
  );

  return arrayToSelectOptions(filteredDepartments, "name", "id");
};

/**
 * Filters sub-departments by a single selected department ID.
 *
 * @param {string} department_id - Selected department ID
 * @param {Array} subDepartments - Array of sub-department objects
 * @returns {Array} - Filtered sub-departments formatted as select options
 */
export const filterSubDepartmentsBySelectedDept = (
  department_id,
  subDepartments
) => {
  if (!department_id) return [];

  const filteredSubDepartments = subDepartments?.filter(
    (subDept) => subDept.department_id === department_id
  );

  return arrayToSelectOptions(filteredSubDepartments, "name", "id");
};

/**
 * Filters sub-departments by multiple selected departments.
 *
 * @param {Array} departments - Array of selected department objects ({ value, label })
 * @param {Array} subDepartments - Array of sub-department objects
 * @returns {Array} - Filtered sub-departments formatted as select options
 */
export const filterSubDepartmentsBySelectedDepartments = (
  departments,
  subDepartments
) => {
  if (!Array.isArray(departments)) return [];

  // Extract IDs of selected departments
  const departmentIds = departments.map((dept) => dept.value);

  // Filter sub-departments that belong to any of the selected departments
  const filteredSubDepartments = subDepartments?.filter((subDept) =>
    departmentIds.includes(subDept.department_id)
  );

  return arrayToSelectOptions(filteredSubDepartments, "name", "id");
};

/**
 * Filters sub-categories by a selected category ID.
 *
 * @param {string} categoryId - Selected category ID
 * @param {Array} subCategories - Array of sub-category objects
 * @returns {Array} - Filtered sub-categories formatted as select options
 */
export const filterSubCategoriesBySelectedCategory = (
  categoryId,
  subCategories
) => {
  if (!Array.isArray(subCategories)) return [];

  const filteredSubCategories = subCategories?.filter(
    (subCat) => subCat.expenses_category_id === categoryId
  );

  return arrayToSelectOptions(filteredSubCategories, "name", "id");
};

/**
 * Filters sub-sub-categories by a selected sub-category ID.
 *
 * @param {string} subCategoryId - Selected sub-category ID
 * @param {Array} subSubCategories - Array of sub-sub-category objects
 * @returns {Array} - Filtered sub-sub-categories formatted as select options
 */
export const filterSubSubCategoriesBySelectedSubCategory = (
  subCategoryId,
  subSubCategories
) => {
  if (!Array.isArray(subSubCategories)) return [];

  const filteredSubCategories = subSubCategories?.filter(
    (subCat) => subCat.expenses_sub_category_id === subCategoryId
  );

  return arrayToSelectOptions(filteredSubCategories, "name", "id");
};
