export const isArrayValidated = (value) => {
  if (value == null || value == undefined || value.length === 0) {
    return false;
  } else {
    return true;
  }
};
