import "server-only"
import { createOpenAI } from "@ai-sdk/openai"
import { getVercelOidcToken } from "@vercel/oidc"

// The installed AI SDK (3.x) predates the native Gateway provider, so we reach
// Vercel AI Gateway through its OpenAI-compatible endpoint.
export const AI_GATEWAY_BASE_URL = "https://ai-gateway.vercel.sh/v1"

export async function getAiGatewayToken(): Promise<string> {
  return process.env.AI_GATEWAY_API_KEY || (await getVercelOidcToken())
}

export async function getGatewayOpenAI() {
  return createOpenAI({ baseURL: AI_GATEWAY_BASE_URL, apiKey: await getAiGatewayToken() })
}
