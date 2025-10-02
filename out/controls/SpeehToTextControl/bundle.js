/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
var pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./SpeehToTextControl/index.ts":
/*!*************************************!*\
  !*** ./SpeehToTextControl/index.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   SpeehToTextControl: () => (/* binding */ SpeehToTextControl)\n/* harmony export */ });\nclass SpeehToTextControl {\n  // ...existing code...\n  /**\n   * Empty constructor.\n   */\n  constructor() {\n    this.speechRecognition = null;\n    this.latestText = \"\";\n    // Empty\n  }\n  /**\n   * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.\n   * Data-set values are not initialized here, use updateView.\n   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.\n   * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.\n   * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.\n   * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.\n   */\n  init(context, notifyOutputChanged, state, container) {\n    // Create a wrapper for positioning icons\n    var wrapper = document.createElement(\"div\");\n    wrapper.style.position = \"relative\";\n    wrapper.style.display = \"inline-block\";\n    wrapper.style.width = \"90%\";\n    // Defensive: ensure width is always valid\n    if (isNaN(Number(wrapper.style.width)) || !wrapper.style.width) {\n      wrapper.style.width = \"100%\";\n    }\n    // Detect field type: SingleLine.TextArea (multiline) or SingleLine.Text (single-line)\n    var isMultiline = context.parameters.sampleProperty.type === \"SingleLine.TextArea\";\n    if (isMultiline) {\n      this.textInput = document.createElement(\"textarea\");\n      this.textInput.rows = 5;\n    } else {\n      this.textInput = document.createElement(\"input\");\n      this.textInput.type = \"text\";\n    }\n    this.textInput.style.width = \"90%\";\n    if (isNaN(Number(this.textInput.style.width)) || !this.textInput.style.width) {\n      this.textInput.style.width = \"100%\";\n    }\n    this.textInput.value = context.parameters.sampleProperty.raw || \"\";\n    this.textInput.style.paddingRight = \"40px\";\n    this.micButton = document.createElement(\"button\");\n    this.micButton.innerHTML = \"<span style='font-size:18px;'>&#x1F399;</span>\"; // Microphone icon only\n    this.micButton.style.position = \"absolute\";\n    this.micButton.style.right = \"8px\";\n    this.micButton.style.top = \"8px\";\n    this.micButton.style.width = \"24px\";\n    this.micButton.style.height = \"24px\";\n    this.micButton.style.border = \"none\";\n    this.micButton.style.background = \"transparent\";\n    this.micButton.style.cursor = \"pointer\";\n    this.micButton.title = \"Start Speech\";\n    this.stopButton = document.createElement(\"button\");\n    this.stopButton.innerHTML = \"<span style='font-size:18px;'>&#x1F6D1;</span>\"; // Stop icon only\n    this.stopButton.style.position = \"absolute\";\n    this.stopButton.style.right = \"36px\";\n    this.stopButton.style.top = \"8px\";\n    this.stopButton.style.width = \"24px\";\n    this.stopButton.style.height = \"24px\";\n    this.stopButton.style.border = \"none\";\n    this.stopButton.style.background = \"transparent\";\n    this.stopButton.style.cursor = \"pointer\";\n    this.stopButton.title = \"Stop Speech\";\n    this.stopButton.disabled = true;\n    wrapper.appendChild(this.textInput);\n    wrapper.appendChild(this.micButton);\n    wrapper.appendChild(this.stopButton);\n    container.appendChild(wrapper);\n    this.notifyOutputChanged = notifyOutputChanged;\n    this.speechRecognition = null;\n    this.micButton.addEventListener(\"click\", () => this.startRecognition());\n    this.stopButton.addEventListener(\"click\", () => this.stopRecognition());\n    this.textInput.addEventListener(\"input\", () => {\n      var _a;\n      this.latestText = this.textInput.value || \"\";\n      (_a = this.notifyOutputChanged) === null || _a === void 0 ? void 0 : _a.call(this);\n    });\n  }\n  /**\n   * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.\n   * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions\n   */\n  updateView(context) {\n    // Update the text input if the value changes externally\n    if (this.textInput && context.parameters.sampleProperty.raw !== this.textInput.value) {\n      this.textInput.value = context.parameters.sampleProperty.raw || \"\";\n    }\n  }\n  /**\n   * It is called by the framework prior to a control receiving new data.\n   * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as \"bound\" or \"output\"\n   */\n  getOutputs() {\n    return {\n      sampleProperty: this.textInput ? this.textInput.value : \"\"\n    };\n  }\n  /**\n   * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.\n   * i.e. cancelling any pending remote calls, removing listeners, etc.\n   */\n  destroy() {\n    this.stopRecognition();\n    if (this.textInput) this.textInput.remove();\n    if (this.micButton) this.micButton.remove();\n    if (this.stopButton) this.stopButton.remove();\n  }\n  startRecognition() {\n    var SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;\n    if (!SpeechRecognitionCtor) {\n      alert('Speech Recognition API not supported in this browser.');\n      return;\n    }\n    this.speechRecognition = new SpeechRecognitionCtor();\n    if (this.speechRecognition) {\n      this.speechRecognition.continuous = true;\n      this.speechRecognition.interimResults = true;\n      this.speechRecognition.lang = 'en-US';\n      this.speechRecognition.onresult = event => {\n        var _a;\n        var transcript = '';\n        for (var result of Array.from(event.results)) {\n          transcript += result[0].transcript;\n        }\n        if (this.textInput) {\n          this.textInput.value = transcript;\n          this.latestText = transcript;\n          (_a = this.notifyOutputChanged) === null || _a === void 0 ? void 0 : _a.call(this);\n        }\n      };\n      this.speechRecognition.onend = () => {\n        if (this.micButton) this.micButton.disabled = false;\n        if (this.stopButton) this.stopButton.disabled = true;\n      };\n      this.speechRecognition.onerror = event => {\n        alert('Speech recognition error: ' + event.error);\n        this.stopRecognition();\n      };\n      this.speechRecognition.start();\n    }\n    if (this.micButton) this.micButton.disabled = true;\n    if (this.stopButton) this.stopButton.disabled = false;\n  }\n  stopRecognition() {\n    if (this.speechRecognition) {\n      this.speechRecognition.stop();\n      this.speechRecognition = null;\n    }\n    if (this.micButton) this.micButton.disabled = false;\n    if (this.stopButton) this.stopButton.disabled = true;\n  }\n}\n// ...existing code...\n\n//# sourceURL=webpack://pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad/./SpeehToTextControl/index.ts?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./SpeehToTextControl/index.ts"](0, __webpack_exports__, __webpack_require__);
/******/ 	pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = __webpack_exports__;
/******/ 	
/******/ })()
;
if (window.ComponentFramework && window.ComponentFramework.registerControl) {
	ComponentFramework.registerControl('SpeehToTextControl.SpeehToTextControl', pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.SpeehToTextControl);
} else {
	var SpeehToTextControl = SpeehToTextControl || {};
	SpeehToTextControl.SpeehToTextControl = pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad.SpeehToTextControl;
	pcf_tools_652ac3f36e1e4bca82eb3c1dc44e6fad = undefined;
}