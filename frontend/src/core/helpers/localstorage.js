export const local = (key, value = undefined) => {
  try {
    if (value !== undefined) {
      localStorage.setItem(key, value);
    } else {
      return localStorage.getItem(key);
    }
  } catch (error) {
    console.error("Error accessing localStorage:", error);
  }
};
