import React, { useState } from "react";
import { TouchableOpacity, Linking, I18nManager, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
  AccordionIcon,
  Box,
  VStack,
  HStack,
  Text,
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  ButtonText,
  Divider,
} from "../../../components/ui";
import { useForm, Controller } from "react-hook-form";
import { theme } from "../../Theme";
import { isRTL } from "../../utils/operation/isRTL";
import PricePlansInput from "./PricePlansInput";

const PricePlansSection = ({ pricePlans }) => {
  const [openModal, setOpenModal] = useState(false);
  const { control, watch, setValue } = useForm({
    defaultValues: { selectedPlan: "0" },
  });

  const selectedPlanIndex = watch("selectedPlan");
  const selectedPlan = pricePlans[selectedPlanIndex];

  const handleOpenMap = (location) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location
    )}`;
    Linking.openURL(url);
  };

  return (
    <Box className="items-center">
      <TouchableOpacity
        className="w-full flex-row items-center justify-center px-5 py-3 rounded-b-xl rounded-t-none shadow-md"
        style={{ backgroundColor: theme.secondary }}
        onPress={() => setOpenModal(true)}
      >
        <MaterialCommunityIcons
          name="currency-usd"
          size={20}
          color={theme.body}
        />
        <Text
          className={`text-body font-semibold text-md ml-2 ${
            isRTL() ? "text-right" : "text-left"
          }`}
        >
          View Price Plans
        </Text>
      </TouchableOpacity>

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <ModalBackdrop />
        <ModalContent className="rounded-2xl relative bg-body p-3 max-h-[80vh]">
          <ModalHeader
            style={{
              backgroundColor: theme.accent,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 16,
            }}
          >
            <HStack
              style={{
                flexDirection: isRTL() ? "row-reverse" : "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <Text
                style={{
                  color: theme.body,
                  fontSize: 18,
                  fontWeight: "700",
                }}
              >
                Price Plans
              </Text>
              <TouchableOpacity onPress={() => setOpenModal(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color={theme.body}
                />
              </TouchableOpacity>
            </HStack>
          </ModalHeader>

          <ModalBody>
            <VStack className="space-y-3 mt-1">
              {/* <Controller
                control={control}
                name="selectedPlan"
                render={({ field: { value } }) =>
                  pricePlans.map((plan, index) => {
                    const isSelected = value === index.toString();
                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={() =>
                          setValue("selectedPlan", index.toString())
                        }
                        className={isSelected && `!border-accentHover`}
                        style={{
                          borderWidth: isSelected ? 2 : 1,
                          borderRadius: 12,
                          overflow: "hidden",
                        }}
                      >
                        <Accordion
                          type="single"
                          collapsible
                          className={`bg-bg-body rounded-xl shadow-sm ${
                            isSelected ? "bg-bg-selected" : ""
                          }`}
                        >
                          <AccordionItem value={`plan-${index}`}>
                            <AccordionHeader>
                              <AccordionTrigger>
                                <HStack
                                  className={`justify-between items-center w-full ${
                                    isRTL() ? "flex-row-reverse" : "flex-row"
                                  }`}
                                  style={{ padding: 12 }}
                                >
                                  <HStack
                                    className={`items-center space-x-2 ${
                                      isRTL() ? "flex-row-reverse" : "flex-row"
                                    }`}
                                    style={{ direction: "inherit" }}
                                  >
                                    <MaterialCommunityIcons
                                      name={plan.icon || "cube-outline"}
                                      size={20}
                                      color={theme.secondary}
                                    />
                                    <Text
                                      className="text-md font-bold"
                                      // style={{ color: theme.secondary }}
                                    >
                                      {plan.name}
                                    </Text>
                                  </HStack>
                                  <AccordionIcon
                                    as={() => (
                                      <MaterialCommunityIcons
                                        name="chevron-down"
                                        size={22}
                                        color={theme.text}
                                      />
                                    )}
                                  />
                                </HStack>
                              </AccordionTrigger>
                            </AccordionHeader>

                            <AccordionContent className="bg-bg-tertiary rounded-b-xl px-4 py-3">
                              <Divider className="my-2 bg-outline-50" />
                              <VStack className="space-y-2">
                                <Text className="text-text text-sm">
                                  Price:{" "}
                                  <Text className="text-accent font-bold">
                                    {plan.price}
                                  </Text>
                                </Text>
                                {plan.area && (
                                  <Text className="text-text text-sm">
                                    Area: {plan.area} m²
                                  </Text>
                                )}
                                {plan.paymentPlan && (
                                  <Text className="text-text text-sm">
                                    Payment: {plan.paymentPlan}
                                  </Text>
                                )}
                                {plan.deliveryDate && (
                                  <Text className="text-text text-sm">
                                    Delivery: {plan.deliveryDate}
                                  </Text>
                                )}
                                {plan.location && (
                                  <TouchableOpacity
                                    onPress={() => handleOpenMap(plan.location)}
                                    className="bg-primary flex-row items-center px-2 py-1 rounded-lg w-fit mt-1"
                                  >
                                    <MaterialCommunityIcons
                                      name="map-marker-outline"
                                      size={16}
                                      color={theme.body}
                                    />
                                    <Text className="text-body text-xs ml-1">
                                      {plan.location}
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              </VStack>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </TouchableOpacity>
                    );
                  })
                }
              /> */}
              <PricePlansInput pricePlans={pricePlans} />
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              className="bg-accent rounded-xl px-5"
              onPress={() => setOpenModal(false)}
            >
              <ButtonText>
                {selectedPlan ? `Selected: ${selectedPlan.name}` : "Close"}
              </ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PricePlansSection;
