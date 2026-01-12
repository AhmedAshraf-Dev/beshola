import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "../../../components/ui";
import { View, Text, ScrollView } from "react-native";
import { ReactNode } from "react";

type SheetProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function Sheet({
  isOpen,
  onClose,
  title,
  children,
}: SheetProps) {
  return (
    <Actionsheet isOpen={isOpen} onClose={onClose} snapPoints={[95]}>
      <ActionsheetBackdrop />

      <ActionsheetContent
        className="bg-body rounded-t-3xl flex-1 items-stretch"
        style={{ width: "100%", maxWidth: "100%" }}
      >
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>

        <View className="px-4 pt-2 pb-4 border-b border-border">
          <Text className="text-base font-bold text-center text-text">
            {title}
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-4 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {children}
        </ScrollView>
      </ActionsheetContent>
    </Actionsheet>
  );
}
