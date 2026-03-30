import React, { useContext, useState } from "react";
import { View, Text, Modal, Pressable, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  Checkbox,
  CheckboxIndicator,
  CheckboxIcon,
  CheckIcon,
} from "../../../../../components/ui";
import { useSelector } from "react-redux";
import TypeFile from "./TypeFile";
import ImageParameterWithPanelActions from "../ImagePathParameter";
import convertImageToBase64 from "../InputActions/ConvertImageToBase64";

function StaticFilesModel({
  modalFileIsOpen,
  setModalFileIsOpen,
  setSelectedFiles,
  title,
  fieldName,
  row,
  handleUpload,
  selectedFiles,
}) {
  const localization = useSelector((state) => state.localization.localization);
  const [files, setFiles] = useState([]);

  const { [fieldName]: _, ...rowWithoutFieldName } = row;

  // 🔥 Pick image from device
  const pickImage = async () => {
    // const result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.All,
    //   quality: 1,
    //   base64: true,
    //   allowsMultipleSelection: true,
    // });
    // if (!result.canceled) {
    //   const selected = result.assets.map((asset, index) => ({
    //     id: Date.now() + index,
    //     file: asset.uri,
    //     type: asset.type || "image",
    //     [fieldName]: asset.base64,
    //     ...rowWithoutFieldName,
    //   }));
    //   setFiles((prev) => [...prev, ...selected]);
    // }
  };

  // 🔥 Select file
  const handleCheckboxChange = (file) => {
    setSelectedFiles((prev) =>
      prev.some((f) => f.id === file.id)
        ? prev.filter((i) => i.id !== file.id)
        : [...prev, file],
    );
  };

  // 🔥 Delete file
  const handleDelete = (id) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleAddMore = () => {
    handleUpload();
    setFiles([]);
    setModalFileIsOpen(false);
  };

  const addFileActions = async (path, type) => {
    try {
      const base64String = await convertImageToBase64(path);
      setFiles((prevFiles) => [
        ...prevFiles,
        {
          file: path,
          id: prevFiles.length,
          [fieldName]: base64String,
          type: type,
          ...rowWithoutFieldName,
        },
      ]);
      return base64String;
    } catch (error) {
      console.error("Failed to convert image to Base64:", error);
      return null;
    }
  };

  return (
    <Modal visible={modalFileIsOpen} animationType="slide" transparent>
      <View className="flex-1 bg-black/80 justify-center p-4">
        <View className="bg-white rounded-2xl p-4 max-h-[80%]">
          {/* Header */}
          <Text className="text-lg font-bold mb-4">
            {localization.webcam.modal.header}
          </Text>

          {/* Files List */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {files.map((photo) => {
              const isSelected = selectedFiles.some((f) => f.id === photo.id);

              return (
                <View key={photo.id} className="mr-4">
                  <View className="w-40 bg-gray-100 rounded-2xl overflow-hidden">
                    {/* Image */}
                    <View className="h-40">
                      <TypeFile
                        file={photo.file}
                        title={title}
                        type={photo.type}
                      />
                    </View>

                    {/* Top Controls */}
                    <View className="absolute top-2 left-2">
                      <Checkbox
                        value={isSelected}
                        onChange={() => handleCheckboxChange(photo)}
                      >
                        <CheckboxIndicator>
                          <CheckboxIcon as={CheckIcon} />
                        </CheckboxIndicator>
                      </Checkbox>
                    </View>

                    <Pressable
                      onPress={() => handleDelete(photo.id)}
                      className="absolute top-2 right-2"
                    >
                      <Ionicons name="close-circle" size={24} color="red" />
                    </Pressable>
                  </View>
                </View>
              );
            })}

            {/* Add New */}
            <ImageParameterWithPanelActions
              fieldName={fieldName || "image"}
              addFile={addFileActions}
              isFileContainer={true}
              // control={}
              enable={true}
              allowDrop={false}
              title={title}
              onChange={() => {}}
            />
          </ScrollView>

          {/* Footer */}
          <View className="flex-row justify-end mt-4 space-x-3">
            <Pressable
              onPress={() => {
                setFiles([]);
                setModalFileIsOpen(false);
              }}
              className="px-4 py-2 bg-gray-300 rounded-lg"
            >
              <Text>{localization.webcam.modal.button.cancel}</Text>
            </Pressable>

            <Pressable
              onPress={handleAddMore}
              className="px-4 py-2 bg-blue-500 rounded-lg"
            >
              <Text className="text-white">
                {localization.webcam.modal.button.capture}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default StaticFilesModel;
