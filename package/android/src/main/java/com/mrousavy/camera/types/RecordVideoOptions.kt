package com.mrousavy.camera.types

import com.facebook.react.bridge.ReadableMap

class RecordVideoOptions() {
  var fileType: VideoFileType = VideoFileType.MOV
  var flash: Flash = Flash.OFF
  var videoCodec = VideoCodec.H264
  var videoBitRateOverride: Double? = null
  var videoBitRateMultiplier: Double? = null


  constructor(map: ReadableMap): this() {
    if (map.hasKey("fileType")) {
      fileType = VideoFileType.fromUnionValue(map.getString("fileType"))
    }
    if (map.hasKey("flash")) {
      flash = Flash.fromUnionValue(map.getString("flash"))
    }
    if (map.hasKey("videoCodec")) {
      videoCodec = VideoCodec.fromUnionValue(map.getString("videoCodec"))
    }
    if (map.hasKey("videoBitRateOverride")) {
      videoBitRateOverride = map.getDouble("videoBitRateOverride")
    }
    if (map.hasKey("videoBitRateMultiplier")) {
      videoBitRateMultiplier = map.getDouble("videoBitRateMultiplier")
    }
  }

  constructor(
    fileTypeValue: String?,
    flashValue: String?,
    videoCodecValue: String?
  ): this() {
    fileTypeValue?.let { fileType = VideoFileType.fromUnionValue(it) }
    flashValue?.let { flash = Flash.fromUnionValue(it) }
    videoCodecValue?.let { videoCodec = VideoCodec.fromUnionValue(it) }
  }
}
