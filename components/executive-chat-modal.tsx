"use client"

import { useState, useEffect, useRef } from 'react';
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
import { Send, Loader2, X, LogIn } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ExecutiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  executiveId: string;
  executiveName: string;
  executiveRole: string;
  executiveIcon: string;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
}

export function ExecutiveChatModal({
  isOpen,
  onClose,
  executiveId,
  executiveName,
  executiveRole,
  executiveIcon,
  isAuthenticated,
  isLoadingAuth,
}: ExecutiveChatModalProps) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: '/api/chat/executive',
    body: {
      conversationId,
      executiveRole,
    },
    onFinish: async (message) => {
      if (conversationId && isAuthenticated) {
        await supabase.from('messages').insert({
          conversation_id: conversationId,
          role: 'assistant',
          content: message.content,
        });
      }
    },
  });

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadOrCreateConversation();
    }
  }, [isOpen, isAuthenticated, executiveRole]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
            title: `Chat with ${executiveName}`,
            executive_role: executiveRole,
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
    
    if (!conversationId || !input.trim() || !isAuthenticated) return;

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
    window.location.href = '/api/auth/login';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[600px] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{executiveIcon}</span>
              <div>
                <DialogTitle className="text-2xl">{executiveName}</DialogTitle>
                <DialogDescription className="text-lg mt-1">
                  {executiveRole}
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-modal"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        {!isAuthenticated && !isLoadingAuth ? (
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center max-w-md space-y-6">
              <div className="text-6xl mb-4">{executiveIcon}</div>
              <h3 className="text-2xl font-semibold">Login Required</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Sign in to start your personalized coaching journey with {executiveName}.
                Your conversations will be saved securely for your return.
              </p>
              <Button
                size="lg"
                onClick={handleLogin}
                className="text-lg px-8"
                data-testid="button-login"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Log In to Continue
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              {isLoadingConversation || isLoadingAuth ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                      <p className="text-xl mb-2">Start a conversation with {executiveName}</p>
                      <p className="text-lg">Ask for guidance, delegate tasks, or request deliverables.</p>
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
                              ? 'bg-gradient-to-r from-[#5D9D61] to-[#E26C73] text-white'
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
                  placeholder={`Message ${executiveName}...`}
                  disabled={isLoading || isLoadingConversation || isLoadingAuth}
                  className="flex-1 text-lg"
                  data-testid="input-message"
                />
                <Button
                  type="submit"
                  disabled={isLoading || isLoadingConversation || isLoadingAuth || !input.trim()}
                  size="lg"
                  data-testid="button-send"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </form>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
