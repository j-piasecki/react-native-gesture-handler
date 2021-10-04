import { DeviceEventEmitter, EmitterSubscription } from 'react-native';
import { State } from '../../State';
import { EventType } from '../../EventType';
import {
  UnwrappedGestureHandlerEvent,
  UnwrappedGestureHandlerPointerEvent,
  UnwrappedGestureHandlerStateChangeEvent,
} from '../gestureHandlerCommon';
import { findHandler } from '../handlersRegistry';
import { BaseGesture } from './gesture';
import { GestureStateManagerType } from './gestureStateManager';

let gestureHandlerEventSubscription: EmitterSubscription | null = null;
let gestureHandlerStateChangeEventSubscription: EmitterSubscription | null = null;

const dummyStateManager: GestureStateManagerType = {
  tryBegin: () => {
    console.warn(
      'You have to use the animatedGesture prop in order to control the state of the gesture.'
    );
  },
  tryActivate: () => {
    console.warn(
      'You have to use the animatedGesture prop in order to control the state of the gesture.'
    );
  },
  tryEnd: () => {
    console.warn(
      'You have to use the animatedGesture prop in order to control the state of the gesture.'
    );
  },
  tryFail: () => {
    console.warn(
      'You have to use the animatedGesture prop in order to control the state of the gesture.'
    );
  },
};

function isStateChangeEvent(
  event:
    | UnwrappedGestureHandlerEvent
    | UnwrappedGestureHandlerStateChangeEvent
    | UnwrappedGestureHandlerPointerEvent
): event is UnwrappedGestureHandlerStateChangeEvent {
  // @ts-ignore oldState doesn't exist on UnwrappedGestureHandlerPointerEvent and that's the point
  return event.oldState != null;
}

function isPointerChangeEvent(
  event:
    | UnwrappedGestureHandlerEvent
    | UnwrappedGestureHandlerStateChangeEvent
    | UnwrappedGestureHandlerPointerEvent
): event is UnwrappedGestureHandlerPointerEvent {
  return event.eventType != null;
}

function onGestureHandlerEvent(
  event:
    | UnwrappedGestureHandlerEvent
    | UnwrappedGestureHandlerStateChangeEvent
    | UnwrappedGestureHandlerPointerEvent
) {
  const handler = findHandler(event.handlerTag) as BaseGesture<
    Record<string, unknown>
  >;

  if (handler) {
    if (isStateChangeEvent(event)) {
      if (
        event.oldState === State.UNDETERMINED &&
        event.state === State.BEGAN
      ) {
        handler.handlers.onBegan?.(event);
      } else if (
        (event.oldState === State.BEGAN ||
          event.oldState === State.UNDETERMINED) &&
        event.state === State.ACTIVE
      ) {
        handler.handlers.onStart?.(event);
      } else if (
        (event.oldState === State.ACTIVE || event.oldState === State.BEGAN) &&
        event.state === State.END
      ) {
        handler.handlers.onEnd?.(event, true);
      } else if (
        (event.state === State.FAILED || event.state === State.CANCELLED) &&
        event.oldState !== event.state
      ) {
        handler.handlers.onEnd?.(event, false);
      }
    } else if (isPointerChangeEvent(event)) {
      handler.handlers?.onPointerChange?.(event, dummyStateManager);

      switch (event.eventType) {
        case EventType.POINTER_DOWN:
          handler.handlers?.onPointerDown?.(event, dummyStateManager);
          break;
        case EventType.POINTER_MOVE:
          handler.handlers?.onPointerDown?.(event, dummyStateManager);
          break;
        case EventType.POINTER_UP:
          handler.handlers?.onPointerUp?.(event, dummyStateManager);
          break;
        case EventType.POINTER_CANCELLED:
          handler.handlers?.onPointerCancelled?.(event, dummyStateManager);
          break;
      }
    } else {
      handler.handlers.onUpdate?.(event);
    }
  }
}

export function startListening() {
  stopListening();

  gestureHandlerEventSubscription = DeviceEventEmitter.addListener(
    'onGestureHandlerEvent',
    onGestureHandlerEvent
  );

  gestureHandlerStateChangeEventSubscription = DeviceEventEmitter.addListener(
    'onGestureHandlerStateChange',
    onGestureHandlerEvent
  );
}

export function stopListening() {
  if (gestureHandlerEventSubscription) {
    DeviceEventEmitter.removeSubscription(gestureHandlerEventSubscription);

    gestureHandlerEventSubscription = null;
  }

  if (gestureHandlerStateChangeEventSubscription) {
    DeviceEventEmitter.removeSubscription(
      gestureHandlerStateChangeEventSubscription
    );

    gestureHandlerStateChangeEventSubscription = null;
  }
}
