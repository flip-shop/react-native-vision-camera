import { TurboModule } from 'react-native'
import { TurboModuleRegistry } from 'react-native'
import type { Double, Int32 } from 'react-native/Libraries/Types/CodegenTypes'

export interface Spec extends TurboModule {
  getAvailableVideoCodecs(fileType?: string): Promise<ReadonlyArray<string>>
  getAvailableCameraDevices(): Promise<
    ReadonlyArray<
      Readonly<{
        id: string
        devices: ReadonlyArray<string>
        position: string
        name: string
        hasFlash: boolean
        hasTorch: boolean
        isMultiCam: boolean
        minZoom: Double
        maxZoom: Double
        neutralZoom: Double
        formats: ReadonlyArray<
          Readonly<{
            photoHeight: Double
            photoWidth: Double
            videoHeight: Double
            videoWidth: Double
            isHighestPhotoQualitySupported?: boolean
            maxISO: Double
            minISO: Double
            fieldOfView: Double
            maxZoom: Double
            colorSpaces: string[]
            supportsVideoHDR: boolean
            supportsPhotoHDR: boolean
            frameRateRanges: ReadonlyArray<{
              minFrameRate: Int32
              maxFrameRate: Int32
            }>
            autoFocusSystem: string
            videoStabilizationModes: string[]
            pixelFormat: string
          }>
        >
        supportsParallelVideoProcessing: boolean
        supportsLowLightBoost: boolean
        supportsDepthCapture: boolean
        supportsRawCapture: boolean
        supportsFocus: boolean
      }>
    >
  >
}

export default TurboModuleRegistry.get<Spec>('CameraDeviceModule') as Spec | null
