package com.mrousavy.camera;

import android.view.View;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.SimpleViewManager;

public abstract class VisionCameraManagerSpec<T extends View> extends SimpleViewManager<T> {
    public abstract void setCameraId(T view, @Nullable String value);
    public abstract void setPhoto(T view, boolean value);
    public abstract void setVideo(T view, boolean value);
    public abstract void setAudio(T view, boolean value);
    public abstract void setEnableFrameProcessor(T view, boolean value);
    public abstract void setPixelFormat(T view, @Nullable String value);
    public abstract void setEnableDepthData(T view, boolean value);
    public abstract void setEnableZoomGesture(T view, boolean value);
    public abstract void setEnableFpsGraph(T view, boolean value);
    public abstract void setEnableGpuBuffers(T view, boolean value);
    public abstract void setVideoStabilizationMode(T view, @Nullable String value);
    public abstract void setEnablePortraitEffectsMatteDelivery(T view, boolean value);
    public abstract void setFormat(T view, @Nullable ReadableMap value);
    public abstract void setResizeMode(T view, @Nullable String value);
    public abstract void setFps(T view, int value);
    public abstract void setPhotoHdr(T view, boolean value);
    public abstract void setVideoHdr(T view, boolean value);
    public abstract void setLowLightBoost(T view, boolean value);
    public abstract void setIsActive(T view, boolean value);
    public abstract void setTorch(T view, @Nullable String value);
    public abstract void setZoom(T view, double value);
    public abstract void setExposure(T view, double value);
    public abstract void setOrientation(T view, @Nullable String value);
    public abstract void setCodeScannerOptions(T view, @Nullable ReadableMap value);
}