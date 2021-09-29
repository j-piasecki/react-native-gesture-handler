import { DeviceEventEmitter, EmitterSubscription } from 'react-native';
import { State } from '../../State';
import {
  UnwrappedGestureHandlerEvent,
  UnwrappedGestureHandlerPointerEvent,
  UnwrappedGestureHandlerStateChangeEvent,
} from '../gestureHandlerCommon';
import { findHandler } from '../handlersRegistry';
import { BaseGesture } from './gesture';

let gestureHandlerEventSubscription: EmitterSubscription | null = null;
let gestureHandlerStateChangeEventSubscription: EmitterSubscription | null = null;
let gestureHandlerPointerEventSubscription: EmitterSubscription | null = null;

function isStateChangeEvent(
  event: UnwrappedGestureHandlerEvent | UnwrappedGestureHandlerStateChangeEvent
): event is UnwrappedGestureHandlerStateChangeEvent {
  return event.oldState != null;
}

function onGestureHandlerEvent(
  event: UnwrappedGestureHandlerEvent | UnwrappedGestureHandlerStateChangeEvent
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
      } else if (event.oldState === State.ACTIVE && event.state === State.END) {
        handler.handlers.onEnd?.(event, true);
      } else if (
        event.state === State.FAILED ||
        event.state === State.CANCELLED
      ) {
        handler.handlers.onEnd?.(event, false);
      }
    } else {
      handler.handlers.onUpdate?.(event);
    }
  }
}

function onPointerEvent(event: UnwrappedGestureHandlerPointerEvent) {
  const handler = findHandler(event.handlerTag) as BaseGesture<
    Record<string, unknown>
  >;

  if (handler) {
    handler.handlers.onPointerEvent?.(event);
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

  gestureHandlerPointerEventSubscription = DeviceEventEmitter.addListener(
    'onGestureHandlerPointerEvent',
    onPointerEvent
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

  if (gestureHandlerPointerEventSubscription) {
    DeviceEventEmitter.removeSubscription(
      gestureHandlerPointerEventSubscription
    );

    gestureHandlerPointerEventSubscription = null;
  }
}
