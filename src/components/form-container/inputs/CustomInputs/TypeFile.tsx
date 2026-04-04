import React, { useState } from "react";
import { View, Pressable, Image, Modal } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useSelector } from "react-redux";
import { Button, ButtonText } from "../../../../../components/ui";

function TypeFile({ file, title, type = false }) {
  const [modalOpen, setModalOpen] = useState(false);
  const localization = useSelector((state) => state.localization.localization);

  const fileSrc = file;
  const typeFile = type || "";

  // ✅ Create player ONLY for video
  const player = useVideoPlayer(
    typeFile?.startsWith("video") ? { uri: fileSrc } : null,
    (player) => {
      player.loop = false;
    },
  );

  const toggleModal = () => {
    setModalOpen((prev) => !prev);
  };

  // 🔥 Render content
  const renderFileContent = (full = false) => {
    // ✅ IMAGE
    if (typeFile?.startsWith("image") || typeFile === "publicImage") {
      return (
        <Image
          source={{ uri: fileSrc }}
          style={{
            width: "100%",
            height: full ? "80%" : 150,
            borderRadius: 12,
          }}
          resizeMode={full ? "contain" : "cover"} // 🔥 مهم جداً
        />
      );
    }

    // ✅ VIDEO
    if (typeFile?.startsWith("video") && player) {
      return (
        <VideoView
          style={{
            width: "100%",
            height: full ? "60%" : 150,
            borderRadius: 12,
          }}
          player={player}
          allowsFullscreen
          allowsPictureInPicture
          contentFit="contain"
        />
      );
    }

    // ✅ DEFAULT
    return (
      <View className="p-4 bg-gray-200 rounded-xl">
        <Button>
          <ButtonText>{localization.fileContainer.fileNotSupport}</ButtonText>
        </Button>
      </View>
    );
  };

  return (
    <View className="w-full">
      {/* Preview */}
      <Pressable onPress={toggleModal}>{renderFileContent(false)}</Pressable>

      {/* Modal */}
      <Modal visible={modalOpen} animationType="fade" transparent>
        <View className="flex-1 bg-black/90 justify-center items-center p-4">
          {/* Full Content */}
          <View className="w-full h-full justify-center items-center">
            {renderFileContent(true)}

            <Button className="mt-4" onPress={toggleModal}>
              <ButtonText>Close</ButtonText>
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default TypeFile;
