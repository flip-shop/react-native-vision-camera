import type { HostComponent, ViewProps } from 'react-native'
import type { Double, Int32 } from 'react-native/Libraries/Types/CodegenTypes'
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands'
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent'
import { Orientation } from '../Orientation'

export type VisionCameraComponentType = HostComponent<NativeProps>

export interface NativeProps extends ViewProps {
  cameraId: string
  photo?: boolean
  video?: boolean
  audio?: boolean
  enableFrameProcessor: boolean
  pixelFormat?: string
  enableDepthData?: boolean
  enableZoomGesture?: boolean
  enableFpsGraph?: boolean
  enableGpuBuffers?: boolean
  videoStabilizationMode?: string
  enablePortraitEffectsMatteDelivery?: boolean
  format?: Readonly<{
    videoHeight: Double
    videoWidth: Double
    photoHeight: Double
    photoWidth: Double
    minFps: Double
    maxFps: Double
    minISO: Double
    maxISO: Double
    fieldOfView: Double
    maxZoom: Double
    videoStabilizationModes: string[]
    autoFocusSystem: string
    supportsVideoHDR: boolean
    supportsPhotoHDR: boolean
    pixelFormat: string
    supportsDepthCapture: boolean
  }>
  resizeMode?: string
  fps?: Int32
  photoHdr?: boolean
  videoHdr?: boolean
  lowLightBoost?: boolean
  isActive: boolean
  torch?: string
  zoom?: Double
  exposure?: Double
  orientation?: string
  codeScannerOptions?: Readonly<{
    codeTypes: string[]
    regionOfInterest?: Readonly<{
      x: Double
      y: Double
      width: Double
      height: Double
    }>
  }>

  // onInitialized?: DirectEventHandler<void>
  // onError?: DirectEventHandler<
  //   Readonly<{
  //     code: string
  //     message: string
  //     cause: Readonly<{ code: string; domain: string; message: string; details: string }>
  //   }>
  // >
  // onViewReady: DirectEventHandler<void>
}

export interface NativeCommands {
  takePhoto: (
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    qualityPrioritization?: string,
    flash?: string,
    enableAutoRedEyeReduction?: boolean,
    enableAutoStabilization?: boolean,
    enableAutoDistortionCorrection?: boolean,
    enableShutterSound?: boolean,
    enablePrecapture?: boolean,
  ) => Promise<
    Readonly<{
      path: string
      width: Double
      height: Double
      isRawPhoto: boolean
      orientation: Orientation
      isMirrored: boolean
    }>
  >
  startRecording: (
    viewRef: React.ElementRef<HostComponent<NativeProps>>,
    flash?: string,
    fileType?: string,
    videoCodec?: string,
  ) => Promise<
    Readonly<{
      video?: Readonly<{
        path: string
        duration: Double
      }>
    }>
  >
  pauseRecording(viewRef: React.ElementRef<HostComponent<NativeProps>>): Promise<void>
  resumeRecording(viewRef: React.ElementRef<HostComponent<NativeProps>>): Promise<void>
  stopRecording(viewRef: React.ElementRef<HostComponent<NativeProps>>): Promise<void>
  focus(viewRef: React.ElementRef<HostComponent<NativeProps>>, x: Int32, y: Int32): Promise<void>
}

export const Commands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['takePhoto', 'startRecording', 'pauseRecording', 'resumeRecording', 'stopRecording', 'focus'],
})

export default codegenNativeComponent<NativeProps>('CameraView')
