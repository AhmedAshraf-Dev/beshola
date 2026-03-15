import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Linking, TouchableOpacity } from "react-native";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTrigger,
  Divider,
  HStack,
  Text,
  VStack,
} from "../../../components/ui";
import { theme } from "../../Theme";
import { isRTL } from "../../utils/operation/isRTL";
import PricePlanSummary from "../../kitchensink-components/cart/InvoiceSummary";

export default function PricePlansInput({ pricePlans = [], fieldsType }) {
  const { control, watch, setValue } = useForm({
    defaultValues: { selectedPlan: "0" },
  });

  const selectedPlanIndex = watch("selectedPlan");

  const handleOpenMap = (location) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location,
    )}`;
    Linking.openURL(url);
  };

  return (
    <Controller
      control={control}
      name="selectedPlan"
      render={({ field: { value } }) =>
        pricePlans.map((plan, index) => {
          const isSelected = value === index.toString();

          const name = plan?.[fieldsType?.name];

          return (
            <TouchableOpacity
              key={plan?.[fieldsType?.id] || index}
              activeOpacity={0.8}
              onPress={() => setValue("selectedPlan", index.toString())}
              className={isSelected ? "!border-accentHover" : ""}
              style={{
                borderWidth: isSelected ? 2 : 1,
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 10,
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
                        >
                          <MaterialCommunityIcons
                            name="cash-multiple"
                            size={20}
                            color={theme.secondary}
                          />

                          <Text className="text-md font-bold">
                            {name || `Plan ${index + 1}`}
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

                    {/* PLAN SUMMARY */}
                    <PricePlanSummary
                      plan={plan} // ✅ fixed
                      schemaFieldsTypes={fieldsType}
                      isExpanded={true}
                    />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TouchableOpacity>
          );
        })
      }
    />
  );
}
