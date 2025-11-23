"use client"

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Send, Loader2, X, LogIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface CherryBlossomChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillMessage?: string;
  conversationTitle?: string;
  executiveRole?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function CherryBlossomChatModal({
  isOpen,
  onClose,
  prefillMessage,
  conversationTitle,
  executiveRole = '4-Hour Focused CEO Workday Guide',
}: CherryBlossomChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prefillRef = useRef<string | undefined>(prefillMessage);
  const titleRef = useRef<string | undefined>(conversationTitle);
  const supabase = createClient();

  useEffect(() => {
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  useEffect(() => {
    const prefillChanged = prefillMessage !== prefillRef.current;
    const titleChanged = conversationTitle !== titleRef.current;

    if (isOpen && isAuthenticated && (prefillChanged || titleChanged)) {
      prefillRef.current = prefillMessage;
      titleRef.current = conversationTitle;
      createNewConversation();
    } else if (isOpen && isAuthenticated) {
      loadOrCreateConversation();
    }
  }, [isOpen, isAuthenticated, prefillMessage, conversationTitle, executiveRole]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const checkAuth = async () => {
    setIsCheckingAuth(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const createNewConversation = async () => {
    setIsLoadingConversation(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoadingConversation(false);
        if (prefillMessage) {
          setInput(prefillMessage);
        }
        return;
      }

      const { data: newConv } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: conversationTitle || 'Cherry Blossom Chat',
          executive_role: executiveRole,
        })
        .select()
        .single();

      const convId = newConv.id;
      setConversationId(convId);
      setMessages([]);

      if (prefillMessage) {
        setInput(prefillMessage);
      }

      // Send welcome message for new conversations
      sendWelcomeMessage(convId);
    } catch (error) {
      console.error('Error creating conversation:', error);
      setIsLoadingConversation(false);
    }
  };

  const loadOrCreateConversation = async () => {
    setIsLoadingConversation(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoadingConversation(false);
        return;
      }

      const { data: existingConversations } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .eq('executive_role', executiveRole)
        .eq('title', conversationTitle || 'Cherry Blossom Chat')
        .order('updated_at', { ascending: false })
        .limit(1);

      let convId: string;
      let isNewConversation = false;

      if (existingConversations && existingConversations.length > 0) {
        convId = existingConversations[0].id;
      } else {
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({
            user_id: user.id,
            title: conversationTitle || 'Cherry Blossom Chat',
            executive_role: executiveRole,
          })
          .select()
          .single();

        convId = newConv.id;
        isNewConversation = true;
      }

      setConversationId(convId);

      const { data: existingMessages } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (existingMessages && existingMessages.length > 0) {
        const formattedMessages = existingMessages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        }));
        setMessages(formattedMessages);
        setIsLoadingConversation(false);
      } else if (isNewConversation) {
        // Send welcome message for new conversations
        if (prefillMessage) {
          setInput(prefillMessage);
        }
        sendWelcomeMessage(convId);
      } else {
        if (prefillMessage) {
          setInput(prefillMessage);
        }
        setIsLoadingConversation(false);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      setIsLoadingConversation(false);
    }
  };

  const sendWelcomeMessage = async (convId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chat/cherry-blossom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          executiveRole,
          isWelcome: true,
        }),
      });

      const data = await response.json();
      
      if (data.message) {
        const welcomeMessage: Message = { role: "assistant", content: data.message };
        setMessages([welcomeMessage]);

        // Save welcome message to Supabase
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from('messages').insert({
            conversation_id: convId,
            role: 'assistant',
            content: data.message,
          });
        }
      }
    } catch (error) {
      console.error("[Cherry Blossom] Welcome message error:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingConversation(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !conversationId) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('messages').insert({
          conversation_id: conversationId,
          role: 'user',
          content: input,
        });

        await supabase
          .from('conversations')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', conversationId);
      }

      const response = await fetch("/api/chat/cherry-blossom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          executiveRole,
          isWelcome: false,
        }),
      });

      console.log("[Cherry Blossom] Response status:", response.status);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("[Cherry Blossom] Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }

      const data = await response.json();
      console.log("[Cherry Blossom] Response data:", data);

      if (data.message) {
        const assistantMessage: Message = { role: "assistant", content: data.message };
        setMessages((prev) => [...prev, assistantMessage]);

        if (user) {
          await supabase.from('messages').insert({
            conversation_id: conversationId,
            role: 'assistant',
            content: data.message,
          });
        }
      } else if (data.error) {
        console.error("[Cherry Blossom] API error:", data.error);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: `Error: ${data.error}` },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I couldn't process that request." },
        ]);
      }
    } catch (error) {
      console.error("[Cherry Blossom] Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, there was an error." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage();
  };

  const handleLogin = () => {
    window.location.href = '/auth/login';
  };

  if (isCheckingAuth) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl h-[600px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </DialogContent>
      </Dialog>
    );
  }

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">4-Hour Focused CEO Workday Guide</DialogTitle>
            <DialogDescription className="text-lg mt-1">
              Work-Life Balance & Lifestyle Design
            </DialogDescription>
          </DialogHeader>

          <div className="text-center py-12">
            <LogIn className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h3 className="text-2xl font-bold mb-4">Log In to Continue</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Access your 4-Hour Focused CEO Workday Guide conversations and build your personalized work-life balance journey.
            </p>
            <Button size="lg" onClick={handleLogin} className="text-lg px-8">
              <LogIn className="w-5 h-5 mr-2" />
              Log In to Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">4-Hour Focused CEO Workday Guide</DialogTitle>
              <DialogDescription className="text-lg mt-1">
                {conversationTitle || 'Work-Life Balance & Lifestyle Design'}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-cherry"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          {isLoadingConversation ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-lg leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        <div className="px-6 py-4 border-t">
          <form onSubmit={onSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message Cherry Blossom..."
              disabled={isLoading || isLoadingConversation}
              className="flex-1 text-lg"
              data-testid="input-cherry-message"
            />
            <Button
              type="submit"
              disabled={isLoading || isLoadingConversation || !input.trim()}
              size="lg"
              data-testid="button-cherry-send"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

