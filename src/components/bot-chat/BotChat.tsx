import React, { useState } from "react";
import ChatPopup from "./ChatPopup";
import FloatingChatButton from "./FloatingChatButton";

const BotChat = () => {
  const [open, setOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState(null);
  return (
    <>
      <ChatPopup
        open={open}
        setOpen={setOpen}
        activeRoom={activeRoom}
        setActiveRoom={setActiveRoom}
      />

      <FloatingChatButton onPress={() => setOpen(true)} />
    </>
  );
};

export default BotChat;
