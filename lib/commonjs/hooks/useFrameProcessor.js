"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useFrameProcessor = useFrameProcessor;

var _react = require("react");

/* global _setGlobalConsole */
const capturableConsole = console;
/**
 * Returns a memoized Frame Processor function wich you can pass to the `<Camera>`. (See ["Frame Processors"](https://react-native-vision-camera.com/docs/guides/frame-processors))
 *
 * Make sure to add the `'worklet'` directive to the top of the Frame Processor function, otherwise it will not get compiled into a worklet.
 *
 * @param frameProcessor The Frame Processor
 * @param dependencies The React dependencies which will be copied into the VisionCamera JS-Runtime.
 * @returns The memoized Frame Processor.
 * @example
 * ```ts
 * const frameProcessor = useFrameProcessor((frame) => {
 *   'worklet'
 *   const qrCodes = scanQRCodes(frame)
 *   console.log(`QR Codes: ${qrCodes}`)
 * }, [])
 * ```
 */

function useFrameProcessor(frameProcessor, dependencies) {
  return (0, _react.useCallback)(frame => {
    'worklet'; // @ts-expect-error

    if (global.didSetConsole == null || global.didSetConsole === false) {
      const console = {
        // @ts-expect-error __callAsync is injected by native REA
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        debug: capturableConsole.debug.__callAsync,
        // @ts-expect-error __callAsync is injected by native REA
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        log: capturableConsole.log.__callAsync,
        // @ts-expect-error __callAsync is injected by native REA
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        warn: capturableConsole.warn.__callAsync,
        // @ts-expect-error __callAsync is injected by native REA
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        error: capturableConsole.error.__callAsync,
        // @ts-expect-error __callAsync is injected by native REA
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        info: capturableConsole.info.__callAsync
      }; // @ts-expect-error _setGlobalConsole is set by RuntimeDecorator::decorateRuntime

      _setGlobalConsole(console); // @ts-expect-error


      global.didSetConsole = true;
    }

    frameProcessor(frame); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
//# sourceMappingURL=useFrameProcessor.js.map