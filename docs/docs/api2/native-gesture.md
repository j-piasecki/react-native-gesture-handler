---
id: native-gesture
title: Native gesture
sidebar_label: Native gesture
---

A gesture that allows other touch handling components to participate in RNGH's gesture system. When used, the other component should be the direct child of a `GestureDetector`.

## Config

See [set of properties common to all gestures](./common-gesture.md#config). Below is a list of properties specific to `NativeGesture`:

### `shouldActivateOnStart(value: boolean)` (**Android only**)

When `true`, underlying handler will activate unconditionally when in `BEGAN` or `UNDETERMINED` state.

### `disallowInterruption(value: boolean)`

When `true`, cancels all other gesture handlers when this `NativeViewGestureHandler` receives an `ACTIVE` state event.

## Event data

See [set of event attributes common to all gestures](./common-gesture.md#event-data). Below is a list of gesture event attributes specific to `NativeGesture`:

### `pointerInside`

True if gesture was performed inside of containing view, false otherwise.
