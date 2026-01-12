import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "../../../components/ui";
import { View, Vibration } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons"; // expo vector icons
import { theme } from "../../Theme";

export function useDisplayToast() {
  const toast = useToast();

  const icons: Record<string, JSX.Element> = {
    success: <Ionicons name="checkmark-circle" size={22} color="#16a34a" />,
    error: <Ionicons name="close-circle" size={22} color="#dc2626" />,
    info: <Ionicons name="information-circle" size={22} color="#2563eb" />,
    warning: <MaterialIcons name="warning" size={22} color="#f59e0b" />,
  };

  const showToast = (
    title: string,
    description?: string,
    action: "success" | "error" | "info" | "warning" = "info",
    variant: "solid" | "outline" = "solid",
    placement: "top" | "bottom" = "bottom",
  ) => {
    const toastId = Math.random().toString();

    // 🔔 haptic-like vibration (Amazon style)
    Vibration.vibrate(60);

    toast.show({
      id: toastId,
      placement,
      duration: 3500,
      renderInPortal: true,
      render: ({ id }) => (
        <Toast
          nativeID={`toast-${id}`}
          action={action}
          variant={variant}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            borderRadius: 12,
            paddingVertical: 10,
            paddingHorizontal: 14,
            backgroundColor: theme.surface,
            shadowColor: theme.overlay,
            shadowOpacity: 0.15,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          {/* Icon */}
          <View>{icons[action]}</View>

          {/* Text */}
          <View>
            <ToastTitle style={{ fontWeight: "600" }}>{title}</ToastTitle>
            {description ? (
              <ToastDescription
                style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}
              >
                {description}
              </ToastDescription>
            ) : null}
          </View>
        </Toast>
      ),
    });
  };

  return { showToast };
}
