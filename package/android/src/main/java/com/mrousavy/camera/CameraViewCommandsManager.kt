package com.mrousavy.camera

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.common.MapBuilder
import com.mrousavy.camera.core.CameraQueues
import com.mrousavy.camera.types.RecordVideoOptions
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import java.lang.ref.WeakReference

class CameraViewCommandsManager {

  private val coroutineScope = CoroutineScope(CameraQueues.cameraQueue.coroutineDispatcher)

  private val takePhotoCommandName = "takePhoto"
  private val takePhotoCommand = 1
  private val startRecordingCommandName = "startRecording"
  private val startRecordingCommand = 2
  private val pauseRecordingCommandName = "pauseRecording"
  private val pauseRecordingCommand = 3
  private val resumeRecordingCommandName = "resumeRecording"
  private val resumeRecordingCommand = 4
  private val stopRecordingCommandName = "stopRecording"
  private val stopRecordingCommand = 5
  private val focusCommandName = "focus"
  private val focusCommand = 6


  fun getCommandsMap(): MutableMap<String, Int> {
    return MapBuilder.builder<String, Int>()
      .put(takePhotoCommandName, takePhotoCommand)
      .put(startRecordingCommandName, startRecordingCommand)
      .put(pauseRecordingCommandName, pauseRecordingCommand)
      .put(resumeRecordingCommandName, resumeRecordingCommand)
      .put(stopRecordingCommandName, stopRecordingCommand)
      .put(focusCommandName, focusCommand)
      .build()
  }

  fun receiveCommand(viewRef: WeakReference<CameraView>, command: String?, args: ReadableArray?) {

    coroutineScope.launch {
      when(command) {
        takePhotoCommandName -> args?.let {
          viewRef.get()?.takePhoto(
            options = TakePhotoOptions(it)
          )
        }

        startRecordingCommandName -> args?.let {
          viewRef.get()?.startRecording(
            options = RecordVideoOptions(it),
            onRecordCallback = {}
          )
        }

        pauseRecordingCommandName -> viewRef.get()?.pauseRecording()
        resumeRecordingCommandName -> viewRef.get()?.resumeRecording()
        stopRecordingCommandName -> viewRef.get()?.stopRecording()
        focusCommandName -> args?.let { viewRef.get()?.focus(it) }
      }
    }

  }


}
