package com.swmansion.gesturehandler

import android.view.MotionEvent
import com.swmansion.gesturehandler.RotationGestureDetector.OnRotationGestureListener
import kotlin.math.abs

class RotationGestureHandler : GestureHandler<RotationGestureHandler>() {
  private var rotationGestureDetector: RotationGestureDetector? = null
  private var startRotation = 0.0
  private var currentRotation = 0.0
  val rotation
    get() = currentRotation - startRotation
  var velocity = 0.0
    private set

  val anchorX: Float
    get() = rotationGestureDetector?.anchorX ?: Float.NaN
  val anchorY: Float
    get() = rotationGestureDetector?.anchorY ?: Float.NaN

  init {
    setShouldCancelWhenOutside(false)
  }

  private val gestureListener: OnRotationGestureListener = object : OnRotationGestureListener {
    override fun onRotation(detector: RotationGestureDetector): Boolean {
      val prevRotation: Double = rotation
      currentRotation += detector.rotation
      val delta = detector.timeDelta
      if (delta > 0) {
        velocity = (rotation - prevRotation) / delta
      }
      if (abs(rotation) >= ROTATION_RECOGNITION_THRESHOLD && state == STATE_BEGAN) {
        activateIfNotManual()
      }
      return true
    }

    override fun onRotationBegin(detector: RotationGestureDetector) = true

    override fun onRotationEnd(detector: RotationGestureDetector) {
      end()
    }
  }

  override fun onHandle(event: MotionEvent) {
    if (state == STATE_UNDETERMINED) {
      velocity = 0.0
      currentRotation = 0.0
      startRotation = 0.0
      rotationGestureDetector = RotationGestureDetector(gestureListener)
      begin()
    }
    rotationGestureDetector?.onTouchEvent(event)
    if (event.actionMasked == MotionEvent.ACTION_UP) {
      if (state == STATE_ACTIVE) {
        end()
      } else {
        fail()
      }
    }
  }

  override fun beforeActivation() {
    startRotation = currentRotation
  }

  override fun onReset() {
    rotationGestureDetector = null
    velocity = 0.0
    currentRotation = 0.0
    startRotation = 0.0
  }

  companion object {
    private const val ROTATION_RECOGNITION_THRESHOLD = Math.PI / 36.0 // 5 deg in radians
  }
}
