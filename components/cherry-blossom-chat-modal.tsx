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

interface CherryBlossomChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillMessage?: string;
  conversationTitle?: string;
  executiveRole?: string;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
}

export default function CherryBlossomChatModal({
  isOpen,
  onClose,
  prefillMessage,
  conversationTitle,
  executiveRole = 'Cherry Blossom Co-Guide',
  isAuthenticated,
  isLoadingAuth,
}: CherryBlossomChatModalProps) {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prefillRef = useRef<string | undefined>(prefillMessage);
  const titleRef = useRef<string | undefined>(conversationTitle);
  const supabase = createClient();

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, setInput } = useChat({
    api: '/api/chat/cherry-blossom',
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
  }, [messages]);

  const createNewConversation = async () => {
    setIsLoadingConversation(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoadingConversation(false);
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

      setConversationId(newConv.id);
      setMessages([]);

      if (prefillMessage) {
        setInput(prefillMessage);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
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
      }

      setConversationId(convId);

      const { data: existingMessages } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (existingMessages) {
        setMessages(existingMessages.map((msg: any) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
        })));
      }

      if (prefillMessage && existingMessages?.length === 0) {
        setInput(prefillMessage);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setIsLoadingConversation(false);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim() || !conversationId || !isAuthenticated) return;

    await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: input,
    });

    handleSubmit(e);
  };

  const handleClose = () => {
    setMessages([]);
    setInput('');
    setConversationId(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center h-full p-8 space-y-6">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#E26C73] to-[#F9EFE3] flex items-center justify-center">
                <LogIn className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold">Log In to Continue</h3>
              <p className="text-lg text-muted-foreground max-w-md">
                Access your Cherry Blossom Co-Guide conversations and build your personalized work-life balance journey.
              </p>
            </div>
            <Button 
              size="lg"
              className="text-lg px-8"
              onClick={() => window.location.href = '/auth/login'}
              data-testid="button-login"
            >
              <LogIn className="w-5 h-5 mr-2" />
              Log In to Continue
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold">
                    {conversationTitle || 'Cherry Blossom Co-Guide'}
                  </DialogTitle>
                  <DialogDescription className="text-base mt-1">
                    {executiveRole}
                  </DialogDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  data-testid="button-close"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </DialogHeader>

            <ScrollArea className="flex-1 px-6 py-4">
              {isLoadingConversation || isLoadingAuth ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#E26C73] to-[#F9EFE3] flex items-center justify-center">
                        <span className="text-3xl">🌸</span>
                      </div>
                      <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        Welcome! Share your thoughts and let's begin your journey toward work-life harmony.
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-[#5D9D61] text-white'
                              : 'bg-gradient-to-br from-[#F9EFE3] to-muted'
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
                      <div className="bg-gradient-to-br from-[#F9EFE3] to-muted rounded-lg px-4 py-3">
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
                  placeholder="Share your thoughts..."
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
