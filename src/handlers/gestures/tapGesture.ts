import { BaseGestureConfig, BaseGesture } from './gesture';
import {
  TapGestureConfig,
  TapGestureHandlerEventPayload,
} from '../TapGestureHandler';

export class TapGesture extends BaseGesture<TapGestureHandlerEventPayload> {
  public config: BaseGestureConfig & TapGestureConfig = {};

  constructor() {
    super();

    this.handlerName = 'TapGestureHandler';
  }

  minPointers(minPointers: number) {
    this.config.minPointers = minPointers;
    this.updateConfig();
    return this;
  }

  numberOfTaps(count: number) {
    this.config.numberOfTaps = count;
    this.updateConfig();
    return this;
  }

  maxDistance(maxDist: number) {
    this.config.maxDist = maxDist;
    this.updateConfig();
    return this;
  }

  maxDuration(duration: number) {
    this.config.maxDurationMs = duration;
    this.updateConfig();
    return this;
  }

  maxDelay(delay: number) {
    this.config.maxDelayMs = delay;
    this.updateConfig();
    return this;
  }

  maxDeltaX(delta: number) {
    this.config.maxDeltaX = delta;
    this.updateConfig();
    return this;
  }

  maxDeltaY(delta: number) {
    this.config.maxDeltaY = delta;
    this.updateConfig();
    return this;
  }
}
