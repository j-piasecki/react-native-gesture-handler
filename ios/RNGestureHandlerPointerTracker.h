#import <Foundation/Foundation.h>

#import "RNEventType.h"

#define MAX_POINTERS_COUNT 12

@class RNGestureHandler;

@interface RNGestureHandlerPointerTracker : NSObject

@property (nonatomic) RNEventType eventType;
@property (nonatomic) NSArray<NSDictionary *> *pointerData;
@property (nonatomic) int trackedPointersCount;

- (id)initWithGestureHandler:(RNGestureHandler*)gestureHandler;

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event;
- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event;
- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event;
- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event;
- (void)reset;
- (void)cancelPointers;

@end
