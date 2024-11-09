import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Entypo } from "@expo/vector-icons";

export default function SliderButton() {
  const END_POSITION = Dimensions.get("screen").width - 100; // Calculating button width
  const onLeft = useSharedValue(true);
  const position = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .runOnJS(true) // Enables running functions on the JS thread
    .onUpdate((e) => {
      if (onLeft.value) {
        position.value = e.translationX;
      } else {
        position.value = END_POSITION + e.translationX;
      }
    })
    .onEnd(() => {
      if (position.value > END_POSITION/2 ) {
        // Snap to end position if swiped past 1.5 threshold
        position.value = withTiming(END_POSITION, { duration: 100 });
        onLeft.value = false;
        //  You can call any function here when swipe is completed
        onSlideCompleted();
      } else {
        position.value = withTiming(0, { duration: 100 });
        onLeft.value = true;
      }
    });
  const onSlideCompleted = () => {
      onLeft.value = true;
      console.log("Slide completed");
  };
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: position.value }],
  }));

  return (
    <View style={[styles.sliderContainer, { width: END_POSITION + 70}]}>
      <Text style={styles.sliderText}>Swipe To Start</Text>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.swipeBtn, animatedStyle]}>
          <Entypo name="chevron-thin-right" size={12} color="#F5F5" />
          <Entypo name="chevron-thin-right" size={12} color="#F5F" />
          <Entypo name="chevron-thin-right" size={12} color="#F9F" />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#1C1",
    position: "relative",
    height: 70,
    overflow: "hidden",
        borderRadius: 70,
  },
  sliderText: {
    color: "#939",
    fontSize: 18,
  },
  swipeBtn: {
    width: 70,
    height: 70,
    backgroundColor: "#565",
    position: "absolute",
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 70,
    flexDirection: "row",
  },
});
