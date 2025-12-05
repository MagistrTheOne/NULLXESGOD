import React, { useState, useEffect, useRef } from 'react';
import { GenerateContentResponse, Chat } from "@google/genai";
import { Message, GroundingChunk } from '../types';
import { createTextChat, LiveSessionManager } from '../services/geminiService';
import LunaVisualizer from './LunaVisualizer';

const ChatInterface: React.FC = () => {
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visualizerState, setVisualizerState] = useState<'idle' | 'listening' | 'speaking' | 'thinking'>('idle');
  const [groundingChunks, setGroundingChunks] = useState<GroundingChunk[]>([]);
  
  // Refs
  const chatSessionRef = useRef<Chat | null>(null);
  const liveManagerRef = useRef<LiveSessionManager | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Text Chat
  useEffect(() => {
    chatSessionRef.current = createTextChat();
    // Initial greeting
    setMessages([{
        id: 'init',
        role: 'model',
        text: 'Greetings. I am Luna AI. How can I assist you with NULLXES pricing or services today?',
        timestamp: Date.now()
    }]);
    return () => {
        if (liveManagerRef.current) {
            liveManagerRef.current.disconnect();
        }
    };
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle Text Submit
  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !chatSessionRef.current) return;

    const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        text: inputText,
        timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);
    setVisualizerState('thinking');

    try {
        const result = await chatSessionRef.current.sendMessageStream({ message: userMsg.text });
        
        let fullText = '';
        const msgId = (Date.now() + 1).toString();
        
        // Optimistic update for stream
        setMessages(prev => [...prev, {
            id: msgId,
            role: 'model',
            text: '',
            timestamp: Date.now()
        }]);

        let chunks: GroundingChunk[] = [];

        for await (const chunk of result) {
            const c = chunk as GenerateContentResponse;
            const textPart = c.text;
            if (textPart) {
                fullText += textPart;
                setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: fullText } : m));
            }
            // Collect grounding
            if (c.candidates?.[0]?.groundingMetadata?.groundingChunks) {
                // @ts-ignore - Types might vary slightly in raw response vs SDK wrapper, ensuring safety
                chunks = [...chunks, ...c.candidates[0].groundingMetadata.groundingChunks];
            }
        }
        setGroundingChunks(chunks);
    } catch (err) {
        console.error(err);
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            text: 'I apologize, I encountered an error processing your request.',
            timestamp: Date.now()
        }]);
    } finally {
        setIsLoading(false);
        setVisualizerState('idle');
    }
  };

  // Handle Voice Toggle
  const toggleVoiceMode = async () => {
      if (mode === 'text') {
          setMode('voice');
          setVisualizerState('thinking'); // connecting...
          
          liveManagerRef.current = new LiveSessionManager({
              onOpen: () => {
                  setVisualizerState('listening');
              },
              onMessage: (text, audio, interrupted) => {
                   if (interrupted) {
                       // handled by audio playback end usually, but good fallback
                       setVisualizerState('listening');
                   }
              },
              onAudioPlaybackStart: () => {
                  setVisualizerState('speaking');
              },
              onAudioPlaybackEnd: () => {
                  setVisualizerState('listening');
              },
              onClose: () => {
                  setMode('text');
                  setVisualizerState('idle');
              },
              onError: (e) => {
                  console.error("Live API Error", e);
                  setMode('text');
                  setVisualizerState('idle');
                  alert("Voice session error. Check console.");
              }
          });
          await liveManagerRef.current.connect();

      } else {
          liveManagerRef.current?.disconnect();
          setMode('text');
          setVisualizerState('idle');
      }
  };

  return (
    <div className="w-full h-full glass-panel rounded-2xl p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-8">
        {/* Left: Visualizer & Controls */}
        <div className="w-full md:w-1/3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-6 shrink-0">
            <div className="flex-1 flex items-center justify-center min-h-[200px] md:min-h-0">
                <LunaVisualizer state={visualizerState} />
            </div>
            
            <div className="flex justify-center pt-4 md:pt-8">
                <button
                    onClick={toggleVoiceMode}
                    className={`px-6 py-3 rounded-full flex items-center gap-2 transition-all w-full justify-center text-sm md:text-base ${
                        mode === 'voice' 
                        ? 'bg-red-500/20 text-red-400 border border-red-500 hover:bg-red-500/30' 
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}
                >
                    {mode === 'voice' ? (
                        <>
                            <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm1 0a1 1 0 100-2 1 1 0 000 2zm4 0a1 1 0 100-2 1 1 0 000 2z" /></svg>
                            End Session
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            Start Live Conversation
                        </>
                    )}
                </button>
            </div>
        </div>

        {/* Right: Text Chat Area / Voice Status */}
        <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">
            {mode === 'voice' ? (
                 <div className="flex-1 flex items-center justify-center text-center text-gray-400 mb-4">
                    <div className="space-y-4">
                        <p className="text-lg font-medium text-white">
                            {visualizerState === 'speaking' ? 'Luna is speaking...' : 'Voice Mode Active'}
                        </p>
                        <p className="text-sm opacity-60">
                            {visualizerState === 'speaking' ? 'Listening will resume shortly.' : 'Speak naturally to Luna.'}
                        </p>
                        <div className="flex gap-2 justify-center h-12 items-end">
                            {visualizerState === 'speaking' ? (
                                <>
                                    <div className="w-1 h-8 bg-blue-400 animate-[pulse_0.4s_infinite]"></div>
                                    <div className="w-1 h-12 bg-purple-400 animate-[pulse_0.6s_infinite]"></div>
                                    <div className="w-1 h-6 bg-cyan-400 animate-[pulse_0.5s_infinite]"></div>
                                    <div className="w-1 h-10 bg-blue-400 animate-[pulse_0.7s_infinite]"></div>
                                </>
                            ) : (
                                <>
                                    <div className="w-1 h-2 bg-gray-600 animate-pulse"></div>
                                    <div className="w-1 h-2 bg-gray-600 animate-pulse delay-100"></div>
                                    <div className="w-1 h-2 bg-gray-600 animate-pulse delay-200"></div>
                                </>
                            )}
                        </div>
                    </div>
                 </div>
            ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[90%] md:max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-white text-black font-medium' 
                                : 'bg-white/10 text-gray-200 border border-white/5'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {groundingChunks.length > 0 && (
                        <div className="text-xs text-gray-500 mt-2 p-2 border-t border-white/10">
                            <p className="mb-1 font-semibold">Sources:</p>
                            <div className="flex flex-wrap gap-2">
                            {groundingChunks.map((chunk, i) => {
                                const uri = chunk.web?.uri || chunk.maps?.uri;
                                const title = chunk.web?.title || chunk.maps?.title || "Source";
                                if(uri) {
                                    return <a key={i} href={uri} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400 truncate max-w-[150px]">{title}</a>
                                }
                                return null;
                            })}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            )}

            {/* Input - Always visible but disabled in voice mode */}
            <form onSubmit={handleTextSubmit} className="relative shrink-0">
                <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={mode === 'voice' ? "Listening..." : "Ask about NULLXES..."}
                    disabled={isLoading || mode === 'voice'}
                    className={`w-full bg-black/50 border rounded-xl py-3 md:py-4 pl-4 pr-24 text-sm md:text-base text-white placeholder-gray-500 focus:outline-none transition-colors ${
                        mode === 'voice' 
                        ? 'border-white/10 text-gray-500 cursor-not-allowed' 
                        : 'border-white/20 focus:border-white/40'
                    }`}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                        <button
                        type="button"
                        onClick={toggleVoiceMode}
                        className={`p-2 rounded-lg transition-colors ${
                            mode === 'voice' ? 'text-red-400 bg-red-500/10' : 'text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                        title={mode === 'voice' ? "Stop Voice Mode" : "Start Voice Chat"}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </button>
                    <button 
                        type="submit" 
                        disabled={isLoading || !inputText.trim() || mode === 'voice'}
                        className="p-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 transition-colors"
                    >
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default ChatInterface;