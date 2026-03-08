import { useState, useRef, useEffect } from "react";
import { Send, Mic, Plus, Search, Copy, MessageSquare } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { api } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: Date;
}

const suggestions = [
  "What schemes am I eligible for?",
  "Show me education scholarships",
  "Housing schemes for low income",
  "Agriculture subsidies available",
];

export function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Active session helper
  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startNewChat = () => {
    const newSessionId = Date.now().toString();
    const newSession: ChatSession = {
      id: newSessionId,
      title: "New Chat",
      messages: [],
      timestamp: new Date(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSessionId);
    setInput("");
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    let currentSessionId = activeSessionId;
    let currentSessions = [...sessions];

    // If no active session or active session is empty, this might be the first message
    if (!currentSessionId) {
      currentSessionId = Date.now().toString();
      const newSession: ChatSession = {
        id: currentSessionId,
        title: input.length > 30 ? input.substring(0, 30) + "..." : input,
        messages: [],
        timestamp: new Date(),
      };
      currentSessions = [newSession, ...sessions];
      setSessions(currentSessions);
      setActiveSessionId(currentSessionId);
    } else {
      // Update title if it's the first message in a "New Chat"
      const sessionIndex = currentSessions.findIndex(s => s.id === currentSessionId);
      if (sessionIndex !== -1 && currentSessions[sessionIndex].messages.length === 0) {
        currentSessions[sessionIndex].title = input.length > 30 ? input.substring(0, 30) + "..." : input;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    // Add user message to state
    setSessions(prev => 
      prev.map(s => s.id === currentSessionId 
        ? { ...s, messages: [...s.messages, userMessage] } 
        : s
      )
    );
    
    setInput("");
    setIsTyping(true);

    try {
      const result = await api.chat(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.response,
        timestamp: new Date(),
      };
      
      setSessions(prev => 
        prev.map(s => s.id === currentSessionId 
          ? { ...s, messages: [...s.messages, assistantMessage] } 
          : s
        )
      );
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error connecting to the server.",
        timestamp: new Date(),
      };
      setSessions(prev => 
        prev.map(s => s.id === currentSessionId 
          ? { ...s, messages: [...s.messages, errorMessage] } 
          : s
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]">
      {/* Chat History Sidebar - Desktop Only */}
      <aside className="hidden lg:flex lg:w-64 flex-col border-r border-border bg-muted/30">
        <div className="p-4 border-b border-border">
          <Button className="w-full" size="sm" onClick={startNewChat}>
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search conversations" className="pl-10 h-9" />
          </div>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            {sessions.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground italic">
                No active chats
              </div>
            ) : (
              sessions.map((session) => (
                <Button
                  key={session.id}
                  variant={activeSessionId === session.id ? "secondary" : "ghost"}
                  className="w-full justify-start text-left h-auto py-3 px-3"
                  size="sm"
                  onClick={() => setActiveSessionId(session.id)}
                >
                  <div className="flex items-start gap-3 overflow-hidden">
                    <MessageSquare className="h-4 w-4 mt-0.5 shrink-0" />
                    <div className="flex-1 truncate">
                      <p className="truncate font-medium text-sm">{session.title}</p>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {session.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
      </aside>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col relative">
        {messages.length === 0 ? (
          // Welcome Screen
          <div className="flex flex-1 flex-col items-center justify-center p-6">
            <div className="max-w-2xl text-center space-y-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">AI-Powered Scheme Assistant</h1>
                <p className="text-muted-foreground">
                  Ask me anything about government schemes, eligibility, benefits, and applications
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="h-auto p-4 text-left justify-start"
                    onClick={() => handleSuggestion(suggestion)}
                  >
                    <span className="text-sm">{suggestion}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Messages
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="max-w-3xl mx-auto space-y-6 pb-12">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[85%] ${message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted shadow-sm"
                      } rounded-2xl px-5 py-4 space-y-2`}
                  >
                    <div className={`text-sm leading-relaxed ${message.role === 'assistant' ? 'prose prose-sm dark:prose-invert max-w-none' : ''}`}>
                      {message.role === "assistant" ? (
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      ) : (
                        message.content
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-4 mt-1">
                      <span className="text-[10px] opacity-60">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {message.role === "assistant" && (
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-5 py-4">
                    <div className="flex gap-1.5 py-1">
                      <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-duration:0.8s]" />
                      <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {/* Input Area */}
        <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border">
          <div className="max-w-3xl mx-auto relative">
            <div className="flex items-end gap-2 bg-muted/50 rounded-2xl p-2 border border-border focus-within:border-primary/50 transition-colors">
              <div className="flex-1">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about government schemes..."
                  className="bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[44px] py-1 shadow-none"
                />
              </div>
              <div className="flex items-center gap-1 pr-1 pb-1">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  size="icon"
                  className="h-9 w-9 rounded-xl shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-3">
              AI responses are for information only. Please verify important details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
