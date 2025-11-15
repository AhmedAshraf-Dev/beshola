import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { useVideoPlayer, VideoView } from "expo-video";
import { Button } from "react-native";
import { useEvent } from "expo";

export default function AddMediaCard({
  source,
  mediaType = "image",
  customStyle = {},
}) {
  const [Video, setVideo] = useState(null);
  const isVideo = mediaType === "video";

  // Video Player Setup
  const player = isVideo
    ? useVideoPlayer(source, (player) => {
        player.loop = true;
        player.muted = true; // 🔇 important for autoplay
        player.play();
      })
    : null;
  // const { isPlaying } = useEvent(player, "playingChange", {
  //   isPlaying: player.playing,
  // });
  // Ensure autoplay after player is mounted
  useEffect(() => {
    if (player) {
      const play = async () => {
        try {
          await player.play();
        } catch (err) {
          console.warn("Autoplay failed:", err);
        }
      };
      play();
    }
  }, [player]);
  return (
    <Animated.View style={styles.container}>
      {mediaType === "image" ? (
        <Animated.Image
          style={[styles.media, customStyle]}
          source={source}
          resizeMode="cover"
        />
      ) : (
        // <>
        <VideoView
          style={[styles.video, customStyle]}
          player={player}
          allowsFullscreen={true}
          allowsPictureInPicture={true}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  media: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },
  controlsContainer: {
    padding: 10,
  },
  video: {
    width: 350,
    height: 275,
  },
});
