import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import SelectParameter from "./SelectParameter";
import { useForm } from "react-hook-form";
import { cleanObject } from "../../../utils/operation/cleanObject";

function ListOfKeywordsParameter({
  values = [],
  fieldName,
  lookupDisplayField,
  lookupReturnField,
  col,
}) {
  console.log(
    lookupDisplayField,
    lookupReturnField,
    col,
    fieldName,
    "  lookupDisplayField,lookupReturnField",
  );

  const [keywords, setKeywords] = useState([]);

  const [options, setOptions] = useState(
    values.map((v) => v?.[lookupDisplayField]),
  );

  const { control, watch, reset } = useForm({});

  // watch select changes
  useEffect(() => {
    const subscription = watch((formValues) => {
      const cleanedValues = cleanObject(formValues);

      const selected = cleanedValues?.[lookupDisplayField];

      if (!selected) return;

      // add keyword
      setKeywords((prev) => {
        if (prev.includes(selected)) return prev;
        return [...prev, selected];
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

    // remove from keywords
    setKeywords((prev) => prev.filter((_, i) => i !== index));

    // return to select options
    setOptions((prev) => [...prev, removed]);
  };

  return (
    <View>
      <SelectParameter
        values={options}
        fieldName={lookupReturnField}
        control={control}
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
