package com.mrousavy.camera

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

suspend fun CameraView.focus(pointMap: ReadableMap) {
  val x = pointMap.getInt("x")
  val y = pointMap.getInt("y")
  cameraSession.focus(x, y)
}

suspend fun CameraView.focus(pointMap: ReadableArray) {
  val x = pointMap.getInt(0)
  val y = pointMap.getInt(1)
  cameraSession.focus(x, y)
}

