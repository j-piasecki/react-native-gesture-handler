import RNGestureHandlerModule from '../../RNGestureHandlerModule';
import {
  FlingGestureHandlerEventPayload,
  flingGestureHandlerProps,
} from '../FlingGestureHandler';
import {
  ForceTouchGestureHandlerEventPayload,
  forceTouchGestureHandlerProps,
} from '../ForceTouchGestureHandler';
import {
  HitSlop,
  CommonGestureConfig,
  UnwrappedGestureHandlerStateChangeEvent,
  UnwrappedGestureHandlerEvent,
  filterConfig,
  baseGestureHandlerWithMonitorProps,
} from '../gestureHandlerCommon';
import { findHandler, getNextHandlerTag } from '../handlersRegistry';
import {
  LongPressGestureHandlerEventPayload,
  longPressGestureHandlerProps,
} from '../LongPressGestureHandler';
import {
  panGestureHandlerCustomNativeProps,
  PanGestureHandlerEventPayload,
  panGestureHandlerProps,
} from '../PanGestureHandler';
import { PinchGestureHandlerEventPayload } from '../PinchGestureHandler';
import { RotationGestureHandlerEventPayload } from '../RotationGestureHandler';
import {
  TapGestureHandlerEventPayload,
  tapGestureHandlerProps,
} from '../TapGestureHandler';

export const ALLOWED_PROPS = [
  ...baseGestureHandlerWithMonitorProps,
  ...tapGestureHandlerProps,
  ...panGestureHandlerProps,
  ...panGestureHandlerCustomNativeProps,
  ...longPressGestureHandlerProps,
  ...forceTouchGestureHandlerProps,
  ...flingGestureHandlerProps,
];

export type GestureType =
  | BaseGesture<Record<string, unknown>>
  | BaseGesture<TapGestureHandlerEventPayload>
  | BaseGesture<PanGestureHandlerEventPayload>
  | BaseGesture<LongPressGestureHandlerEventPayload>
  | BaseGesture<RotationGestureHandlerEventPayload>
  | BaseGesture<PinchGestureHandlerEventPayload>
  | BaseGesture<FlingGestureHandlerEventPayload>
  | BaseGesture<ForceTouchGestureHandlerEventPayload>;

export type GestureRef = number | GestureType | React.RefObject<GestureType>;
export interface BaseGestureConfig
  extends CommonGestureConfig,
    Record<string, unknown> {
  ref?: React.MutableRefObject<GestureType>;
  requireToFail?: GestureRef[];
  simultaneousWith?: GestureRef[];
}

export type HandlerCallbacks<EventPayloadT extends Record<string, unknown>> = {
  handlerTag: number;
  onBegan?: (
    event: UnwrappedGestureHandlerStateChangeEvent<EventPayloadT>
  ) => void;
  onStart?: (
    event: UnwrappedGestureHandlerStateChangeEvent<EventPayloadT>
  ) => void;
  onEnd?: (
    event: UnwrappedGestureHandlerStateChangeEvent<EventPayloadT>,
    success: boolean
  ) => void;
  onUpdate?: (event: UnwrappedGestureHandlerEvent<EventPayloadT>) => void;
  isWorklet: boolean[];
};

export const CALLBACK_TYPE = {
  BEGAN: 1,
  START: 2,
  UPDATE: 3,
  END: 4,
} as const;

function convertToHandlerTag(ref: GestureRef): number {
  if (typeof ref === 'number') {
    return ref;
  } else if (ref instanceof BaseGesture) {
    return ref.handlerTag;
  } else {
    return ref.current?.handlerTag ?? -1;
  }
}

function extractValidHandlerTags(interactionGroup: GestureRef[] | undefined) {
  return (
    interactionGroup?.map(convertToHandlerTag)?.filter((tag) => tag > 0) ?? []
  );
}

// Allow using CALLBACK_TYPE as object and type
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type CALLBACK_TYPE = typeof CALLBACK_TYPE[keyof typeof CALLBACK_TYPE];

export abstract class Gesture {
  /**
   * Return array of gestures, providing the same interface for creating and updating
   * handlers, no matter which object was used to create gesture instance.
   */
  abstract toGestureArray(): GestureType[];

  /**
   * Assign handlerTag to the gesture instance and set ref.current (if a ref is set)
   */
  abstract initialize(): void;

  /**
   * Make sure that values of properties defining relations are arrays. Do any necessary
   * preprocessing required to configure relations between handlers. Called just before
   * updating the handler on the native side.
   */
  abstract prepare(): void;
}

export abstract class BaseGesture<
  EventPayloadT extends Record<string, unknown>
> extends Gesture {
  public handlerTag = -1;
  public handlerName = '';
  public config: BaseGestureConfig = {};
  public handlers: HandlerCallbacks<EventPayloadT> = {
    handlerTag: -1,
    isWorklet: [false, false, false, false],
  };

  private addDependency(
    key: 'simultaneousWith' | 'requireToFail',
    gesture: Exclude<GestureRef, number>
  ) {
    const value = this.config[key];
    this.config[key] = value
      ? Array<GestureRef>().concat(value, gesture)
      : [gesture];
  }

  withRef(ref: React.MutableRefObject<GestureType>) {
    this.config.ref = ref;
    return this;
  }

  protected isWorklet(
    callback:
      | ((event: UnwrappedGestureHandlerEvent<EventPayloadT>) => void)
      | ((
          event: UnwrappedGestureHandlerStateChangeEvent<EventPayloadT>
        ) => void)
  ) {
    //@ts-ignore if callback is a worklet, the property will be available, if not then the check will return false
    return callback.__workletHash !== undefined;
  }

  private removeDuplicatedRelations() {
    let mappedTags =
      this.config.simultaneousWith?.map(convertToHandlerTag) ?? [];

    this.config.simultaneousWith = this.config.simultaneousWith?.filter(
      (_handler, index) => {
        return (
          mappedTags[index] > 0 &&
          mappedTags.indexOf(mappedTags[index]) === index
        );
      }
    );

    mappedTags = this.config.requireToFail?.map(convertToHandlerTag) ?? [];

    this.config.requireToFail = this.config.requireToFail?.filter(
      (_handler, index) => {
        return (
          mappedTags[index] > 0 &&
          mappedTags.indexOf(mappedTags[index]) === index
        );
      }
    );
  }

  updateConfig() {
    if (findHandler(this.handlerTag) != null) {
      this.removeDuplicatedRelations();

      let requireToFail: number[] = [];
      if (this.config.requireToFail) {
        requireToFail = extractValidHandlerTags(this.config.requireToFail);
      }

      let simultaneousWith: number[] = [];
      if (this.config.simultaneousWith) {
        simultaneousWith = extractValidHandlerTags(
          this.config.simultaneousWith
        );
      }

      RNGestureHandlerModule.updateGestureHandler(
        this.handlerTag,
        filterConfig(this.config, ALLOWED_PROPS, {
          simultaneousHandlers: simultaneousWith,
          waitFor: requireToFail,
        })
      );
    }
  }

  onBegan(
    callback: (
      event: UnwrappedGestureHandlerStateChangeEvent<EventPayloadT>
    ) => void
  ) {
    this.handlers.onBegan = callback;
    this.handlers.isWorklet[CALLBACK_TYPE.BEGAN] = this.isWorklet(callback);
    return this;
  }

  onStart(
    callback: (
      event: UnwrappedGestureHandlerStateChangeEvent<EventPayloadT>
    ) => void
  ) {
    this.handlers.onStart = callback;
    this.handlers.isWorklet[CALLBACK_TYPE.START] = this.isWorklet(callback);
    return this;
  }

  onEnd(
    callback: (
      event: UnwrappedGestureHandlerStateChangeEvent<EventPayloadT>,
      success: boolean
    ) => void
  ) {
    this.handlers.onEnd = callback;
    //@ts-ignore if callback is a worklet, the property will be available, if not then the check will return false
    this.handlers.isWorklet[CALLBACK_TYPE.END] = this.isWorklet(callback);
    return this;
  }

  enabled(enabled: boolean) {
    this.config.enabled = enabled;
    this.updateConfig();
    return this;
  }

  shouldCancelWhenOutside(value: boolean) {
    this.config.shouldCancelWhenOutside = value;
    this.updateConfig();
    return this;
  }

  hitSlop(hitSlop: HitSlop) {
    this.config.hitSlop = hitSlop;
    this.updateConfig();
    return this;
  }

  simultaneousWithExternalGesture(gesture: Exclude<GestureRef, number>) {
    this.addDependency('simultaneousWith', gesture);
    this.updateConfig();
    return this;
  }

  requireExternalGestureToFail(gesture: Exclude<GestureRef, number>) {
    this.addDependency('requireToFail', gesture);
    this.updateConfig();
    return this;
  }

  initialize() {
    this.handlerTag = getNextHandlerTag();
    this.handlers = { ...this.handlers, handlerTag: this.handlerTag };

    if (this.config.ref) {
      this.config.ref.current = this as GestureType;
    }
  }

  toGestureArray(): GestureType[] {
    return [this as GestureType];
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  prepare() {}
}

export abstract class ContinousBaseGesture<
  EventPayloadT extends Record<string, unknown>
> extends BaseGesture<EventPayloadT> {
  onUpdate(
    callback: (event: UnwrappedGestureHandlerEvent<EventPayloadT>) => void
  ) {
    this.handlers.onUpdate = callback;
    this.handlers.isWorklet[CALLBACK_TYPE.UPDATE] = this.isWorklet(callback);
    return this;
  }
}
