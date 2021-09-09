import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  GestureDetector,
  Gesture,
  useGesture,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

function Ball() {
  console.log('render');
  const isPressed = useSharedValue(false);
  const offset = useSharedValue({ x: 0, y: 0 });

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offset.value.x },
        { translateY: offset.value.y },
        { scale: withSpring(isPressed.value ? 1.2 : 1) },
      ],
      backgroundColor: isPressed.value ? 'yellow' : 'blue',
    };
  });

  const start = useSharedValue({ x: 0, y: 0 });
  const gesture = useGesture(Gesture.Pan());

  function reset(offset) {
    gesture.activeOffsetX(offset);
  }

  gesture
    .onStart(() => {
      'worklet';
      isPressed.value = true;
    })
    .onUpdate((e) => {
      'worklet';
      offset.value = {
        x: e.translationX + start.value.x,
        y: e.translationY + start.value.y,
      };
    })
    .onEnd(() => {
      'worklet';
      start.value = {
        x: offset.value.x,
        y: offset.value.y,
      };
      isPressed.value = false;

      runOnJS(reset)([-100, 100]);
    });

  const longPress = Gesture.LongPress().onStart(() => {
    'worklet';
    isPressed.value = true;
    runOnJS(reset)([undefined, undefined]);
  });

  return (
    <GestureDetector animatedGesture={Gesture.Simultaneous(longPress, gesture)}>
      <Animated.View style={[styles.ball, animatedStyles]} />
    </GestureDetector>
  );
}

export default function Example() {
  return (
    <View style={styles.container}>
      <Ball />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ball: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'blue',
    alignSelf: 'center',
  },
});
