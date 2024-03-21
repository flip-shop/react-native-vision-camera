package com.mrousavy.camera

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.module.annotations.ReactModule
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.mrousavy.camera.core.CameraQueues
import com.mrousavy.camera.types.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import java.lang.ref.WeakReference

@Suppress("unused")
@ReactModule(name = CameraViewManager.TAG)
class CameraViewManager : VisionCameraManagerSpec<CameraView>() {

  private val coroutineScope = CoroutineScope(CameraQueues.cameraQueue.coroutineDispatcher)
  private val cameraViewManagerImpl by lazy {
    CameraViewManagerImpl()
  }

  public override fun createViewInstance(context: ThemedReactContext): CameraView = CameraView(context)

  override fun onAfterUpdateTransaction(view: CameraView) {
    super.onAfterUpdateTransaction(view)
    view.update()
  }

  override fun getExportedCustomDirectEventTypeConstants(): MutableMap<String, Any>? =
    MapBuilder.builder<String, Any>()
      .put("cameraViewReady", MapBuilder.of("registrationName", "onViewReady"))
      .put("cameraInitialized", MapBuilder.of("registrationName", "onInitialized"))
      .put("cameraStarted", MapBuilder.of("registrationName", "onStarted"))
      .put("cameraStopped", MapBuilder.of("registrationName", "onStopped"))
      .put("cameraError", MapBuilder.of("registrationName", "onError"))
      .put("cameraCodeScanned", MapBuilder.of("registrationName", "onCodeScanned"))
      .build()

  override fun getName(): String = TAG

  override fun onDropViewInstance(view: CameraView) {
    view.destroy()
    super.onDropViewInstance(view)
  }

  @ReactProp(name = "cameraId")
  override fun setCameraId(view: CameraView, cameraId: String?) {
    view.cameraId = cameraId
  }

  @ReactProp(name = "photo")
  override fun setPhoto(view: CameraView, photo: Boolean) {
    view.photo = photo
  }

  @ReactProp(name = "video")
  override fun setVideo(view: CameraView, video: Boolean) {
    view.video = video
  }

  @ReactProp(name = "audio")
  override fun setAudio(view: CameraView, audio: Boolean) {
    view.audio = audio
  }

  @ReactProp(name = "enableFrameProcessor")
  override fun setEnableFrameProcessor(view: CameraView, enableFrameProcessor: Boolean) {
    view.enableFrameProcessor = enableFrameProcessor
  }

  @ReactProp(name = "pixelFormat")
  override fun setPixelFormat(view: CameraView, pixelFormat: String?) {
    view.pixelFormat = PixelFormat.fromUnionValue(pixelFormat)
  }

  @ReactProp(name = "enableDepthData")
  override fun setEnableDepthData(view: CameraView, enableDepthData: Boolean) {
    view.enableDepthData = enableDepthData
  }

  @ReactProp(name = "enableZoomGesture")
  override fun setEnableZoomGesture(view: CameraView, enableZoomGesture: Boolean) {
    view.enableZoomGesture = enableZoomGesture
  }

  @ReactProp(name = "enableFpsGraph")
  override fun setEnableFpsGraph(view: CameraView, enableFpsGraph: Boolean) {
    view.enableFpsGraph = enableFpsGraph
  }

  @ReactProp(name = "enableGpuBuffers")
  override fun setEnableGpuBuffers(view: CameraView, enableGpuBuffers: Boolean) {
    view.enableGpuBuffers = enableGpuBuffers
  }

  @ReactProp(name = "videoStabilizationMode")
  override fun setVideoStabilizationMode(view: CameraView, videoStabilizationMode: String?) {
    if (videoStabilizationMode != null) {
      val newMode = VideoStabilizationMode.fromUnionValue(videoStabilizationMode)
      view.videoStabilizationMode = newMode
    } else {
      view.videoStabilizationMode = null
    }
  }

  @ReactProp(name = "enablePortraitEffectsMatteDelivery")
  override fun setEnablePortraitEffectsMatteDelivery(view: CameraView, enablePortraitEffectsMatteDelivery: Boolean) {
    view.enablePortraitEffectsMatteDelivery = enablePortraitEffectsMatteDelivery
  }

  @ReactProp(name = "format")
  override fun setFormat(view: CameraView, format: ReadableMap?) {
    if (format != null) {
      val newFormat = CameraDeviceFormat.fromJSValue(format)
      view.format = newFormat
    } else {
      view.format = null
    }
  }

  @ReactProp(name = "resizeMode")
  override fun setResizeMode(view: CameraView, resizeMode: String?) {
    view.resizeMode = ResizeMode.fromUnionValue(resizeMode)
  }

  // TODO: Change when TurboModules release.
  // We're treating -1 as "null" here, because when I make the fps parameter
  // of type "Int?" the react bridge throws an error.
  @ReactProp(name = "fps")
  override fun setFps(view: CameraView, fps: Int) {
    view.fps = if (fps > 0) fps else null
  }

  @ReactProp(name = "photoHdr")
  override fun setPhotoHdr(view: CameraView, photoHdr: Boolean) {
    view.photoHdr = photoHdr
  }

  @ReactProp(name = "videoHdr")
  override fun setVideoHdr(view: CameraView, videoHdr: Boolean) {
    view.videoHdr = videoHdr
  }

  @ReactProp(name = "lowLightBoost")
  override fun setLowLightBoost(view: CameraView, lowLightBoost: Boolean) {
    view.lowLightBoost = lowLightBoost
  }

  @ReactProp(name = "isActive")
  override fun setIsActive(view: CameraView, isActive: Boolean) {
    view.isActive = isActive
  }

  @ReactProp(name = "torch")
  override fun setTorch(view: CameraView, torch: String?) {
    if (torch != null) {
      val newMode = Torch.fromUnionValue(torch)
      view.torch = newMode
    } else {
      view.torch = Torch.OFF
    }
  }

  @ReactProp(name = "zoom")
  override fun setZoom(view: CameraView, zoom: Double) {
    view.zoom = zoom.toFloat()
  }

  @ReactProp(name = "exposure")
  override fun setExposure(view: CameraView, exposure: Double) {
    view.exposure = exposure
  }

  @ReactProp(name = "orientation")
  override fun setOrientation(view: CameraView, orientation: String?) {
    if (orientation != null) {
      val newMode = Orientation.fromUnionValue(orientation)
      view.orientation = newMode
    } else {
      view.orientation = Orientation.PORTRAIT
    }
  }

  @ReactProp(name = "codeScannerOptions")
  override fun setCodeScannerOptions(view: CameraView, codeScannerOptions: ReadableMap?) {
    if (codeScannerOptions != null) {
      val newCodeScannerOptions = CodeScannerOptions.fromJSValue(codeScannerOptions)
      view.codeScannerOptions = newCodeScannerOptions
    } else {
      view.codeScannerOptions = null
    }
  }

  /**
   * functions
   */

  override fun focus(view: CameraView?, x: Int, y: Int) {
    coroutineScope.launch {
      view?.cameraSession?.focus(x,y)
    }
  }

  override fun stopRecording(view: CameraView?) {
    coroutineScope.launch {
      view?.stopRecording()
    }
  }

  override fun resumeRecording(view: CameraView?) {
    coroutineScope.launch {
      view?.resumeRecording()
    }
  }

  override fun pauseRecording(view: CameraView?) {
    coroutineScope.launch {
      view?.pauseRecording()
    }
  }

  override fun startRecording(view: CameraView?, flash: String?, fileType: String?, videoCodec: String?) {
    coroutineScope.launch {
      view?.startRecording(
        options = RecordVideoOptions(
          fileTypeValue = fileType,
          flashValue = flash,
          videoCodecValue = videoCodec
        )
      ) {

      }
    }
  }

  override fun takePhoto(
    view: CameraView?,
    qualityPrioritization: String?,
    flash: String?,
    enableAutoRedEyeReduction: Boolean,
    enableAutoStabilization: Boolean,
    enableAutoDistortionCorrection: Boolean,
    enableShutterSound: Boolean,
    enablePrecapture: Boolean
  ) {
    coroutineScope.launch {
      view?.takePhoto(
        options = TakePhotoOptions(
          qualityPrioritization = qualityPrioritization,
          flash = flash,
          enableAutoRedEyeReduction = enableAutoRedEyeReduction,
          enableAutoStabilization = enableAutoStabilization,
          enableAutoDistortionCorrection = enableAutoDistortionCorrection,
          enableShutterSound = enableShutterSound,
          enablePreCapture = enablePrecapture
        )
      )
    }
  }

  override fun receiveCommand(root: CameraView, commandId: String?, args: ReadableArray?) {
    cameraViewManagerImpl.receiveCommand(WeakReference(root), commandId, args)
    super.receiveCommand(root, commandId, args)
  }

  override fun getCommandsMap(): MutableMap<String, Int>? {
    return cameraViewManagerImpl.getCommandsMap()
  }

  companion object {
    const val TAG = "CameraView"
  }
}
