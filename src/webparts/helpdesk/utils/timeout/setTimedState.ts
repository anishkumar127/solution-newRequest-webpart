export const setTimedState = (setState, value, timeout) => {
  setState(value);
  setTimeout(() => {
    setState(!value);
  }, timeout);
};
