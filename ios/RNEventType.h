#import <Foundation/Foundation.h>

typedef NS_ENUM(NSInteger, RNEventType) {
    RNEventTypeUndetermined = 0,
    RNEventTypePointerDown,
    RNEventTypePointerMove,
    RNEventTypePointerUp,
    RNEventTypeCancelled,
};
