import { Entypo } from "@expo/vector-icons";
import { Text } from "react-native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

export const LogoutButton = ({ setOpenLogoutAlertDialog }) => {
  const localization = useSelector((state) => state.localization.localization);

  return (
    <TouchableOpacity
      onPress={() => setOpenLogoutAlertDialog(true)}
      className={`flex mx-auto items-center justify-center mt-8 w-72 px-4 py-2 rounded-lg duration-300 transition-all bg-accent text-body`}
    >
      <View className={`flex flex-row items-center gap-1`}>
        <Entypo name="log-out" size={24} className={"!text-body"} />
        <Text className={`!text-body font-medium`}>
          {localization.Hum_screens.profile.logOut.logOut}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
