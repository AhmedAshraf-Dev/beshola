export const buildFilterRow = (data) => {
  const filters = [];

  Object.keys(data).forEach((key) => {
    const value = data[key];

    if (value === undefined || value === null || value === "") return;

    // ✅ Array → In
    if (Array.isArray(value) && value.length > 0) {
      filters.push({
        field: key,
        operation: "In",
        values: value,
      });
    }

    // ✅ Range object → Single Range operation
    else if (
      typeof value === "object" &&
      value !== null &&
      (value.min !== undefined || value.max !== undefined)
    ) {
      const min = value.min ?? null;
      const max = value.max ?? null;

      // Only push if at least one exists
      if (min !== null || max !== null) {
        filters.push({
          field: key,
          operation: "Range",
          values: [min, max],
        });
      }
    }

    // ✅ Primitive → Equals
    else {
      filters.push({
        field: key,
        operation: "Equals",
        values: [value],
      });
    }
  });

  return filters;
};
