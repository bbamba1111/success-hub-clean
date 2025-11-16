"use client"

import type React from "react"

import { useChat } from "ai"
import { DefaultChatTransport } from "ai"
import { Send, Sparkles, BookOpen, Target, Mic, MicOff, Volume2, VolumeX, Smartphone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect, useRef } from "react"

interface ClientContext {
  businessType?: string
  monthlyIntention?: string
  learningLevel?: string
  businessStage?: string
}

export function ClientCoGuideChat() {
  const [inputValue, setInputValue] = useState("")
  const [clientContext, setClientContext] = useState<ClientContext>({})
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    const savedContext = localStorage.getItem("clientContext")
    if (savedContext) {
      setClientContext(JSON.parse(savedContext))
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript
          setInputValue(transcript)
          setIsListening(false)
        }

        recognitionRef.current.onerror = () => {
          setIsListening(false)
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel()
      }
    }
  }, [])

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/client-co-guide" }),
    body: { clientContext },
  })

  useEffect(() => {
    if (voiceEnabled && messages.length > 0 && synthRef.current) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.role === "assistant") {
        const textParts = lastMessage.parts.filter((part) => part.type === "text")
        if (textParts.length > 0) {
          const textToSpeak = textParts.map((part: any) => part.text).join(" ")
          const utterance = new SpeechSynthesisUtterance(textToSpeak)
          utterance.rate = 1.0
          utterance.pitch = 1.0
          utterance.volume = 1.0

          utterance.onstart = () => setIsSpeaking(true)
          utterance.onend = () => setIsSpeaking(false)
          utterance.onerror = () => setIsSpeaking(false)

          synthRef.current.cancel()
          synthRef.current.speak(utterance)
        }
      }
    }
  }, [messages, voiceEnabled])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || status === "in_progress") return

    sendMessage({ text: inputValue })
    setInputValue("")
  }

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in your browser. Try Chrome or Safari on mobile.")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const toggleVoice = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel()
      setIsSpeaking(false)
    }
    setVoiceEnabled(!voiceEnabled)
  }

  const starterPrompts = [
    "Help me plan today's 4-hour workday",
    "Teach me about habit formation for my business",
    "I want to practice my elevator pitch",
    "Show me my progress this week",
  ]

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="border-b bg-gradient-to-r from-pink-50 to-rose-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-600" />
            <CardTitle className="text-lg sm:text-xl">Cherry Blossom Co-Guide</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleVoice} className="h-8 w-8" title="Toggle voice output">
              {voiceEnabled ? (
                <Volume2 className={`w-4 h-4 ${isSpeaking ? "text-pink-600 animate-pulse" : ""}`} />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        <CardDescription className="flex items-center gap-2 text-xs sm:text-sm">
          <Smartphone className="w-3 h-3 sm:w-4 sm:h-4" />
          Works on your phone - tap mic to talk
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {clientContext.monthlyIntention && (
          <div className="p-2 sm:p-3 bg-pink-50 border-b text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-pink-900">
              <Target className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="font-medium">This Month:</span>
              <span>{clientContext.monthlyIntention}</span>
            </div>
          </div>
        )}

        <ScrollArea className="flex-1 p-3 sm:p-4">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-muted-foreground">
                I'm trained on Barbara's Make Time For More™ model and personalized for your unique business journey.
                You can type or speak to me anytime.
              </p>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-medium">Get Started:</p>
                <div className="grid gap-2">
                  {starterPrompts.map((prompt, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2 px-3 text-xs sm:text-sm bg-transparent"
                      onClick={() => {
                        sendMessage({ text: prompt })
                      }}
                    >
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-2 shrink-0" />
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                      message.role === "user" ? "bg-pink-600 text-white" : "bg-muted"
                    }`}
                  >
                    {message.parts.map((part, index) => {
                      if (part.type === "text") {
                        return (
                          <p key={index} className="text-xs sm:text-sm whitespace-pre-wrap">
                            {part.text}
                          </p>
                        )
                      }
                      return null
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="p-3 sm:p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Button
              type="button"
              onClick={toggleListening}
              disabled={status === "in_progress"}
              size="icon"
              variant={isListening ? "default" : "outline"}
              className={`shrink-0 ${isListening ? "bg-pink-600 animate-pulse" : ""}`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type or tap mic to speak..."
              disabled={status === "in_progress" || isListening}
              className="flex-1 text-sm"
            />
            <Button type="submit" disabled={status === "in_progress" || !inputValue.trim()} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
