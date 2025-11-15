import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Pressable, View } from "react-native";
import { useSelector } from "react-redux";
import { Card } from "../../../components/ui";
import { CompanyCardWeb } from "../cards";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { theme } from "../../Theme";
import PricePlansSection from "../cards/PricePlansSection";

//todo update att when any param changes
//todo then take att and make utility that helps to get the correct item form items by attribute so the utility with make sure that the two objs is the same
//todo then update the item my item that get from the attributes

const CompanyCardView = ({
  itemPackage,
  selectedItems,
  setSelectedItems,
  schemaActions,
}) => {
  //!uncomment the attribute
  const [item, setItem] = useState(itemPackage);
  // const [att, setAtt] = useState(item.attribute);
  const navigation = useNavigation();
  const fieldsType = useSelector((state) => state.menuItem.fieldsType);
  const selected = selectedItems.find(
    (selected) => selected[fieldsType.idField] === item[fieldsType.idField]
  );
  // Form control
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    // defaultValues: att, // Set initial form values
  });

  // Watch form values and update att when they change
  // useEffect(() => {
  //   const subscription = watch((values) => {
  //     setAtt(values);
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);
  // useEffect(() => {
  //   const findMatchingItem = (items, att) => {
  //     return items.find((item) => areObjectsEqual(item.attribute, att));
  //   };
  //   if (itemPackage.items) {
  //     setItem(findMatchingItem(itemPackage.items, att));
  //   }
  // }, [att]);
  // useEffect(() => {
  //   setItem(itemPackage);
  //   setAtt(itemPackage.attribute);
  // }, [itemPackage]);
  const handleLongPress = () => {
    if (selected) {
      setSelectedItems(
        selectedItems.filter(
          (selectedItem) =>
            selectedItem[fieldsType.idField] !== selected[fieldsType.idField]
        )
      );
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  const handlePress = () => {
    if (selectedItems.length > 0) {
      handleLongPress();
    } else {
      // navigation.navigate("DetailsProductScreen", {
      //   item: item,
      //   fieldsType: fieldsType,
      //   schemaActions: schemaActions,
      // });
    }
  };
  return (
    // <Pressable
    //   onPress={handlePress}
    //   onLongPress={handleLongPress}
    //   className="h-full"
    // >
    <View className="mb-3">
      <View
        className="flex-row rounded-t-xl space-x-2 z-20 border-2 w-full p-1 bg-body border-dark_card"
        style={{ direction: "inherit", justifyContent: "flex-end" }}
      >
        <TouchableOpacity
          className="px-3 text-dark_card flex-row justify-center items-center rounded-full shadow"
          onPress={() => console.log("Compare pressed")}
        >
          <Text className="text-[10px] font-semibold text-dark_card">
            +Compare
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className=" p-2 rounded-full shadow"
          onPress={() => console.log("Share pressed")}
        >
          <Feather name="share-2" size={16} color={theme.dark_card} />
        </TouchableOpacity>

        <TouchableOpacity
          className="p-2 rounded-full shadow"
          onPress={() => console.log("Favorite pressed")}
        >
          <Feather name="heart" size={16} color={theme.dark_card} />
        </TouchableOpacity>
      </View>
      <Card
        className={`items-center overflow-hidden border relative h-full ${
          selected ? "border-2 border-green-500 bg-green-100" : "bg-dark_card"
        }`}
      >
        {/* ✅ Top Right Buttons Row */}

        {/* ✅ Main Company Card Content */}
        <View className="!size-full">
          <CompanyCardWeb
            item={itemPackage}
            fieldsType={fieldsType}
            schemaActions={schemaActions}
          />
        </View>
      </Card>
      {/* Price Plans */}

      <PricePlansSection pricePlans={item.pricePlans} />
    </View>

    // </Pressable>
  );
};

export default CompanyCardView;
