"use client"

import { useState } from "react"

export default function TestChatPage() {
  const [message, setMessage] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const testChat = async () => {
    setLoading(true)
    setError("")
    setResponse("")

    try {
      const res = await fetch("/api/cherry-blossom-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message || "Hi Cherry Blossom! Can you help me with work-life balance?",
          messages: [],
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Something went wrong")
      } else {
        setResponse(data.message)
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to API")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-green-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🌸 Test Cherry Blossom Chat</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message or leave blank for default..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={testChat}
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-green-500 text-white font-semibold py-3 px-6 rounded-lg hover:from-pink-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "🌸 Cherry Blossom is thinking..." : "🌸 Send Message"}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold">❌ Error:</p>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
          )}

          {response && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-semibold mb-2">✅ Cherry Blossom says:</p>
              <p className="text-gray-700 whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 font-semibold mb-2">📝 Instructions:</p>
          <ol className="text-blue-700 space-y-1 list-decimal list-inside">
            <li>Type a message (or leave blank for default)</li>
            <li>Click "Send Message"</li>
            <li>Wait 2-5 seconds for response</li>
            <li>If you see ✅ = Your OpenAI key works!</li>
            <li>If you see ❌ = There's an issue to fix</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
