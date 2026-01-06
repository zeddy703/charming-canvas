import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Maximize2, Minimize2, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  attachments?: Attachment[];
}

// Notification sound as base64 (short beep)
const NOTIFICATION_SOUND = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleQsXkMuzhpmA' +
  'fJOxtp6OhIaEqLCrnZ2hoKespaSSgoJ/iJuWkoqJjpqZk5KKgHxvcHyLj4qIipGbl5WSj46WnZiXj4WBeX2KkIyKipSclpSTjYqEgH2CjZKOiomQmZeT' +
  'kIuIg4F9goqNi4mJkJeTko2KhYJ+fYCHi4qIiY+Uk5CLiISDgH5/hYmIh4iNkZCNioeDgX5+gIWIh4eIjZCOjImFg4B+foGFh4aHio2OjIqHhIKAfn+C' +
  'hYaGh4qMjIqIhYOAfn+BhIWFhoiKi4qIhoOBf36AgoSEhYeJioqIhoSCgH9/gYOEhIWHiYmIhoWDgYB/gIKDg4SFh4iIh4WEgoGAf4CCg4OEhYeHh4aF' +
  'hIKBgH+AgoODhIWGh4eGhYSDgoGAgIGCg4OEhYaGhoWEg4KBgICAgoKDg4SFhoaFhYSDgoGAgICBgoKDhIWFhYWEg4OCgYCAgIGCgoOEhIWFhISEg4KB' +
  'gYCAgYGCgoOEhISEhIODgoKBgYCAgYGCgoODhISEg4ODgoKBgYCAgYGBgoKDg4ODg4OCgoKBgYGAgIGBgoKCg4ODg4OCgoKCgYGBgIGBgYKCgoODg4OD' +
  'goKCgYGBgYCBgYGCgoKDg4ODgoKCgoGBgYGAgYGBgoKCg4ODg4KCgoKBgYGBgIGBgYKCgoKDg4OCgoKCgYGBgYGBgYGBgoKCgoKCgoKCgoGBgYGBgYGB' +
  'gYKCgoKCgoKCgoKBgYGBgYGBgYGBgoKCgoKCgoKCgYGBgYGBgYGBgYGCgoKCgoKCgoKBgYGBgYGBgYGBgYKCgoKCgoKCgYGBgYGBgYGBgYGBgYKCgoKC';

const ChatSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can we help you today?',
      sender: 'support',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    audioRef.current = new Audio(NOTIFICATION_SOUND);
    audioRef.current.volume = 0.5;
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      size: file.size,
    }));

    setPendingAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setPendingAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleEmojiSelect = (emoji: any) => {
    setInputValue((prev) => prev + emoji.native);
    setIsEmojiOpen(false);
  };

  const handleSend = () => {
    if (!inputValue.trim() && pendingAttachments.length === 0) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      attachments: pendingAttachments.length > 0 ? [...pendingAttachments] : undefined,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setPendingAttachments([]);

    // Show typing indicator
    setIsTyping(true);

    // Simulate support response
    setTimeout(() => {
      setIsTyping(false);
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: pendingAttachments.length > 0 
          ? 'Thank you for sharing the files. A support representative will review them shortly.'
          : 'Thank you for your message. A support representative will be with you shortly.',
        sender: 'support',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, supportResponse]);
      playNotificationSound();
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all duration-200 flex items-center justify-center"
          aria-label="Open chat support"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-background border border-border shadow-xl flex flex-col overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'inset-0 rounded-none sm:inset-4 sm:rounded-lg'
              : 'bottom-0 right-0 left-0 h-[100dvh] sm:bottom-6 sm:right-6 sm:left-auto sm:w-96 sm:h-[500px] sm:rounded-lg'
          }`}
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">Support Chat</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs">Online</span>
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="hidden sm:flex p-1 hover:bg-primary-foreground/20 rounded transition-colors"
                aria-label={isExpanded ? 'Minimize chat' : 'Expand chat'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
                className="p-1 hover:bg-primary-foreground/20 rounded transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
                    }`}
                  >
                    {message.text && <p>{message.text}</p>}
                    
                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map((attachment) => (
                          <div key={attachment.id} className="rounded overflow-hidden">
                            {attachment.type.startsWith('image/') ? (
                              <img
                                src={attachment.url}
                                alt={attachment.name}
                                className="max-w-full rounded"
                              />
                            ) : (
                              <div className="flex items-center gap-2 bg-background/20 p-2 rounded">
                                <Paperclip className="w-4 h-4 shrink-0" />
                                <span className="truncate text-xs">{attachment.name}</span>
                                <span className="text-xs opacity-70">({formatFileSize(attachment.size)})</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <span className="text-xs opacity-70 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted text-foreground px-4 py-3 rounded-lg">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Pending Attachments Preview */}
          {pendingAttachments.length > 0 && (
            <div className="px-3 py-2 border-t border-border bg-muted/50 flex gap-2 flex-wrap shrink-0">
              {pendingAttachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="relative group bg-background rounded-lg p-2 flex items-center gap-2 text-xs border"
                >
                  {attachment.type.startsWith('image/') ? (
                    <img
                      src={attachment.url}
                      alt={attachment.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <Paperclip className="w-4 h-4" />
                  )}
                  <span className="truncate max-w-[100px]">{attachment.name}</span>
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-border bg-background shrink-0">
            <div className="flex gap-2 items-end">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="shrink-0"
              >
                <Paperclip className="w-4 h-4" />
              </Button>
              
              <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" size="icon" variant="ghost" className="shrink-0">
                    <Smile className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-auto p-0 border-0" 
                  side="top" 
                  align="start"
                  sideOffset={8}
                >
                  <Picker
                    data={data}
                    onEmojiSelect={handleEmojiSelect}
                    theme="light"
                    previewPosition="none"
                    skinTonePosition="none"
                    maxFrequentRows={2}
                  />
                </PopoverContent>
              </Popover>

              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button 
                size="icon" 
                onClick={handleSend} 
                disabled={!inputValue.trim() && pendingAttachments.length === 0}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatSupport;
