package com.mrousavy.camera

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule

@ReactModule(name = "CameraDeviceModule")
class CameraDeviceModule(reactContext: ReactApplicationContext?) : NativeCameraDeviceModuleSpec(reactContext) {

  override fun getAvailableVideoCodecs(fileType: String?, promise: Promise?) {
  }

  override fun getAvailableCameraDevices(promise: Promise?) {
  }


}
