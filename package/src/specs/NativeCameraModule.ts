import type { TurboModule } from 'react-native'
import { TurboModuleRegistry } from 'react-native'

export interface Spec extends TurboModule {
  installFrameProcessorBindings(): boolean
  getCameraPermissionStatus(): Promise<string>
  getMicrophonePermissionStatus(): Promise<string>
  requestCameraPermission(): Promise<string>
  requestMicrophonePermission(): Promise<string>
}

export default TurboModuleRegistry.get<Spec>('CameraModule') as Spec | null
