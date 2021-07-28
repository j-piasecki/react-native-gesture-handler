import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureMonitor, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useAnimatedGesture } from '../useAnimatedGesture';

function Draggable() {
  const pressed = useSharedValue(false);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: offsetX.value },
        { translateY: offsetY.value },
        { scale: withSpring(pressed.value ? 1.2 : 1) },
      ],
      backgroundColor: pressed.value ? 'yellow' : 'blue',
    };
  });

  const gs = useAnimatedGesture(
    new Gesture().pan({
      onBegan: (e) => {
        pressed.value = true;
      },
      onEnd: (e, success) => {
        startX.value = offsetX.value;
        startY.value = offsetY.value;
        pressed.value = false;
      },
      onUpdate: (e) => {
        offsetX.value = e.translationX + startX.value;
        offsetY.value = e.translationY + startY.value;
      },
    })
  );

  return (
    <GestureMonitor gesture={gs}>
      <Animated.View style={[styles.button, animatedStyles]} />
    </GestureMonitor>
  );
}

export default function Example() {
  return (
    <View style={styles.home}>
      <Draggable />
    </View>
  );
}

const styles = StyleSheet.create({
  home: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    backgroundColor: 'plum',
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'blue',
    alignSelf: 'center',
  },
});
