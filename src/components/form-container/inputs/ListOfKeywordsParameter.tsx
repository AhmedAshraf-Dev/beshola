import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import SelectParameter from "./SelectParameter";
import { useForm } from "react-hook-form";
import { cleanObject } from "../../../utils/operation/cleanObject";
import { useSearch } from "../../../../context/SearchProvider";

function ListOfKeywordsParameter({
  values = [],
  parentID,
  fieldName,
  lookupDisplayField,
  lookupReturnField,
  col,
  filtersMap,
  setParentRow,
}) {
  // const { filtersMap } = useSearch();
  const [keywords, setKeywords] = useState(filtersMap.get(parentID) || []);

  const [options, setOptions] = useState(values);

  const { control, watch, reset } = useForm({});

  // watch select changes
  useEffect(() => {
    const subscription = watch((formValues) => {
      const cleanedValues = cleanObject(formValues);

      const returned = cleanedValues?.[lookupReturnField];
      const selected = cleanedValues?.[lookupDisplayField];
      console.log("====================================");
      console.log(selected, cleanedValues, "selected");
      console.log("====================================");
      if (!selected) return;

      // add keyword
      setKeywords((prev) => {
        if (prev.includes(selected)) return prev;
        filtersMap.set(parentID, [...prev, selected]);
        return [...prev, selected];
      });
      setParentRow((prev) => {
        if (prev.includes(returned)) return prev;
        return [...prev, returned];
      });

      // remove from select options
      setOptions((prev) => prev.filter((opt) => opt !== selected));

      // reset select
      reset({ attributeValue: "" });
    });

    return () => subscription.unsubscribe();
  }, [watch]);

  const removeKeyword = (index) => {
    const removed = keywords[index];
    const newKeywords = keywords.filter((_, i) => i !== index);

    // remove from keywords
    setKeywords(newKeywords);
    filtersMap.set(parentID, newKeywords);

    setParentRow((prev) => prev.filter((_, i) => i !== index));

    // return to select options
    setOptions((prev) => [...prev, removed]);
  };

  return (
    <View>
      <SelectParameter
        values={options}
        fieldName={lookupReturnField}
        control={control}
        lookupDisplayField={lookupDisplayField}
        lookupReturnField={lookupReturnField}
        value={""}
      />

      {/* Keywords */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 12,
          gap: 8,
        }}
      >
        {keywords.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#eee",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
            }}
          >
            <Text style={{ marginRight: 6 }}>{item}</Text>

            <Pressable onPress={() => removeKeyword(index)}>
              <Text style={{ color: "red", fontWeight: "bold" }}>×</Text>
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
  return;
}

export default ListOfKeywordsParameter;
