---
id: edge-cases
title: Edge cases
sidebar_label: Edge cases
---

- Changing `enabled` prop during a gesture has no effect, only when a gesture starts (that is a finger touches the screen) the `enabled` prop is taken into consideration to decide whether to extract (or not) the gesture and provide it with stream of events to analyze.
- `Native` gesture may not conform to the standard state flow due to platform specific workarounds to incorporate native views into RNGH.
- Keep in mind that `Touchables` from RNGH are rendering two additional views that may need to be styled separately to achieve desired effect (`style` and `containerStyle` props).
- ? (TODO: may be fixed before release) On iOS some gestures may skip the `BEGAN` state and transition directly to `ACTIVE`
- In order for the gesture composition to work, all composed gestures must be attached to the same `GestureHandlerRootView`.
