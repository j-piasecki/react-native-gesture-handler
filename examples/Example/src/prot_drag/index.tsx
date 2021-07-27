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
  Simultaneous,
  Pinch,
  Rotation,
  Exclusive,
  Sequence,
  LongPress,
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

  const gs = new Simultaneous([ //useGesture(
    new LongPress({
      onUpdate: (e) => {
        if (e.nativeEvent.state == 1) {
          Animated.timing(scale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        } else if (e.nativeEvent.state == 2) {
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }
      },
    }),
    new Pan({
      onUpdate: Animated.event(
        [
          {
            nativeEvent: {
              translationX: translationX,
              translationY: translationY,
            },
          },
        ],
        {
          useNativeDriver: false,
          listener: (e) => {
            if (e.nativeEvent.state == 5) {
              Animated.timing(scale, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
              }).start();
            }
          },
        }
      ),
    }),
    new Tap({
      onUpdate: (e) => {
        console.log(e.nativeEvent);
      },
    }),
  ]);
  //);

  return (
    <GestureDetector gesture={gs}>
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
    </GestureDetector>
  );
}

export default function Example() {
  return (
    <View style={styles.home}>
      <Draggable />
    </View>
  );
}

function GestureDetector(props) {
  let result = props.children;

  if (props.gesture instanceof Exclusive) {
    for (const gesture of props.gesture.gestures) {
      result = React.createElement(
        getHandler(gesture.handlerName),
        {
          onGestureEvent: gesture.config.onUpdate,
          onHandlerStateChange: gesture.config.onUpdate,
        },
        result
      );
    }
  } else if (props.gesture instanceof Simultaneous) {
    let refs = [];

    for (const gesture of props.gesture.gestures) {
      let ref = createRef();

      refs.push(ref);
      gesture.ref = ref;
    }

    for (const gesture of props.gesture.gestures) {
      result = React.createElement(
        getHandler(gesture.handlerName),
        {
          onGestureEvent: gesture.config.onUpdate,
          onHandlerStateChange: gesture.config.onUpdate,
          ref: gesture.ref,
          simultaneousHandlers: refs,
        },
        result
      );
    }
  } else {
    result = React.createElement(
      getHandler(props.gesture.handlerName),
      {
        onGestureEvent: props.gesture.config.onUpdate,
        onHandlerStateChange: props.gesture.config.onUpdate,
      },
      result
    );
  }

  return result;
}

function getHandler(name) {
  switch (name) {
    case 'LongPressGestureHandler':
      return LongPressGestureHandler;
    case 'TapGestureHandler':
      return TapGestureHandler;
    case 'RotationGestureHandler':
      return RotationGestureHandler;
    case 'PinchGestureHandler':
      return PinchGestureHandler;
    case 'PanGestureHandler':
      return PanGestureHandler;
  }
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
    backgroundColor: 'green',
    alignSelf: 'center',
  },
});
