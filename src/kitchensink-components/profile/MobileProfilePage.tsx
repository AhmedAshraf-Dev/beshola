import { Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSelector } from "react-redux";
import { Divider, Text } from "../../../components/ui";
import { useAuth } from "../../../context/auth";
import { useSchemas } from "../../../context/SchemaProvider";
import LanguageSelector from "../../components/language/LanguageSelector";
import { CollapsibleSection } from "../../utils/component/Collapsible";
import LogoutAlertDialog from "../LogoutAlertDialog";
import OrderCollapse from "./PurchasesCollapse";
import VoucherCardList from "./VoucherCardList";

import { LogoutButton } from "./LogoutButton";
import PersonalInfo from "./PersonalInfo";
import Security from "./Security";
import { GetIconContact } from "../../utils/component/GetIconContact";
import PurchasesCollapse from "./PurchasesCollapse";
import { theme } from "../../Theme";

const MobileProfilePage = () => {
  const [openLogoutAlertDialog, setOpenLogoutAlertDialog] = useState(false);
  const { userGust } = useAuth();
  const { signupState, scratchVoucherCardState } = useSchemas();
  const localization = useSelector((state) => state.localization.localization);
  const masterBranch = useSelector((state) => state.location.workingHours);

  const getCollapse = (type) =>
    localization.Hum_screens.profile.collapses.find(
      (collapse) => collapse.type === type
    );

  return (
    <ScrollView style={{ flex: 1, height: "100%" }}>
      <View className="flex flex-col md:!flex-row gap-0 md:!gap-x-12">
        <PersonalInfo />
        <View className="flex-1">
          {!userGust && (
            <View className="flex-1">
              <Divider className="my-2" />

              <CollapsibleSection
                title={getCollapse("setting").title}
                icon={() => <Feather name="settings" size={22} />}
                setheader
              >
                <LanguageSelector key={1} />
              </CollapsibleSection>
              <Divider className="my-2" />
              <CollapsibleSection
                title={
                  scratchVoucherCardState.schema.dashboardFormSchemaInfoDTOView
                    .schemaHeader
                }
                setheader
                icon={() => <Feather name="tag" size={22} />}
              >
                <VoucherCardList />
              </CollapsibleSection>
              <Divider className="my-2" />
              <CollapsibleSection
                title={getCollapse("security").title}
                setheader
                icon={() => <Feather name="lock" size={22} />}
              >
                <Security />
              </CollapsibleSection>
              <Divider className="my-2" />
              <CollapsibleSection
                setheader
                title={getCollapse("purchases").title}
                icon={() => (
                  <FontAwesome
                    name="shopping-bag"
                    size={22}
                    color={theme.text}
                  />
                )}
              >
                <PurchasesCollapse />
              </CollapsibleSection>
              <Divider className="my-2" />
              <CollapsibleSection
                title={getCollapse("support").title}
                icon={() => <Feather name="headphones" size={22} />}
                setheader
              >
                <View className="flex-row flex-wrap justify-center items-center gap-3">
                  {masterBranch?.companyBranchContacts?.map((contact) => (
                    <View key={contact.contactTypeID}>
                      {GetIconContact(contact.codeNumber, 22, contact.contact)}
                    </View>
                  ))}
                </View>
              </CollapsibleSection>
            </View>
          )}
        </View>
      </View>
      <LogoutButton setOpenLogoutAlertDialog={setOpenLogoutAlertDialog} />
      <LogoutAlertDialog
        setOpenLogoutAlertDialog={setOpenLogoutAlertDialog}
        openLogoutAlertDialog={openLogoutAlertDialog}
      />
    </ScrollView>
  );
};

export default MobileProfilePage;
