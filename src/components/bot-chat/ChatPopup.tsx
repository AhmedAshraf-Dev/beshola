import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Animated as RNAnimated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, { SlideInUp, SlideOutDown } from "react-native-reanimated";
import { theme } from "../../Theme";
import { isRTL } from "../../utils/operation/isRTL";
import ChatHeader from "./ChatHeader";
import ChatRoomsList from "./ChatRoomsList";
import ChatMessages from "./ChatMessages";
const ChatPopup = ({ open, setOpen, activeRoom, setActiveRoom }) => {
  return (
    <>
      {open && (
        <Animated.View
          entering={SlideInUp.duration(300)}
          exiting={SlideOutDown.duration(300)}
          style={{
            position: "absolute",
            bottom: 120,
            right: !isRTL() ? 20 : undefined,
            left: isRTL() ? 20 : undefined,
            width: 320,
            height: 480,
            borderRadius: 16,
            backgroundColor: theme.card,
            overflow: "hidden",
            zIndex: 999,
          }}
        >
          <ChatHeader
            activeRoom={activeRoom}
            setActiveRoom={setActiveRoom}
            setOpen={setOpen}
          />

          {!activeRoom && <ChatRoomsList openRoom={(r) => setActiveRoom(r)} />}

          {activeRoom && (
            <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <ChatMessages activeRoom={activeRoom} />
            </KeyboardAvoidingView>
          )}
        </Animated.View>
      )}
    </>
  );
};

export default ChatPopup;
