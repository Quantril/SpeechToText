// --- Web Speech API Type Definitions ---
type SpeechRecognitionConstructor = new () => SpeechRecognition;
interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    start(): void;
    stop(): void;
}
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
    length: number;
    [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
    length: number;
    [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}
interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}
import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class SpeehToTextControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    // ...existing code...
    /**
     * Empty constructor.
     */
    constructor() {
        // Empty
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {

    // Create a wrapper for positioning icons
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    wrapper.style.width = "90%";
    // Defensive: ensure width is always valid
    if (isNaN(Number(wrapper.style.width)) || !wrapper.style.width) {
        wrapper.style.width = "100%";
    }


    // Detect field type: SingleLine.TextArea (multiline) or SingleLine.Text (single-line)
    const isMultiline = context.parameters.sampleProperty.type === "SingleLine.TextArea";
    if (isMultiline) {
        this.textInput = document.createElement("textarea");
        (this.textInput as HTMLTextAreaElement).rows = 5;
    } else {
        this.textInput = document.createElement("input");
        (this.textInput as HTMLInputElement).type = "text";
    }
    this.textInput.style.width = "90%";
    if (isNaN(Number(this.textInput.style.width)) || !this.textInput.style.width) {
        this.textInput.style.width = "100%";
    }
    (this.textInput as HTMLInputElement | HTMLTextAreaElement).value = context.parameters.sampleProperty.raw || "";
    this.textInput.style.paddingRight = "40px";

    this.micButton = document.createElement("button");
    this.micButton.innerHTML = "<span style='font-size:18px;'>&#x1F399;</span>"; // Microphone icon only
    this.micButton.style.position = "absolute";
    this.micButton.style.right = "8px";
    this.micButton.style.top = "8px";
    this.micButton.style.width = "24px";
    this.micButton.style.height = "24px";
    this.micButton.style.border = "none";
    this.micButton.style.background = "transparent";
    this.micButton.style.cursor = "pointer";
    this.micButton.title = "Start Speech";

    this.stopButton = document.createElement("button");
    this.stopButton.innerHTML = "<span style='font-size:18px;'>&#x1F6D1;</span>"; // Stop icon only
    this.stopButton.style.position = "absolute";
    this.stopButton.style.right = "36px";
    this.stopButton.style.top = "8px";
    this.stopButton.style.width = "24px";
    this.stopButton.style.height = "24px";
    this.stopButton.style.border = "none";
    this.stopButton.style.background = "transparent";
    this.stopButton.style.cursor = "pointer";
    this.stopButton.title = "Stop Speech";
    this.stopButton.disabled = true;

    wrapper.appendChild(this.textInput);
    wrapper.appendChild(this.micButton);
    wrapper.appendChild(this.stopButton);
    container.appendChild(wrapper);

        this.notifyOutputChanged = notifyOutputChanged;
        this.speechRecognition = null;

        this.micButton.addEventListener("click", () => this.startRecognition());
        this.stopButton.addEventListener("click", () => this.stopRecognition());

        this.textInput.addEventListener("input", () => {
            this.latestText = (this.textInput as HTMLInputElement | HTMLTextAreaElement).value || "";
            this.notifyOutputChanged?.();
        });
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Update the text input if the value changes externally
        if (this.textInput && context.parameters.sampleProperty.raw !== (this.textInput as HTMLInputElement | HTMLTextAreaElement).value) {
            (this.textInput as HTMLInputElement | HTMLTextAreaElement).value = context.parameters.sampleProperty.raw || "";
        }
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {
            sampleProperty: this.textInput ? (this.textInput as HTMLInputElement | HTMLTextAreaElement).value : ""
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
    this.stopRecognition();
    if (this.textInput) this.textInput.remove();
    if (this.micButton) this.micButton.remove();
    if (this.stopButton) this.stopButton.remove();
    }

    // --- Custom Speech Recognition Logic ---
    private textInput: HTMLInputElement | HTMLTextAreaElement | undefined;
    private micButton: HTMLButtonElement | undefined;
    private stopButton: HTMLButtonElement | undefined;
    private notifyOutputChanged: (() => void) | undefined;
    private speechRecognition: SpeechRecognition | null = null;
    private latestText = "";

    private startRecognition() {
        const SpeechRecognitionCtor = (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor, webkitSpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ||
            (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor, webkitSpeechRecognition?: SpeechRecognitionConstructor }).webkitSpeechRecognition;
        if (!SpeechRecognitionCtor) {
            alert('Speech Recognition API not supported in this browser.');
            return;
        }
        this.speechRecognition = new SpeechRecognitionCtor();
        if (this.speechRecognition) {
            this.speechRecognition.continuous = true;
            this.speechRecognition.interimResults = true;
            this.speechRecognition.lang = 'en-US';

            this.speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
                let transcript = '';
                for (const result of Array.from(event.results)) {
                    transcript += result[0].transcript;
                }
                if (this.textInput) {
                    (this.textInput as HTMLInputElement | HTMLTextAreaElement).value = transcript;
                    this.latestText = transcript;
                    this.notifyOutputChanged?.();
                }
            };
            this.speechRecognition.onend = () => {
                if (this.micButton) this.micButton.disabled = false;
                if (this.stopButton) this.stopButton.disabled = true;
            };
            this.speechRecognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                alert('Speech recognition error: ' + event.error);
                this.stopRecognition();
            };
            this.speechRecognition.start();
        }
        if (this.micButton) this.micButton.disabled = true;
        if (this.stopButton) this.stopButton.disabled = false;
    }

    private stopRecognition() {
        if (this.speechRecognition) {
            this.speechRecognition.stop();
            this.speechRecognition = null;
        }
        if (this.micButton) this.micButton.disabled = false;
        if (this.stopButton) this.stopButton.disabled = true;
    }
    }
// ...existing code...
