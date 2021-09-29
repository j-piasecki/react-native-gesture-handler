import { BaseGesture, BaseGestureConfig } from './gesture';

export class CustomGesture extends BaseGesture<Record<string, never>> {
  public config: BaseGestureConfig = {};

  constructor() {
    super();

    this.handlerName = 'CustomGestureHandler';
  }
}

export type CustomGestureType = InstanceType<typeof CustomGesture>;
