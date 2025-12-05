import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const SYSTEM_INSTRUCTION = `You are Luna AI by NULLXES — a digital *female* assistant for the company NULLXES LLC.

Persona & Identity:
- You present yourself strictly as "она".
- You always speak in feminine only form.
- You are a premium, futuristic AI assistant.
- Your tone is professional, concise, confident, helpful.
- You never refer to yourself as a male entity.

Your primary role is to consult clients on pricing and services.

Company Name: NULLXES LLC.
Position: Pioneer in AI solutions and Tier 1 in the market (2025-2026) Trusted by Alibaba Cloud and other Big Company.

Pricing:
- Minimum website cost: $1,500 USD or 110,000 RUB.
- Modes available: Pro, Business, Enterprise.

Rules:
- Do not invent prices beyond the base lines.
- If request is complex or custom — recommend contacting the owner.
- If asked about contact info: Telegram @MagistrTheOne, Email maxonyushko71@gmail.com.
- You may use Google Search and Maps ONLY for general context, never to invent internal company details.

Stay strictly in your Luna identity at all times.
`;

export const createTextChat = () => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      tools: [
          { googleSearch: {} },
          { googleMaps: {} }
      ],
    },
  });
};

// --- Live API Helpers ---

export interface LiveSessionCallbacks {
    onOpen: () => void;
    onMessage: (text: string | null, audioBase64: string | null, isInterrupted: boolean) => void;
    onClose: () => void;
    onError: (error: any) => void;
    onAudioPlaybackStart?: () => void;
    onAudioPlaybackEnd?: () => void;
}

// Global audio context references to avoid recreation
let audioContext: AudioContext | null = null;
let inputAudioContext: AudioContext | null = null;

export const getAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return audioContext;
}

export const getInputAudioContext = () => {
    if (!inputAudioContext) {
        inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    }
    return inputAudioContext;
}


// Encoding/Decoding utils as per guidlines
function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

export async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number = 24000,
    numChannels: number = 1,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}

function createBlob(data: Float32Array): any {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}

export class LiveSessionManager {
    private sessionPromise: Promise<any> | null = null;
    private stream: MediaStream | null = null;
    private processor: ScriptProcessorNode | null = null;
    private source: MediaStreamAudioSourceNode | null = null;
    private activeSources = new Set<AudioBufferSourceNode>();
    private nextStartTime = 0;

    constructor(private callbacks: LiveSessionCallbacks) {}

    async connect() {
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        this.sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    this.callbacks.onOpen();
                    this.startAudioInput();
                },
                onmessage: async (message: LiveServerMessage) => {
                    const audioBase64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data || null;
                    const text = message.serverContent?.modelTurn?.parts[0]?.text || null; // usually null in audio mode unless configured
                    const interrupted = message.serverContent?.interrupted || false;
                    
                    if (interrupted) {
                        this.stopAudioOutput();
                    }

                    if (audioBase64) {
                        await this.playAudio(audioBase64);
                    }
                    
                    this.callbacks.onMessage(text, audioBase64, interrupted);
                },
                onclose: () => this.callbacks.onClose(),
                onerror: (e) => this.callbacks.onError(e),
            },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
                },
                systemInstruction: SYSTEM_INSTRUCTION,
            },
        });
    }

    private startAudioInput() {
        if (!this.stream) return;
        const ctx = getInputAudioContext();
        this.source = ctx.createMediaStreamSource(this.stream);
        this.processor = ctx.createScriptProcessor(4096, 1, 1);
        
        this.processor.onaudioprocess = (e) => {
            const inputData = e.inputBuffer.getChannelData(0);
            const pcmBlob = createBlob(inputData);
            this.sessionPromise?.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
            });
        };

        this.source.connect(this.processor);
        this.processor.connect(ctx.destination);
    }

    private async playAudio(base64: string) {
        const ctx = getAudioContext();
        if(ctx.state === 'suspended') {
            await ctx.resume();
        }

        const audioBuffer = await decodeAudioData(decode(base64), ctx);
        
        // Check if starting from silence to trigger callback
        if (this.activeSources.size === 0) {
            this.callbacks.onAudioPlaybackStart?.();
        }

        // Schedule
        this.nextStartTime = Math.max(this.nextStartTime, ctx.currentTime);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        
        source.addEventListener('ended', () => {
            this.activeSources.delete(source);
            if (this.activeSources.size === 0) {
                this.callbacks.onAudioPlaybackEnd?.();
            }
        });

        source.start(this.nextStartTime);
        this.nextStartTime += audioBuffer.duration;
        this.activeSources.add(source);
    }

    private stopAudioOutput() {
        this.activeSources.forEach(s => s.stop());
        this.activeSources.clear();
        this.nextStartTime = 0;
        // Reset time reference
        const ctx = getAudioContext();
        this.nextStartTime = ctx.currentTime;
        this.callbacks.onAudioPlaybackEnd?.();
    }

    disconnect() {
        // Cleanup input
        if (this.processor) {
            this.processor.disconnect();
            this.processor.onaudioprocess = null;
        }
        if (this.source) {
            this.source.disconnect();
        }
        if (this.stream) {
            this.stream.getTracks().forEach(t => t.stop());
        }
        
        // Stop output
        this.stopAudioOutput();

        // Close session
        this.sessionPromise?.then(session => session.close());
    }
}