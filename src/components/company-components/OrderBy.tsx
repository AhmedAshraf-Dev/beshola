import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import { Feather } from "@expo/vector-icons";

const options = [
  { id: "1", label: "Price: Low to High" },
  { id: "2", label: "Price: High to Low" },
  { id: "3", label: "Name: A to Z" },
  { id: "4", label: "Name: Z to A" },
];

const OrderBy = ({ selected, setSelected }) => {
  const [open, setOpen] = useState(false);

  return (
    <View className="mb-3">
      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="flex-row justify-between items-center bg-white rounded-2xl shadow-sm px-4 py-3"
      >
        <Text className="text-primary text-base font-medium">
          {selected || "Order By"}
        </Text>
        <Feather name="chevron-down" size={20} color="#6B7280" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="bg-white rounded-2xl w-80 p-4">
            <Text className="text-lg font-semibold text-primary mb-3">
              Sort by
            </Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-2"
                  onPress={() => {
                    // setSelected(item.label);
                    setOpen(false);
                  }}
                >
                  <Text className="text-base text-primary">{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OrderBy;
