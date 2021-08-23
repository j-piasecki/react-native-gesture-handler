import { ComponentClass } from 'react';
import {
  UnwrappedGestureHandlerEvent,
  UnwrappedGestureHandlerStateChangeEvent,
} from '../gestureHandlerCommon';

export interface SharedValue<T> {
  value: T;
}

let Reanimated: {
  default: {
    // Slightly modified definition copied from 'react-native-reanimated'
    // eslint-disable-next-line @typescript-eslint/ban-types
    createAnimatedComponent<P extends object>(
      component: ComponentClass<P>,
      options?: unknown
    ): ComponentClass<P>;
  };
  useEvent: (
    callback: (
      event:
        | UnwrappedGestureHandlerEvent
        | UnwrappedGestureHandlerStateChangeEvent
    ) => void,
    events: string[],
    rebuild: boolean
  ) => unknown;
  useSharedValue: <T>(value: T) => SharedValue<T>;
};

try {
  Reanimated = require('react-native-reanimated');
  // When 'react-native-reanimated' is not available we want to
  // quietly continue
  // eslint-disable-next-line no-empty
} catch (e) {}

export { Reanimated };
