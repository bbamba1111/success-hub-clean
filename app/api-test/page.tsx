"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"

interface ApiTestResult {
  status: string
  message: string
  apis: Record<string, string>
  testResponse?: string
  error?: string
  timestamp?: string
}

export default function ApiTestPage() {
  const [testResult, setTestResult] = useState<ApiTestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runApiTest = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/test")
      const data = await response.json()
      setTestResult(data)
    } catch (error) {
      setTestResult({
        status: "error",
        message: "Failed to connect to API test endpoint",
        apis: {
          connection: "❌ Cannot reach test endpoint",
        },
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    runApiTest()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex justify-center mb-4">
            <img
              src="/images/logo.png"
              alt="Make Time For More Logo"
              width={80}
              height={80}
              className="rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">API Configuration Test</h1>
          <p className="text-gray-600 mb-6">Test your API connections to ensure all features work properly</p>
          <Link href="/">
            <Button variant="outline" className="mb-6 bg-transparent">
              ← Back to Home
            </Button>
          </Link>
        </div>

        {/* Test Results */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">API Status</CardTitle>
              <Button onClick={runApiTest} disabled={isLoading} variant="outline" size="sm">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Test APIs
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-[#7FB069]" />
                <span className="ml-3 text-gray-600">Testing API connections...</span>
              </div>
            ) : testResult ? (
              <div className="space-y-6">
                {/* Overall Status */}
                <div className="flex items-center gap-3">
                  {testResult.status === "success" ? (
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">
                      {testResult.status === "success" ? "All Systems Operational" : "Configuration Issues Detected"}
                    </h3>
                    <p className="text-gray-600">{testResult.message}</p>
                  </div>
                </div>

                {/* API Status Details */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">API Connections:</h4>
                  {Object.entries(testResult.apis).map(([api, status]) => (
                    <div key={api} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium capitalize">{api.replace(/([A-Z])/g, " $1")}</span>
                      <Badge
                        variant={status.includes("✅") ? "default" : "destructive"}
                        className={status.includes("✅") ? "bg-green-100 text-green-800" : ""}
                      >
                        {status}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Test Response */}
                {testResult.testResponse && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">OpenAI Test Response:</h4>
                    <p className="text-green-700">{testResult.testResponse}</p>
                  </div>
                )}

                {/* Error Details */}
                {testResult.error && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-red-800 mb-2">Error Details:</h4>
                    <p className="text-red-700 text-sm font-mono">{testResult.error}</p>
                  </div>
                )}

                {/* Timestamp */}
                {testResult.timestamp && (
                  <p className="text-xs text-gray-500">
                    Last tested: {new Date(testResult.timestamp).toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Click "Test APIs" to check your configuration</p>
            )}
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">1. Get OpenAI API Key</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  Go to{" "}
                  <a
                    href="https://platform.openai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    platform.openai.com
                  </a>
                </li>
                <li>Sign up or log in to your account</li>
                <li>Navigate to the API Keys section</li>
                <li>Click "Create new secret key"</li>
                <li>Copy the key (starts with sk-)</li>
              </ol>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">2. Configure Environment Variables</h3>
              <p className="text-gray-700 mb-3">
                Create a <code className="bg-gray-100 px-2 py-1 rounded">.env.local</code> file in your project root:
              </p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <div># OpenAI API Key (Required)</div>
                <div>OPENAI_API_KEY=your_openai_api_key_here</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">3. Restart Your Development Server</h3>
              <p className="text-gray-700">After adding the environment variables, restart your development server:</p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mt-2">npm run dev</div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Cost Information</h4>
              <p className="text-blue-700 text-sm">
                OpenAI API usage is very affordable for testing - typically costs less than $1 for hundreds of
                interactions. You only pay for what you use.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
