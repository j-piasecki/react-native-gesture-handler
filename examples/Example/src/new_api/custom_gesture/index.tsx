import React from 'react';
import { StyleSheet } from 'react-native';
import {
  GestureDetector,
  Gesture,
  EventType,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface Pointer {
  visible: boolean;
  x: number;
  y: number;
}

function PointerElement(props: {
  pointer: Animated.SharedValue<Pointer>;
  active: Animated.SharedValue<boolean>;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: props.pointer.value.x },
      { translateY: props.pointer.value.y },
      {
        scale:
          (props.pointer.value.visible ? 1 : 0) *
          (props.active.value ? 1.3 : 1),
      },
    ],
    backgroundColor: props.active.value ? 'red' : 'blue',
  }));

  return <Animated.View style={[styles.pointer, animatedStyle]} />;
}

export default function Example() {
  const trackedPointers: Animated.SharedValue<Pointer>[] = [];
  const active = useSharedValue(false);

  for (let i = 0; i < 12; i++) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    trackedPointers[i] = useSharedValue<Pointer>({
      visible: false,
      x: 0,
      y: 0,
    });
  }

  const gesture = Gesture.Custom()
    .onPointerEvent((e, manager) => {
      'worklet';
      if (e.eventType === EventType.POINTER_DOWN) {
        for (const pointer of e.pointerData) {
          trackedPointers[pointer.pointerId].value = {
            visible: true,
            x: pointer.x,
            y: pointer.y,
          };
        }

        if (e.numberOfPointers >= 2) {
          manager.tryActivate();
        }
      } else if (
        e.eventType === EventType.POINTER_UP ||
        e.eventType === EventType.POINTER_CANCELLED
      ) {
        for (const pointer of e.pointerData) {
          trackedPointers[pointer.pointerId].value = {
            visible: false,
            x: pointer.x,
            y: pointer.y,
          };
        }

        if (e.numberOfPointers === 0) {
          manager.tryEnd();
        }
      } else if (e.eventType === EventType.POINTER_MOVE) {
        for (const pointer of e.pointerData) {
          trackedPointers[pointer.pointerId].value = {
            visible: true,
            x: pointer.x,
            y: pointer.y,
          };
        }
      }
    })
    .onStart(() => {
      'worklet';
      active.value = true;
    })
    .onEnd(() => {
      'worklet';
      active.value = false;
    });

  return (
    <GestureDetector animatedGesture={gesture}>
      <Animated.View style={styles.container}>
        {trackedPointers.map((pointer, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <PointerElement pointer={pointer} active={active} key={index} />
        ))}
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pointer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'red',
    position: 'absolute',
    marginStart: -30,
    marginTop: -30,
  },
});
