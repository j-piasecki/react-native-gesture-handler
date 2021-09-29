#import <React/RCTEventEmitter.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTUIManager.h>

#import "RNGestureHandlerStateManager.h"

@interface RNGestureHandlerModule : RCTEventEmitter <RCTBridgeModule, RNGestureHandlerStateManager>

@end
  
