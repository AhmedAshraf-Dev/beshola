import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";
import AddCard from "../../components/cards/AddMediaCard";
import { theme } from "../../Theme";
const { width } = Dimensions.get("window");

const data = [
  { src: require("../../../assets/display/ad1.jpg") },
  { src: require("../../../assets/display/ad2.jpg") },
  { src: require("../../../assets/display/ad3.jpg") },
  { src: require("../../../assets/display/ad4.jpg") },
];

const HomeCarousel = () => {
  const [index, setIndex] = useState(0);
  const carouselRef = useRef(null);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.body }}>
      <View style={{ flex: 1, paddingBottom: 20 }}>
        {/* Carousel Section */}
        <View style={{ marginTop: 12 }}>
          <Carousel
            ref={carouselRef}
            loop
            autoPlay
            autoPlayInterval={3000} // 🔥 AUTOPLAY HERE
            width={width - 24}
            height={200}
            data={data}
            scrollAnimationDuration={800}
            onSnapToItem={(i) => setIndex(i)}
            renderItem={({ item }) => <AddCard source={item.src} />}
          />
        </View>

        {/* Dots Indicator */}
        <View style={{ marginTop: 20, alignItems: "center" }}>
          <AnimatedDotsCarousel
            length={data.length}
            currentIndex={index}
            maxIndicators={4}
            interpolateOpacityAndColor
            activeIndicatorConfig={{
              color: theme.text,
              margin: 3,
              opacity: 1,
              size: 8,
            }}
            inactiveIndicatorConfig={{
              color: theme.text,
              margin: 3,
              opacity: 0.5,
              size: 8,
            }}
            decreasingDots={[
              {
                config: {
                  color: theme.text,
                  margin: 3,
                  opacity: 0.5,
                  size: 6,
                },
                quantity: 1,
              },
              {
                config: {
                  color: theme.text,
                  margin: 3,
                  opacity: 0.5,
                  size: 4,
                },
                quantity: 1,
              },
            ]}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeCarousel;
