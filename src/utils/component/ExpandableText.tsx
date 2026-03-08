import { useState } from "react";
import { Text, View } from "react-native";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
  ButtonText,
} from "../../../components/ui";

const ExpandableText = ({
  text,
  initLimit = 100,
  className = "",
}: {
  text: string;
  initLimit?: number;
  className?: string;
}) => {
  const [isOpen, setOpen] = useState(false);
  const limit = initLimit;

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  if (text.length <= limit) return <Text className={className}>{text}</Text>;

  return (
    <View>
      {/* Truncated text */}
      <Text className={className}>
        {text.substring(0, limit)}
        <Text className="text-md text-accentHover" onPress={openModal}>
          ...Show More
        </Text>
      </Text>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalBackdrop />

        <ModalContent>
          <ModalHeader>
            <Text className="text-lg font-bold">Details</Text>
          </ModalHeader>

          <ModalBody>
            <Text className="text-base">{text}</Text>
          </ModalBody>

          <ModalFooter>
            <Button onPress={closeModal}>
              <ButtonText>Close</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
};

export default ExpandableText;
