export function localizeSchema(schema, translations, reverseTranslations) {
  if (!schema || !translations) return schema;
  const newSchema = JSON.parse(JSON.stringify(schema));

  if (newSchema.dashboardFormSchemaInfoDTOView) {
    const info = newSchema.dashboardFormSchemaInfoDTOView;
    Object.keys(info).forEach((key) => {
      const value = info[key];
      // prefer translate by key
      if (translations[key]) info[key] = translations[key];
      else if (typeof value === "string") {
        const originalKey = reverseTranslations?.[value] || value;
        info[key] = translations[originalKey] || translations[value] || value;
      }
    });
  }

  if (Array.isArray(newSchema.dashboardFormSchemaParameters)) {
    newSchema.dashboardFormSchemaParameters =
      newSchema.dashboardFormSchemaParameters.map((param) => {
        const updated = { ...param };
        const title = updated.parameterTitel;
        // map value -> original key (from reverse map) if needed
        const originalKey = reverseTranslations?.[title] || title;

        if (translations[updated.parameterField]) {
          updated.parameterTitel = translations[updated.parameterField];
        } else if (translations[originalKey]) {
          updated.parameterTitel = translations[originalKey];
        } else if (translations[title]) {
          updated.parameterTitel = translations[title];
        }

        if (
          updated.parameterType === "radio" &&
          Array.isArray(updated.values)
        ) {
          updated.values = updated.values.map((val) => {
            const origVal = reverseTranslations?.[val] || val;
            return translations[origVal] || translations[val] || val;
          });
        }

        return updated;
      });
  }
  return newSchema;
}
