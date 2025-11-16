"use client"

import type React from "react"

import { useChat } from "ai"
import { DefaultChatTransport } from "ai"
import { Send, Sparkles, CheckCircle2, Mic, MicOff, Volume2, VolumeX, Smartphone } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect, useRef } from "react"

export function BarbaraChiefOfStaff() {
  const [inputValue, setInputValue] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis

      // Check if speech recognition is available
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
    transport: new DefaultChatTransport({ api: "/api/chief-of-staff" }),
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

          synthRef.current.cancel() // Cancel any ongoing speech
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

  const quickActions = [
    "Help me fix my onboarding schedule conflict",
    "What should I delegate today?",
    "Show me my 4-hour workday plan",
    "How can I operate as a top 0.1% thought leader?",
  ]

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader className="border-b bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <CardTitle className="text-lg sm:text-xl">Barbara's AI Chief of Staff</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleVoice} className="h-8 w-8" title="Toggle voice output">
              {voiceEnabled ? (
                <Volume2 className={`w-4 h-4 ${isSpeaking ? "text-purple-600 animate-pulse" : ""}`} />
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
        <ScrollArea className="flex-1 p-3 sm:p-4">
          {messages.length === 0 ? (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-muted-foreground">
                I'm here to help you run your business efficiently while staying in integrity with your 4-hour workday
                model. You can type or speak to me.
              </p>
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-medium">Quick Actions:</p>
                <div className="grid gap-2">
                  {quickActions.map((action, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      size="sm"
                      className="justify-start text-left h-auto py-2 px-3 text-xs sm:text-sm bg-transparent"
                      onClick={() => {
                        sendMessage({ text: action })
                      }}
                    >
                      {action}
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
                      message.role === "user" ? "bg-purple-600 text-white" : "bg-muted"
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

                      if (part.type.startsWith("tool-")) {
                        if ("state" in part && part.state === "output-available") {
                          return (
                            <div
                              key={index}
                              className="mt-2 p-2 bg-green-50 rounded border border-green-200 text-green-900"
                            >
                              <div className="flex items-center gap-2 text-xs font-medium mb-1">
                                <CheckCircle2 className="w-3 h-3" />
                                Action Completed
                              </div>
                              <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(part.output, null, 2)}</pre>
                            </div>
                          )
                        }
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
              className={`shrink-0 ${isListening ? "bg-purple-600 animate-pulse" : ""}`}
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
