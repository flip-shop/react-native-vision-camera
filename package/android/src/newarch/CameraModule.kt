package com.mrousavy.camera

import android.Manifest
import android.content.pm.PackageManager
import android.util.Log
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener
import com.mrousavy.camera.frameprocessor.VisionCameraInstaller
import com.mrousavy.camera.frameprocessor.VisionCameraProxy
import com.mrousavy.camera.types.PermissionStatus
import java.util.concurrent.ExecutorService

@ReactModule(name = "CameraModule")
class CameraModule(reactContext: ReactApplicationContext?) : NativeCameraModuleSpec(reactContext) {

  init {
    try {
      // Load the native part of VisionCamera.
      // Includes the OpenGL VideoPipeline, as well as Frame Processor JSI bindings
      System.loadLibrary("VisionCamera")
    } catch (e: UnsatisfiedLinkError) {
      Log.e(VisionCameraProxy.TAG, "Failed to load VisionCamera C++ library!", e)
      throw e
    }
  }

  /**
   * [NativeCameraModuleSpec] implementation
   */

  override fun installFrameProcessorBindings(): Boolean =
      try {
        val proxy = VisionCameraProxy(reactApplicationContext)
        VisionCameraInstaller.install(proxy)
        true
      } catch (e: Error) {
        Log.e(CameraViewModule.TAG, "Failed to install Frame Processor JSI Bindings!", e)
        false
      }

  override fun getCameraPermissionStatus(promise: Promise) {
    promise.resolve(getPermissionStatus(Manifest.permission.CAMERA))
  }

  override fun getMicrophonePermissionStatus(promise: Promise) {
    promise.resolve(getPermissionStatus((Manifest.permission.RECORD_AUDIO)))
  }

  override fun requestCameraPermission(promise: Promise) {
    requestPermission(Manifest.permission.CAMERA, promise)
  }

  override fun requestMicrophonePermission(promise: Promise) {
    requestPermission(Manifest.permission.RECORD_AUDIO, promise)
  }

  /** **/


  /**
   * Private functions
   */

  private fun getPermissionStatus(permission: String): String {
      val status = ContextCompat.checkSelfPermission(reactApplicationContext, permission)
      var parsed = PermissionStatus.fromPermissionStatus(status)
      if (parsed == PermissionStatus.DENIED && canRequestPermission(permission)) {
        parsed = PermissionStatus.NOT_DETERMINED
      }
      return parsed.unionValue
    }

    private fun requestPermission(permission: String, promise: Promise) {
      val activity = reactApplicationContext.currentActivity
      if (activity is PermissionAwareActivity) {
        val currentRequestCode = CameraViewModule.sharedRequestCode++
        val listener = PermissionListener { requestCode: Int, _: Array<String>, grantResults: IntArray ->
          if (requestCode == currentRequestCode) {
            val permissionStatus = if (grantResults.isNotEmpty()) grantResults[0] else PackageManager.PERMISSION_DENIED
            val parsed = PermissionStatus.fromPermissionStatus(permissionStatus)
            promise.resolve(parsed.unionValue)
            return@PermissionListener true
          }
          return@PermissionListener false
        }
        activity.requestPermissions(arrayOf(permission), currentRequestCode, listener)
      } else {
        promise.reject("NO_ACTIVITY", "No PermissionAwareActivity was found! Make sure the app has launched before calling this function.")
      }
    }

    private fun canRequestPermission(permission: String): Boolean {
      val activity = currentActivity as? PermissionAwareActivity
      return activity?.shouldShowRequestPermissionRationale(permission) ?: false
    }
}
