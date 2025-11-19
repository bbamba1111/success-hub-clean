"use client"

import { useState, useEffect, useRef } from 'ai/react';
import { useChat } from '@ai-sdk/react';
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
import { Send, Loader2, X, LogIn, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface CoPilotChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CoPilotChatModal({
  isOpen,
  onClose,
}: CoPilotChatModalProps) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat/co-pilot',
    body: {
      conversationId,
    },
    onFinish: async (message) => {
      if (conversationId) {
        await supabase.from('messages').insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: message.content,
        });
      }
    },
  });

  useEffect(() => {
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadOrCreateConversation();
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        .eq('executive_role', 'Co-Pilot Master Coach')
        .order('updated_at', { ascending: false })
        .limit(1);

      let convId: string;

      if (existingConversations && existingConversations.length > 0) {
        convId = existingConversations[0].id;
      } else {
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({
            user_id: user.id,
            title: 'Co-Pilot Master Coach',
            executive_role: 'Co-Pilot Master Coach',
          })
          .select()
          .single();

        convId = newConv.id;
      }

      setConversationId(convId);

      const { data: existingMessages } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (existingMessages && existingMessages.length > 0) {
        const formattedMessages = existingMessages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setIsLoadingConversation(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!conversationId || !input.trim()) return;

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

    handleSubmit(e);
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
            <div className="flex items-center gap-3 mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Co-Pilot Master Coach</DialogTitle>
                <DialogDescription className="text-lg mt-1">
                  Strategic AI Orchestrator with Complete Team Memory
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="text-center py-12">
            <LogIn className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h3 className="text-2xl font-bold mb-4">Login Required</h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Sign in to access your Co-Pilot Master Coach. I'll synthesize insights from all your AI executive conversations and provide strategic guidance.
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
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gradient-to-r from-primary/10 to-accent/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent shadow-lg">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-2xl">Co-Pilot Master Coach</DialogTitle>
                <DialogDescription className="text-lg mt-1">
                  Strategic AI Orchestrator with Complete Team Memory
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-copilot"
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
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-12">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <p className="text-xl mb-2">Your Strategic Command Center</p>
                  <p className="text-lg max-w-md mx-auto">
                    I have complete access to all your conversations across all 25 AI executives. 
                    Ask me to synthesize insights, identify patterns, or provide strategic guidance.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
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
                ))
              )}
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
              onChange={handleInputChange}
              placeholder="Ask Co-Pilot for strategic guidance..."
              disabled={isLoading || isLoadingConversation}
              className="flex-1 text-lg"
              data-testid="input-copilot-message"
            />
            <Button
              type="submit"
              disabled={isLoading || isLoadingConversation || !input.trim()}
              size="lg"
              data-testid="button-copilot-send"
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
