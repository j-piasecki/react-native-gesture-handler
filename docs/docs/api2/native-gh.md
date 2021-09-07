---
id: new-api-native-view-gh
title: NativeViewGestureHandler with the new API
sidebar_label: NativeView
---

There currently is no replacement for the [`NativeViewGestureHandler`](../api/gesture-handlers/nativeview-gh.md) in the new API, however this doesn't mean that you are forced to use the old one if you need it. New gestures can work alongside gesture handlers, you can even specify relations between them (although in less than ideal way).
Similarly to other gesture handlers `NativeViewGestureHandler` cannot have a functional component as its direct child (`GestureDetector` is a functional component) and if you want it to work with Reanimated, the `Animated.View` has to be its direct child. You can specify relations using [`waitFor`](../api/gesture-handlers/common-gh.md#waitfor) and [`simultaneousHandlers`](../api/gesture-handlers/common-gh.md#simultaneoushandlers) props by passing to them a [ref to the gesture](./common-gesture.md#withrefref). If you want the relation in the other way, you can use [simultaneousWithExternalGesture](./common-gesture.md#simultaneouswithexternalgestureothergesture) and [requireExternalGestureToFail](./common-gesture.md#requireexternalgesturetofailothergesture) - both of these methods can accept a ref to a gesture handler.
