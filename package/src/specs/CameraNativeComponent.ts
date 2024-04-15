import type { HostComponent, ViewProps } from 'react-native'
import type { Double, Int32 } from 'react-native/Libraries/Types/CodegenTypes'
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent'

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

export default codegenNativeComponent<NativeProps>('CameraView')
