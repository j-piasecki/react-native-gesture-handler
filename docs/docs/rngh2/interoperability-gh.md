---
id: interoperability-gh
title: Interoperability with gesture handlers
sidebar_label: Interoperability with gesture handlers
---

The new API with `gestures` is somewhat compatible with the old `gesture handlers`. Unfortunately you cannot use the new [gesture composing](composing-gestures) with `gesture handlers`, however you can still mark relations using `refs`. If you want to make a gesture handler wait for (or simultaneous with) a gesture, simply use `withRef` method on the gesture to set the `ref` object and pass it to the appropriate property on the gesture handler.

Similarly, if you want to make a gesture simultaneous with (or wait for failure of) a gesture handler, set the `ref` prop of the gesture handler and pass the same ref to the `simultaneousWithExternalGesture` or `requireExternalGestureToFail` method on the gesture object.

This should allow you to migrate your codebase from the gesture handlers to gestures smoothly and at your own pace. Just keep in mind that the gesture handlers cannot have the `GestureDetector` as their direct child, as it's a functional component.
