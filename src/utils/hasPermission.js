// Checks if an user has all hod permissions
function areAllHodApprovedTrue(permissions) {
  // Filter keys that end with "Actions"
  const actionKeys = Object.keys(permissions).filter((key) =>
    key.endsWith("Actions")
  );

  // Check all `hod_approve` fields in those action keys
  return actionKeys.every((key) => {
    const actions = permissions[key];
    // eslint-disable-next-line no-prototype-builtins
    return actions.hasOwnProperty("hod_approve")
      ? actions.hod_approve === true
      : true;
  });
}

// Checks if an user has all finance permissions
function areAllFinanceApprovedTrue(permissions) {
  // Filter keys that end with "Actions"
  const actionKeys = Object.keys(permissions).filter((key) =>
    key.endsWith("Actions")
  );

  // Check all `finance_approve` fields in those action keys
  return actionKeys.every((key) => {
    const actions = permissions[key];
    // eslint-disable-next-line no-prototype-builtins
    return actions.hasOwnProperty("finance_approve")
      ? actions.hod_approve === true
      : true;
  });
}

// Checks if an organisation has Finance product
const hasFinanceProduct = (products) => {
  if (!products || !Array.isArray(products)) return false;
  return products.some((p) => p.name === "Finance System");
};

// Checks if an organisation has HR product
const hasHrProduct = (products) => {
  if (!products || !Array.isArray(products)) return false;
  return products.some((p) => p.name === "HRM System");
};

export {
  areAllHodApprovedTrue,
  areAllFinanceApprovedTrue,
  hasFinanceProduct,
  hasHrProduct,
};
