import { Reanimated } from './reanimatedWrapper';
import { State } from '../../State';

export interface GestureStateManagerType {
  tryBegin: () => void;
  tryActivate: () => void;
  tryFail: () => void;
  tryEnd: () => void;
}

export const GestureStateManager = {
  create(handlerTag: number): GestureStateManagerType {
    'worklet';
    return {
      tryBegin: () => {
        'worklet';
        if (Reanimated) {
          Reanimated.setGestureState(handlerTag, State.BEGAN);
        } else {
          console.warn(
            'react-native-reanimated is required in order to use synchronous state management'
          );
        }
      },

      tryActivate: () => {
        'worklet';
        if (Reanimated) {
          Reanimated.setGestureState(handlerTag, State.ACTIVE);
        } else {
          console.warn(
            'react-native-reanimated is required in order to use synchronous state management'
          );
        }
      },

      tryFail: () => {
        'worklet';
        if (Reanimated) {
          Reanimated.setGestureState(handlerTag, State.FAILED);
        } else {
          console.warn(
            'react-native-reanimated is required in order to use synchronous state management'
          );
        }
      },

      tryEnd: () => {
        'worklet';
        if (Reanimated) {
          Reanimated.setGestureState(handlerTag, State.END);
        } else {
          console.warn(
            'react-native-reanimated is required in order to use synchronous state management'
          );
        }
      },
    };
  },
};
