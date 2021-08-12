import React from 'react';
import { useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import {
  GestureMonitor,
  useGesture,
  Gesture,
} from 'react-native-gesture-handler';

function Draggable() {
  const translationX = useRef(new Animated.Value(0)).current;
  const translationY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const gs = useGesture(
    Gesture.pan()
      .setActiveOffsetX([0, 190])
      .setFailOffsetY([-10, 10])
      .setFailOffsetX(-1)
      .setOnUpdate((e) => {
        console.log('event 1');
      })
      .setOnEnd((e, s) => {
        console.log('end 1: ' + s);
      })
  );

  return (
    <GestureMonitor gesture={gs}>
      <Animated.View
        style={[
          styles.button,
          {
            transform: [
              { translateX: translationX },
              { translateY: translationY },
              { scale: scale },
            ],
          },
        ]}
      />
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
    width: 200,
    height: 200,
    backgroundColor: 'green',
    alignSelf: 'center',
  },
});
