import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { theme } from "../../Theme";
import { addAlpha } from "../../utils/operation/addAlpha";

export default function TableCard({ schema = {}, item, setRow }) {
  return (
    <TouchableOpacity
  className="p-2 rounded-xl mb-2 flex-row gap-1 w-fit"
  style={{
    backgroundColor: addAlpha(theme.accent, 0.5),
    borderWidth: 1,               // ✅ add border
    borderColor: theme.accent,    // 🔹 same color as accent or any color you like
  }}
  onPress={() => setRow(item)}
>
      <Text className="!text-xs font-semibold text-accent">
        {
          item?.[
            schema?.dashboardFormSchemaParameters.find(
              (param) =>
                (param.parameterType === "displayText" ||
                  param.parameterType === "text") &&
                !param.isIDField,
            )?.parameterField || "text"
          ]
        }
      </Text>
    </TouchableOpacity>
  );
}
