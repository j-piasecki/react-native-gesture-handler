import React, { useState } from 'react';

import { StyleSheet, View } from 'react-native';
import {
  GestureDetector,
  Gesture,
  useGesture,
} from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

function Box(props: {
  color: string;
  overlap?: boolean;
  children?: React.ReactNode;
}) {
  const gesture = Gesture.Tap().onEnd((_e, success) => {
    if (success) {
      console.log(props.color);
    }
  });

  return (
    <GestureDetector>
      <View
        style={[
          styles.box,
          { backgroundColor: props.color },
          props.overlap ? styles.overlap : {},
        ]}>
        {props.children}
      </View>
    </GestureDetector>
  );
}

export default function Example() {
  const a = useSharedValue(0);
  const [state, setState] = useState(0);

  const tap = useGesture(Gesture.Tap()).onStart((e, s) => {
    a.value = withTiming(a.value + 1, { duration: 2000 });
    console.log('tap');
    tap.onStart(() => {
      console.log('no more taps');
    });
  });

  const updateHandler = (a) => {
    tap.enabled(a);
  };

  const b = useAnimatedReaction(
    () => {
      return a.value === Math.floor(a.value);
    },
    (res, prev) => {
      if (res !== prev) {
        runOnJS(updateHandler)(res);
        console.log(res);
      }
    }
  );
  console.log('render ' + state);
  const longpress = Gesture.LongPress().onStart(() => setState(state + 1));

  return (
    <GestureDetector gesture={Gesture.Simultaneous(tap, longpress)}>
      <View style={styles.home}>
        <Box color="red">
          <Box color="green" overlap />
        </Box>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  home: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    backgroundColor: 'plum',
  },
  box: {
    width: 150,
    height: 150,
  },
  overlap: {
    position: 'absolute',
    left: 75,
    top: 75,
  },
});
