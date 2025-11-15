export const getBrowserLangISO = () => {
  if (navigator.languages && navigator.languages.length > 0) {
    return navigator.languages[0].split("-")[0]; // first preferred language
  }
  return (navigator.language || "en").split("-")[0];
};
