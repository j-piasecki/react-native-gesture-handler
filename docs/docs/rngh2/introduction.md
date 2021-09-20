---
id: introduction
title: Introduction
sidebar_label: Introduction
---

RNGH2 introduces a new way of creating gestures. Instead of creating a gesture handler component for every gesture you want to create, you just need to create a `GestureDetector` component and assign to it all the gestures you want it to recognize. It is also designed to work seamlessly with `Reanimated 2`, you just need to assign your gestures to the `animatedGesture` prop instead of the `gesture`.

You can create gestures using the `Gesture` object and methods it provides, and configure them in the builder-like pattern. If you want to specify behavior between the gestures instead of using `waitFor` and `simultaneousGestures` you can use the new system of [gesture composition](./composing-gestures.md).

If you want to migrate from the old API to the new one, check out the [interoperability with gesture handlers](./interoperability-gh.md) to see how the new API can work alongside the old one. Possibility to migrate step by step instead of updating all your codebase at once may smooth out the transition.
