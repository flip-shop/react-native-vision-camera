function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from 'react';
import { requireNativeComponent, NativeModules, findNodeHandle, Platform } from 'react-native';
import { CameraCaptureError, CameraRuntimeError, tryParseNativeCameraError, isErrorWithCause } from './CameraError';
//#endregion
// NativeModules automatically resolves 'CameraView' to 'CameraViewModule'
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const CameraModule = NativeModules.CameraView;
if (CameraModule == null) console.error("Camera: Native Module 'CameraView' was null! Did you run pod install?"); //#region Camera Component

/**
 * ### A powerful `<Camera>` component.
 *
 * Read the [VisionCamera documentation](https://react-native-vision-camera.com/) for more information.
 *
 * The `<Camera>` component's most important (and therefore _required_) properties are:
 *
 * * {@linkcode CameraProps.device | device}: Specifies the {@linkcode CameraDevice} to use. Get a {@linkcode CameraDevice} by using the {@linkcode useCameraDevices | useCameraDevices()} hook, or manually by using the {@linkcode Camera.getAvailableCameraDevices Camera.getAvailableCameraDevices()} function.
 * * {@linkcode CameraProps.isActive | isActive}: A boolean value that specifies whether the Camera should actively stream video frames or not. This can be compared to a Video component, where `isActive` specifies whether the video is paused or not. If you fully unmount the `<Camera>` component instead of using `isActive={false}`, the Camera will take a bit longer to start again.
 *
 * @example
 * ```tsx
 * function App() {
 *   const devices = useCameraDevices('wide-angle-camera')
 *   const device = devices.back
 *
 *   if (device == null) return <LoadingView />
 *   return (
 *     <Camera
 *       style={StyleSheet.absoluteFill}
 *       device={device}
 *       isActive={true}
 *     />
 *   )
 * }
 * ```
 *
 * @component
 */

export class Camera extends React.PureComponent {
  /** @internal */

  /** @internal */

  /** @internal */
  constructor(props) {
    super(props);

    _defineProperty(this, "displayName", Camera.displayName);

    _defineProperty(this, "lastFrameProcessor", void 0);

    _defineProperty(this, "isNativeViewMounted", false);

    _defineProperty(this, "ref", void 0);

    this.onViewReady = this.onViewReady.bind(this);
    this.onInitialized = this.onInitialized.bind(this);
    this.onError = this.onError.bind(this);
    this.onFrameProcessorPerformanceSuggestionAvailable = this.onFrameProcessorPerformanceSuggestionAvailable.bind(this);
    this.ref = /*#__PURE__*/React.createRef();
    this.lastFrameProcessor = undefined;
  }

  get handle() {
    const nodeHandle = findNodeHandle(this.ref.current);

    if (nodeHandle == null || nodeHandle === -1) {
      throw new CameraRuntimeError('system/view-not-found', "Could not get the Camera's native view tag! Does the Camera View exist in the native view-tree?");
    }

    return nodeHandle;
  } //#region View-specific functions (UIViewManager)

  /**
   * Take a single photo and write it's content to a temporary file.
   *
   * @throws {@linkcode CameraCaptureError} When any kind of error occured while capturing the photo. Use the {@linkcode CameraCaptureError.code | code} property to get the actual error
   * @example
   * ```ts
   * const photo = await camera.current.takePhoto({
   *   qualityPrioritization: 'quality',
   *   flash: 'on',
   *   enableAutoRedEyeReduction: true
   * })
   * ```
   */


  async takePhoto(options) {
    try {
      return await CameraModule.takePhoto(this.handle, options !== null && options !== void 0 ? options : {});
    } catch (e) {
      throw tryParseNativeCameraError(e);
    }
  }
  /**
   * Take a snapshot of the current preview view.
   *
   * This can be used as an alternative to {@linkcode Camera.takePhoto | takePhoto()} if speed is more important than quality
   *
   * @throws {@linkcode CameraCaptureError} When any kind of error occured while taking a snapshot. Use the {@linkcode CameraCaptureError.code | code} property to get the actual error
   *
   * @platform Android
   * @example
   * ```ts
   * const photo = await camera.current.takeSnapshot({
   *   quality: 85,
   *   skipMetadata: true
   * })
   * ```
   */


  async takeSnapshot(options) {
    if (Platform.OS !== 'android') throw new CameraCaptureError('capture/capture-type-not-supported', `'takeSnapshot()' is not available on ${Platform.OS}!`);

    try {
      return await CameraModule.takeSnapshot(this.handle, options !== null && options !== void 0 ? options : {});
    } catch (e) {
      throw tryParseNativeCameraError(e);
    }
  }
  /**
   * Start a new video recording.
   *
   * Records in the following formats:
   * * **iOS**: QuickTime (`.mov`)
   * * **Android**: MPEG4 (`.mp4`)
   *
   * @blocking This function is synchronized/blocking.
   *
   * @throws {@linkcode CameraCaptureError} When any kind of error occured while starting the video recording. Use the {@linkcode CameraCaptureError.code | code} property to get the actual error
   *
   * @example
   * ```ts
   * camera.current.startRecording({
   *   onRecordingFinished: (video) => console.log(video),
   *   onRecordingError: (error) => console.error(error),
   * })
   * setTimeout(() => {
   *   camera.current.stopRecording()
   * }, 5000)
   * ```
   */


  startRecording(options) {
    const {
      onRecordingError,
      onRecordingFinished,
      ...passThroughOptions
    } = options;
    if (typeof onRecordingError !== 'function' || typeof onRecordingFinished !== 'function') throw new CameraRuntimeError('parameter/invalid-parameter', 'The onRecordingError or onRecordingFinished functions were not set!');

    const onRecordCallback = (video, error) => {
      if (error != null) return onRecordingError(error);
      if (video != null) return onRecordingFinished(video);
    }; // TODO: Use TurboModules to either make this a sync invokation, or make it async.


    try {
      CameraModule.startRecording(this.handle, passThroughOptions, onRecordCallback);
    } catch (e) {
      throw tryParseNativeCameraError(e);
    }
  }
  /**
   * Pauses the current video recording.
   *
   * @throws {@linkcode CameraCaptureError} When any kind of error occured while pausing the video recording. Use the {@linkcode CameraCaptureError.code | code} property to get the actual error
   *
   * @example
   * ```ts
   * // Start
   * await camera.current.startRecording()
   * await timeout(1000)
   * // Pause
   * await camera.current.pauseRecording()
   * await timeout(500)
   * // Resume
   * await camera.current.resumeRecording()
   * await timeout(2000)
   * // Stop
   * const video = await camera.current.stopRecording()
   * ```
   */


  async pauseRecording() {
    try {
      return await CameraModule.pauseRecording(this.handle);
    } catch (e) {
      throw tryParseNativeCameraError(e);
    }
  }
  /**
   * Resumes a currently paused video recording.
   *
   * @throws {@linkcode CameraCaptureError} When any kind of error occured while resuming the video recording. Use the {@linkcode CameraCaptureError.code | code} property to get the actual error
   *
   * @example
   * ```ts
   * // Start
   * await camera.current.startRecording()
   * await timeout(1000)
   * // Pause
   * await camera.current.pauseRecording()
   * await timeout(500)
   * // Resume
   * await camera.current.resumeRecording()
   * await timeout(2000)
   * // Stop
   * const video = await camera.current.stopRecording()
   * ```
   */


  async resumeRecording() {
    try {
      return await CameraModule.resumeRecording(this.handle);
    } catch (e) {
      throw tryParseNativeCameraError(e);
    }
  }
  /**
   * Stop the current video recording.
   *
   * @throws {@linkcode CameraCaptureError} When any kind of error occured while stopping the video recording. Use the {@linkcode CameraCaptureError.code | code} property to get the actual error
   *
   * @example
   * ```ts
   * await camera.current.startRecording()
   * setTimeout(async () => {
   *  const video = await camera.current.stopRecording()
   * }, 5000)
   * ```
   */


  async stopRecording() {
    try {
      return await CameraModule.stopRecording(this.handle);
    } catch (e) {
      throw tryParseNativeCameraError(e);
    }
  }
  /**
   * Focus the camera to a specific point in the coordinate system.
   * @param {Point} point The point to focus to. This should be relative to the Camera view's coordinate system,
   * and expressed in Pixel on iOS and Points on Android.
   *  * `(0, 0)` means **top left**.
   *  * `(CameraView.width, CameraView.height)` means **bottom right**.
   *
   * Make sure the value doesn't exceed the CameraView's dimensions.
   *
   * @throws {@linkcode CameraRuntimeError} When any kind of error occured while focussing. Use the {@linkcode CameraRuntimeError.code | code} property to get the actual error
   * @example
   * ```ts
   * await camera.current.focus({
   *   x: tapEvent.x,
   *   y: tapEvent.y
   * })
   * ```
   */


  async focus(point) {
    try {
      return await CameraModule.focus(this.handle, point);
    } catch (e) {
      throw tryParseNativeCameraError(e);
    }
  } //#endregion

  /**
   * Get a list of video codecs the current camera supports for a given file type.  Returned values are ordered by efficiency (descending).
   * @example
   * ```ts
   * const codecs = await camera.current.getAvailableVideoCodecs("mp4")
   * ```
   * @throws {@linkcode CameraRuntimeError} When any kind of error occured while getting available video codecs. Use the {@linkcode ParameterError.code | code} property to get the actual error
   * @platform iOS
   */


  async getAvailableVideoCodecs(fileType) {
    if (Platform.OS !== 'ios') return []; // no video codecs supported on other platforms.

    try {
      return await CameraModule.getAvailableVideoCodecs(this.handle, fileType);
    } catch (e) {
      throw tryParseNativeCameraError(e);
    }
  } //#region Static Functions (NativeModule)

  /**
   * Get a list of all available camera devices on the current phone.
   *
   * @throws {@linkcode CameraRuntimeError} When any kind of error occured while getting all available camera devices. Use the {@linkcode CameraRuntimeError.code | code} property to get the actual error
   * @example
   * ```ts
   * const devices = await Camera.getAvailableCameraDevices()
   * const filtered = devices.filter((d) => matchesMyExpectations(d))
   * const sorted = devices.sort(sortDevicesByAmountOfCameras)
   * return {
   *   back: sorted.find((d) => d.position === "back"),
   *   front: sorted.find((d) => d.position === "front")
   * }
   * ```
   */


  static async getAvailableCameraDevices() {
    try {
      return await CameraModule.getAvailableCameraDevices();
    } catch (e) {
      throw tryParseNativeCameraError(e);
    }
  }
  /**
   * Gets the current Camera Permission Status. Check this before mounting the Camera to ensure
   * the user has permitted the app to use the camera.
   *
   * To actually prompt the user for camera permission, use {@linkcode Camera.requestCameraPermission | requestCameraPermission()}.
   *
   * @throws {@linkcode CameraRuntimeError} When any kind of error occured while getting the current permission status. Use the {@linkcode CameraRuntimeError.code | code} property to get the actual error
   */


  static async getCameraPermissionStatus() {
    try {
      return await CameraModule.getCameraPermissionStatus();
    } catch (e) {
      throw tryParseNativeCameraError(e);
    }
  }
  /**
   * Gets the current Microphone-Recording Permission Status. Check this before mounting the Camera to ensure
   * the user has permitted the app to use the microphone.
   *
   * To actually prompt the user for microphone permission, use {@linkcode Camera.requestMicrophonePermission | requestMicrophonePermission()}.
   *
   * @throws {@linkcode CameraRuntimeError} When any kind of error occured while getting the current permission status. Use the {@linkcode CameraRuntimeError.code | code} property to get the actual error
   */


  static async getMicrophonePermissionStatus() {
    try {
      return await CameraModule.getMicrophonePermissionStatus();
    } catch (e) {
      throw tryParseNativeCameraError(e);
    }
  }
  /**
   * Shows a "request permission" alert to the user, and resolves with the new camera permission status.
   *
   * If the user has previously blocked the app from using the camera, the alert will not be shown
   * and `"denied"` will be returned.
   *
   * @throws {@linkcode CameraRuntimeError} When any kind of error occured while requesting permission. Use the {@linkcode CameraRuntimeError.code | code} property to get the actual error
   */


  static async requestCameraPermission() {
    try {
      return await CameraModule.requestCameraPermission();
    } catch (e) {
      throw tryParseNativeCameraError(e);
    }
  }
  /**
   * Shows a "request permission" alert to the user, and resolves with the new microphone permission status.
   *
   * If the user has previously blocked the app from using the microphone, the alert will not be shown
   * and `"denied"` will be returned.
   *
   * @throws {@linkcode CameraRuntimeError} When any kind of error occured while requesting permission. Use the {@linkcode CameraRuntimeError.code | code} property to get the actual error
   */


  static async requestMicrophonePermission() {
    try {
      return await CameraModule.requestMicrophonePermission();
    } catch (e) {
      throw tryParseNativeCameraError(e);
    }
  } //#endregion
  //#region Events (Wrapped to maintain reference equality)


  onError(event) {
    if (this.props.onError != null) {
      const error = event.nativeEvent;
      const cause = isErrorWithCause(error.cause) ? error.cause : undefined;
      this.props.onError( // @ts-expect-error We're casting from unknown bridge types to TS unions, I expect it to hopefully work
      new CameraRuntimeError(error.code, error.message, cause));
    }
  }

  onInitialized() {
    var _this$props$onInitial, _this$props;

    (_this$props$onInitial = (_this$props = this.props).onInitialized) === null || _this$props$onInitial === void 0 ? void 0 : _this$props$onInitial.call(_this$props);
  }

  onFrameProcessorPerformanceSuggestionAvailable(event) {
    if (this.props.onFrameProcessorPerformanceSuggestionAvailable != null) this.props.onFrameProcessorPerformanceSuggestionAvailable(event.nativeEvent);
  } //#endregion
  //#region Lifecycle

  /** @internal */


  assertFrameProcessorsEnabled() {
    // @ts-expect-error JSI functions aren't typed
    if (global.setFrameProcessor == null || global.unsetFrameProcessor == null) {
      throw new CameraRuntimeError('frame-processor/unavailable', 'Frame Processors are not enabled. See https://react-native-vision-camera.com/docs/guides/troubleshooting');
    }
  }

  setFrameProcessor(frameProcessor) {
    this.assertFrameProcessorsEnabled(); // @ts-expect-error JSI functions aren't typed

    global.setFrameProcessor(this.handle, frameProcessor);
  }

  unsetFrameProcessor() {
    this.assertFrameProcessorsEnabled(); // @ts-expect-error JSI functions aren't typed

    global.unsetFrameProcessor(this.handle);
  }

  onViewReady() {
    this.isNativeViewMounted = true;

    if (this.props.frameProcessor != null) {
      // user passed a `frameProcessor` but we didn't set it yet because the native view was not mounted yet. set it now.
      this.setFrameProcessor(this.props.frameProcessor);
      this.lastFrameProcessor = this.props.frameProcessor;
    }
  }
  /** @internal */


  componentDidUpdate() {
    if (!this.isNativeViewMounted) return;
    const frameProcessor = this.props.frameProcessor;

    if (frameProcessor !== this.lastFrameProcessor) {
      // frameProcessor argument identity changed. Update native to reflect the change.
      if (frameProcessor != null) this.setFrameProcessor(frameProcessor);else this.unsetFrameProcessor();
      this.lastFrameProcessor = frameProcessor;
    }
  } //#endregion

  /** @internal */


  render() {
    // We remove the big `device` object from the props because we only need to pass `cameraId` to native.
    const {
      device,
      frameProcessor,
      frameProcessorFps,
      ...props
    } = this.props;
    return /*#__PURE__*/React.createElement(NativeCameraView, _extends({}, props, {
      frameProcessorFps: frameProcessorFps === 'auto' ? -1 : frameProcessorFps,
      cameraId: device.id,
      ref: this.ref,
      onViewReady: this.onViewReady,
      onInitialized: this.onInitialized,
      onError: this.onError,
      onFrameProcessorPerformanceSuggestionAvailable: this.onFrameProcessorPerformanceSuggestionAvailable,
      enableFrameProcessor: frameProcessor != null
    }));
  }

} //#endregion
// requireNativeComponent automatically resolves 'CameraView' to 'CameraViewManager'

_defineProperty(Camera, "displayName", 'Camera');

const NativeCameraView = requireNativeComponent('CameraView', // @ts-expect-error because the type declarations are kinda wrong, no?
Camera);
//# sourceMappingURL=Camera.js.map