import { View, Text } from "react-native";
import React from "react";
import { CarouselBox } from "./CarouselBox";
import { MenuCard } from "./MenuCard";
import SuggestCard from "./SuggestCard";
import AddCard from "./AddMediaCard";

export default function GetCartByType({ typeCards, ...props }) {
  switch (typeCards) {
    case "CarouselBox":
      <CarouselBox {...props} />;
    case "MenuCard":
      <MenuCard {...props} />;
    case "SuggestCard":
      <SuggestCard {...props} />;
    case "AddCard":
      <AddCard {...props} />;
  }
}
