import React, { useState } from 'react';
import {
  I18nManager,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { PanGestureHandlerProps } from '../handlers/PanGestureHandler';
import { GestureDetector } from '../handlers/gestures/GestureDetector';
import { GestureObjects as Gesture } from '../handlers/gestures/gestureObjects';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

type SwipeableExcludes = Exclude<
  keyof PanGestureHandlerProps,
  'onGestureEvent' | 'onHandlerStateChange'
>;

interface SwipeableProps
  extends Pick<PanGestureHandlerProps, SwipeableExcludes> {
  /**
   * Enables two-finger gestures on supported devices, for example iPads with
   * trackpads. If not enabled the gesture will require click + drag, with
   * `enableTrackpadTwoFingerGesture` swiping with two fingers will also trigger
   * the gesture.
   */
  enableTrackpadTwoFingerGesture?: boolean;

  /**
   * Specifies how much the visual interaction will be delayed compared to the
   * gesture distance. e.g. value of 1 will indicate that the swipeable panel
   * should exactly follow the gesture, 2 means it is going to be two times
   * "slower".
   */
  friction?: number;

  /**
   * Distance from the left edge at which released panel will animate to the
   * open state (or the open panel will animate into the closed state). By
   * default it's a half of the panel's width.
   */
  leftThreshold?: number;

  /**
   * Distance from the right edge at which released panel will animate to the
   * open state (or the open panel will animate into the closed state). By
   * default it's a half of the panel's width.
   */
  rightThreshold?: number;

  /**
   * Value indicating if the swipeable panel can be pulled further than the left
   * actions panel's width. It is set to true by default as long as the left
   * panel render method is present.
   */
  overshootLeft?: boolean;

  /**
   * Value indicating if the swipeable panel can be pulled further than the
   * right actions panel's width. It is set to true by default as long as the
   * right panel render method is present.
   */
  overshootRight?: boolean;

  /**
   * Specifies how much the visual interaction will be delayed compared to the
   * gesture distance at overshoot. Default value is 1, it mean no friction, for
   * a native feel, try 8 or above.
   */
  overshootFriction?: number;

  /**
   * Called when left action panel gets open.
   */
  onSwipeableLeftOpen?: () => void;

  /**
   * Called when right action panel gets open.
   */
  onSwipeableRightOpen?: () => void;

  /**
   * Called when action panel gets open (either right or left).
   */
  onSwipeableOpen?: () => void;

  /**
   * Called when action panel is closed.
   */
  onSwipeableClose?: () => void;

  /**
   * Called when left action panel starts animating on open.
   */
  onSwipeableLeftWillOpen?: () => void;

  /**
   * Called when right action panel starts animating on open.
   */
  onSwipeableRightWillOpen?: () => void;

  /**
   * Called when action panel starts animating on open (either right or left).
   */
  onSwipeableWillOpen?: () => void;

  /**
   * Called when action panel starts animating on close.
   */
  onSwipeableWillClose?: () => void;

  /**
   *
   * This map describes the values to use as inputRange for extra interpolation:
   * AnimatedValue: [startValue, endValue]
   *
   * progressAnimatedValue: [0, 1] dragAnimatedValue: [0, +]
   *
   * To support `rtl` flexbox layouts use `flexDirection` styling.
   * */
  renderLeftActions?: (
    progressValue: Animated.SharedValue<number>,
    dragValue: Animated.SharedValue<number>
  ) => React.ReactNode;
  /**
   *
   * This map describes the values to use as inputRange for extra interpolation:
   * AnimatedValue: [startValue, endValue]
   *
   * progressAnimatedValue: [0, 1] dragAnimatedValue: [0, -]
   *
   * To support `rtl` flexbox layouts use `flexDirection` styling.
   * */
  renderRightActions?: (
    progressValue: Animated.SharedValue<number>,
    dragValue: Animated.SharedValue<number>
  ) => React.ReactNode;

  animationOptions?: Animated.WithSpringConfig;

  /**
   * Style object for the container (`Animated.View`), for example to override
   * `overflow: 'hidden'`.
   */
  containerStyle?: StyleProp<ViewStyle>;

  /**
   * Style object for the children container (`Animated.View`), for example to
   * apply `flex: 1`
   */
  childrenContainerStyle?: StyleProp<ViewStyle>;
}

export const Swipeable: React.FunctionComponent<SwipeableProps> = (props) => {
  const { children, renderLeftActions, renderRightActions } = props;

  const [rowWidth, setRowWidth] = useState(1);
  const [leftWidth, setLeftWidth] = useState(1);
  const [rightOffset, setRightOffset] = useState(1);
  const rightWidth = rowWidth - rightOffset;

  const rowState = useSharedValue(0); // current state: 1 - left, 0 - closed, -1 - right
  const dragOffset = useSharedValue(0); // offset for the top component
  const dragStartOffset = useSharedValue(0); // origin for pan gesture handler translation
  const leftActionOffset = useSharedValue(0); // offset used to hide left panel when right is opened
  const rightActionOffset = useSharedValue(0); // offset used to hide right panel when left is opened

  // parameters passed to actions' render methods
  const leftActionProgress = useDerivedValue(() => {
    return dragOffset.value / leftWidth;
  }, [dragOffset, leftWidth]);

  const leftActionDrag = useDerivedValue(() => {
    return dragOffset.value;
  }, [dragOffset]);

  const rightActionProgress = useDerivedValue(() => {
    return -dragOffset.value / rightWidth;
  }, [dragOffset, rightWidth]);

  const rightActionDrag = useDerivedValue(() => {
    return -dragOffset.value;
  }, [dragOffset]);

  // default config
  const friction = props.friction ?? 1;
  const leftThreshold = props.leftThreshold ?? leftWidth / 2;
  const rightThreshold = props.rightThreshold ?? rightWidth / 2;
  const overshootLeft = props.overshootLeft ?? leftWidth > 0;
  const overshootRight = props.overshootRight ?? rightWidth > 0;
  const overshootFriction = props.overshootFriction ?? 1;
  const animationOptions = props.animationOptions ?? {
    damping: 30,
    stiffness: 250,
  };

  // animated styles for panels
  const childContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: dragOffset.value }],
    };
  });

  const leftActionStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: leftActionOffset.value }],
    };
  });

  const rightActionStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: rightActionOffset.value }],
    };
  });

  const left = renderLeftActions && (
    <Animated.View style={[styles.leftActions, leftActionStyle]}>
      {renderLeftActions(leftActionProgress, leftActionDrag)}
      <View // view for measuring the panel
        onLayout={({ nativeEvent }) => {
          setLeftWidth(nativeEvent.layout.x);
        }}
      />
    </Animated.View>
  );

  const right = renderRightActions && (
    <Animated.View style={[styles.rightActions, rightActionStyle]}>
      {renderRightActions(rightActionProgress, rightActionDrag)}
      <View // view for measuring the panel
        onLayout={({ nativeEvent }) => {
          setRightOffset(nativeEvent.layout.x);
        }}
      />
    </Animated.View>
  );

  function dispatchAnimationStartEvents(toState: number) {
    if (toState === 1) {
      props.onSwipeableLeftWillOpen?.();
      props.onSwipeableWillOpen?.();
    } else if (toState === 0) {
      props.onSwipeableWillClose?.();
    } else {
      props.onSwipeableRightWillOpen?.();
      props.onSwipeableWillOpen?.();
    }
  }

  function dispatchAnimationEndEvents(toState: number) {
    if (toState === 1) {
      props.onSwipeableLeftOpen?.();
      props.onSwipeableOpen?.();
    } else if (toState === 0) {
      props.onSwipeableClose?.();
    } else {
      props.onSwipeableRightOpen?.();
      props.onSwipeableOpen?.();
    }
  }

  // helper for starting animations
  function animateRowTo(toOffset: number) {
    'worklet';
    const newState = Math.sign(toOffset);

    dragOffset.value = withSpring(toOffset, animationOptions, (isFinished) => {
      dragStartOffset.value = dragOffset.value;

      if (isFinished) {
        runOnJS(dispatchAnimationEndEvents)(newState);
      }
    });

    if (toOffset !== dragOffset.value) {
      // when tap gesture is activated on already closed swipeable don't send events
      // (tap calls this method with 0 as argument, when closed the offset is 0)
      runOnJS(dispatchAnimationStartEvents)(newState);
    }

    dragStartOffset.value = withSpring(toOffset, animationOptions);
    rowState.value = newState;
  }

  const panGesture = Gesture.Pan();
  panGesture.activeOffsetX([-10, 10]);
  panGesture.onUpdate((event) => {
    'worklet';
    let newValue = dragStartOffset.value + event.translationX / friction;

    if (newValue < 0) {
      // right panel will be visible, hide the right one
      leftActionOffset.value = -10000;
      rightActionOffset.value = 0;

      // dragged more than panel width, check overshoot
      if (newValue < -rightWidth) {
        if (!overshootRight) {
          // if disabled, snap to width
          newValue = -rightWidth;
        } else {
          // otherwise calculate it and apply friction
          const overshoot = newValue + rightWidth;
          newValue = -rightWidth + overshoot / overshootFriction;
        }
      }
    } else {
      // left panel will be visible, hide the left one
      rightActionOffset.value = 10000;
      leftActionOffset.value = 0;

      // dragged more than panel width, check overshoot
      if (newValue > leftWidth) {
        if (!overshootLeft) {
          // if disabled, snap to width
          newValue = leftWidth;
        } else {
          // otherwise calculate it and apply friction
          const overshoot = newValue - leftWidth;
          newValue = leftWidth + overshoot / overshootFriction;
        }
      }
    }

    dragOffset.value = newValue;
  });
  panGesture.onEnd((_event) => {
    'worklet';
    const currentValue = dragOffset.value;

    let toValue = 0;
    if (rowState.value === 0) {
      // swipeable is closed
      if (currentValue > leftThreshold) {
        // left treshold reached, open left panel
        toValue = leftWidth;
      } else if (currentValue < -rightThreshold) {
        // right treshold reached, open right panel
        toValue = -rightWidth;
      }
    } else if (rowState.value === 1) {
      // left panel is opened
      if (currentValue > leftWidth - leftThreshold) {
        // swiped to left but threshold not reached, keep the panel open
        toValue = leftWidth;
      }
    } else {
      // right panel is opened
      if (currentValue < -rightWidth + rightThreshold) {
        // swiped to right but threshold not reached, keep the panel open
        toValue = -rightWidth;
      }
    }

    animateRowTo(toValue);
  });

  const tapGesture = Gesture.Tap();

  tapGesture.onEnd((_event, success) => {
    'worklet';
    if (success) {
      // close the panel on tap
      animateRowTo(0);
    }
  });

  return (
    <GestureDetector animatedGesture={Gesture.Race(panGesture, tapGesture)}>
      <Animated.View
        style={[styles.container, props.containerStyle]}
        onLayout={({ nativeEvent }) => {
          setRowWidth(nativeEvent.layout.width);
        }}>
        {left}
        {right}
        <Animated.View
          style={[childContainerStyle, props.childrenContainerStyle]}>
          {children}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  leftActions: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  rightActions: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: I18nManager.isRTL ? 'row' : 'row-reverse',
  },
});
