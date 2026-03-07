import { useState, useRef, useEffect } from "react";
import { Send, Mic, Plus, Search, Copy } from "lucide-react";
import { api } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestions = [
  "What schemes am I eligible for?",
  "Show me education scholarships",
  "Housing schemes for low income",
  "Agriculture subsidies available",
];

export function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
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
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat API error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error connecting to the server.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
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
          <Button className="w-full" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search conversations" className="pl-10" />
          </div>
        </div>

        <ScrollArea className="flex-1 p-2">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start text-left"
              size="sm"
            >
              <div className="flex-1 truncate">
                <p className="truncate font-medium">Scheme Eligibility</p>
                <p className="truncate text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left"
              size="sm"
            >
              <div className="flex-1 truncate">
                <p className="truncate font-medium">Education Schemes</p>
                <p className="truncate text-xs text-muted-foreground">Yesterday</p>
              </div>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-left"
              size="sm"
            >
              <div className="flex-1 truncate">
                <p className="truncate font-medium">Housing Benefits</p>
                <p className="truncate text-xs text-muted-foreground">3 days ago</p>
              </div>
            </Button>
          </div>
        </ScrollArea>
      </aside>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
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
            <div className="max-w-3xl mx-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-[80%] ${message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                      } rounded-lg p-4 space-y-2`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-4">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-background">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-2">
              <div className="flex-1 relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about government schemes..."
                  className="pr-20 min-h-[48px]"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                onClick={handleSend}
                disabled={!input.trim()}
                size="icon"
                className="h-12 w-12"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              AI responses may contain errors. Please verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
