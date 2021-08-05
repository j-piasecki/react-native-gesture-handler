import React, { Component } from 'react';
import { useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { USE_NATIVE_DRIVER } from '../config';
import {
  TapGestureHandler,
  PanGestureHandler,
  LongPressGestureHandler,
  RotationGestureHandler,
  PinchGestureHandler,
  GestureMonitor,
  useGesture,
  Pan,
  Tap,
  Pinch,
  Rotation,
  LongPress,
  ComplexGesture,
} from 'react-native-gesture-handler';
import { useState } from 'react';
import { createRef } from 'react';

function getState(s: number) {
  switch (s) {
    case 0:
      return 'Undetermined';
    case 1:
      return 'Failed';
    case 2:
      return 'Began';
    case 3:
      return 'Cancelled';
    case 4:
      return 'Active';
    case 5:
      return 'End';
  }
  return s;
}

function Draggable() {
  const translationX = useRef(new Animated.Value(0)).current;
  const translationY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  const [offset, setOffset] = useState({ x: 0, y: 0 });

  let pan = new Pan({
    onUpdate: (e) => {
      console.log('pan');
    },
  });

  const gs = useGesture(
    // pan.after(new LongPress({}))
    //   .simultaneousWith(new Tap({
    //     onEnd: (e, s) => {if (s) console.log("tap")}
    //   }))
    //   .requireToFail(new Tap({
    //     numberOfTaps: 2,
    //     onEnd: (e, s) => {if (s) console.log("double tap")}
    //   }))
    new Rotation({
      onUpdate: (e) => {
        console.log('rotate');
      },
    }).after(
      new Pinch({
        onUpdate: (e) => {
          console.log('scale');
        },
      })
    )
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
