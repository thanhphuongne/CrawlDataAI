import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Download, FileJson, FileSpreadsheet, FileText, Sparkles, Copy, Check } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { toast } from "sonner@2.0.3";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
  crawlData?: {
    url: string;
    status: "pending" | "crawling" | "completed" | "failed";
    progress?: number;
    itemsFound?: number;
    data?: any[];
    prompt?: string;
    crawlId?: string;
  };
}

interface ChatPageProps {
  onNavigate: (page: string, crawlId?: string) => void;
  onStartCrawl: (url: string, prompt: string) => string; // Returns crawl ID
}

export function ChatPage({ onNavigate, onStartCrawl }: ChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "ai",
      content: "👋 Hi! I'm your AI-powered web crawling assistant.\n\nTell me what data you need and from which website, and I'll:\n\n✅ Understand your requirements\n✅ Crawl the website automatically\n✅ Extract and structure the data\n✅ Deliver it in your preferred format (JSON, CSV, or PDF)\n\nJust describe what you need in plain English!",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const parseUserRequest = (message: string): { url: string; prompt: string } | null => {
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const urlMatch = message.match(urlRegex);
    
    if (!urlMatch) {
      return null;
    }

    const url = urlMatch[0];
    let prompt = message.replace(url, "").trim();
    
    prompt = prompt
      .replace(/^(please|can you|could you|i want to|i need to|extract|get|fetch|scrape|crawl)/gi, "")
      .replace(/(from|on|at)\s*$/gi, "")
      .trim();

    if (!prompt || prompt.length < 5) {
      prompt = "Extract all relevant data from this page";
    } else {
      if (!prompt.toLowerCase().startsWith("extract")) {
        prompt = "Extract " + prompt;
      }
    }

    return { url, prompt };
  };

  const generateMockData = (prompt: string) => {
    const promptLower = prompt.toLowerCase();
    
    if (promptLower.includes("product") || promptLower.includes("shop") || promptLower.includes("ecommerce")) {
      return [
        { name: "Wireless Headphones", price: "$99.99", rating: "4.5/5", inStock: true },
        { name: "Smart Watch Pro", price: "$299.99", rating: "4.7/5", inStock: true },
        { name: "Laptop Stand", price: "$49.99", rating: "4.3/5", inStock: false },
        { name: "USB-C Hub", price: "$34.99", rating: "4.6/5", inStock: true },
        { name: "Mechanical Keyboard", price: "$129.99", rating: "4.8/5", inStock: true },
      ];
    } else if (promptLower.includes("job") || promptLower.includes("career")) {
      return [
        { title: "Senior Software Engineer", company: "Tech Corp", location: "San Francisco, CA", salary: "$150k-$200k" },
        { title: "Product Manager", company: "Innovation Inc", location: "Remote", salary: "$120k-$160k" },
        { title: "Data Scientist", company: "AI Solutions", location: "New York, NY", salary: "$130k-$180k" },
        { title: "UX Designer", company: "Design Studio", location: "Austin, TX", salary: "$90k-$130k" },
      ];
    } else if (promptLower.includes("article") || promptLower.includes("news")) {
      return [
        { headline: "Breaking: New AI Technology Advances", author: "John Smith", date: "2025-11-14", category: "Technology" },
        { headline: "Market Analysis: Tech Stocks Rise", author: "Jane Doe", date: "2025-11-13", category: "Finance" },
        { headline: "Climate Summit Reaches Agreement", author: "Bob Johnson", date: "2025-11-12", category: "Environment" },
      ];
    } else {
      return [
        { item: "Data Item 1", value: "Value A", status: "Active" },
        { item: "Data Item 2", value: "Value B", status: "Active" },
        { item: "Data Item 3", value: "Value C", status: "Pending" },
        { item: "Data Item 4", value: "Value D", status: "Active" },
      ];
    }
  };

  const simulateCrawl = async (messageId: string, url: string, prompt: string) => {
    const crawlId = onStartCrawl(url, prompt);

    // Update to crawling status
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId && msg.crawlData
          ? { ...msg, crawlData: { ...msg.crawlData, status: "crawling", progress: 20 } }
          : msg
      ));
    }, 500);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId && msg.crawlData
          ? { ...msg, crawlData: { ...msg.crawlData, progress: 50 } }
          : msg
      ));
    }, 1500);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === messageId && msg.crawlData
          ? { ...msg, crawlData: { ...msg.crawlData, progress: 80 } }
          : msg
      ));
    }, 2500);

    // Complete the crawl
    setTimeout(() => {
      const mockData = generateMockData(prompt);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId && msg.crawlData
          ? { 
              ...msg, 
              crawlData: { 
                ...msg.crawlData, 
                status: "completed", 
                progress: 100,
                itemsFound: mockData.length,
                data: mockData,
                crawlId: crawlId
              } 
            }
          : msg
      ));
      toast.success("Crawl completed successfully!");
    }, 3500);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsProcessing(true);

    setTimeout(() => {
      const parsedRequest = parseUserRequest(userMessage.content);

      if (!parsedRequest) {
        const aiMessage: ChatMessage = {
          id: Date.now().toString(),
          role: "ai",
          content: "I couldn't find a valid URL in your request. Please include the full website URL (starting with http:// or https://).\n\n**Example formats:**\n• \"Extract product names and prices from https://example.com/shop\"\n• \"Get job listings from https://careers.example.com\"\n• \"Scrape article data from https://blog.example.com\"",
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsProcessing(false);
      } else {
        const aiMessageId = Date.now().toString();
        const aiMessage: ChatMessage = {
          id: aiMessageId,
          role: "ai",
          content: `Perfect! I'll help you with that.\n\n**Target URL:** ${parsedRequest.url}\n**Task:** ${parsedRequest.prompt}\n\nStarting the crawl now...`,
          timestamp: new Date().toISOString(),
          crawlData: {
            url: parsedRequest.url,
            status: "pending",
            prompt: parsedRequest.prompt,
          },
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsProcessing(false);

        // Start the crawl simulation
        simulateCrawl(aiMessageId, parsedRequest.url, parsedRequest.prompt);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExport = (format: "json" | "csv" | "pdf", data: any[]) => {
    toast.success(`Exporting data as ${format.toUpperCase()}...`);
    // In production, this would trigger actual export logic
  };

  const handleCopyData = (data: any[], messageId: string) => {
    const jsonString = JSON.stringify(data, null, 2);
    navigator.clipboard.writeText(jsonString);
    setCopiedId(messageId);
    toast.success("Data copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderCrawlData = (msg: ChatMessage) => {
    if (!msg.crawlData) return null;

    const { status, progress, itemsFound, data, url, crawlId } = msg.crawlData;

    return (
      <Card className="mt-3 p-4 bg-background border-2">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {status === "pending" && <Badge variant="secondary">Initializing...</Badge>}
              {status === "crawling" && <Badge className="bg-blue-500">Crawling</Badge>}
              {status === "completed" && <Badge className="bg-green-500">Completed</Badge>}
              {status === "failed" && <Badge variant="destructive">Failed</Badge>}
            </div>
            {itemsFound !== undefined && (
              <span className="text-sm text-muted-foreground">{itemsFound} items found</span>
            )}
          </div>

          {(status === "crawling" || (status === "completed" && progress)) && (
            <div className="space-y-1">
              <Progress value={progress || 0} className="h-2" />
              <p className="text-xs text-muted-foreground">Processing: {progress}%</p>
            </div>
          )}

          {status === "completed" && data && (
            <>
              <div className="max-h-[300px] overflow-auto rounded border bg-muted/30 p-3">
                <pre className="text-xs">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopyData(data, msg.id)}
                >
                  {copiedId === msg.id ? (
                    <Check className="h-3 w-3 mr-1" />
                  ) : (
                    <Copy className="h-3 w-3 mr-1" />
                  )}
                  Copy JSON
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => handleExport("json", data)}>
                      <FileJson className="h-4 w-4 mr-2" />
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("csv", data)}>
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExport("pdf", data)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {crawlId && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onNavigate("crawl-detail", crawlId)}
                  >
                    View Details
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </Card>
    );
  };

  const suggestionPrompts = [
    {
      icon: "🛍️",
      title: "E-commerce Products",
      prompt: "Extract product names, prices, and ratings from https://example.com/shop",
    },
    {
      icon: "💼",
      title: "Job Listings",
      prompt: "Get job titles, companies, locations, and salaries from https://jobs.example.com",
    },
    {
      icon: "📰",
      title: "News Articles",
      prompt: "Extract article headlines, authors, and publication dates from https://news.example.com",
    },
    {
      icon: "🏠",
      title: "Real Estate",
      prompt: "Scrape property listings with prices, locations, and features from https://realestate.example.com",
    },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h1 className="text-xl">AI Crawl Assistant</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Describe your data needs and let AI handle the crawling
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-4 ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="space-y-2">
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className="text-sm">
                      {line.startsWith('**') && line.endsWith('**') ? (
                        <strong>{line.slice(2, -2)}</strong>
                      ) : line.startsWith('•') ? (
                        <span className="block ml-2">{line}</span>
                      ) : (
                        line
                      )}
                    </p>
                  ))}
                </div>
                <p className="text-xs opacity-70 mt-2">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
                {msg.role === "ai" && renderCrawlData(msg)}
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI is analyzing your request...</span>
                </div>
              </div>
            </div>
          )}

          {/* Suggestions (show when chat is empty) */}
          {messages.length === 1 && (
            <div className="mt-8 space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                Try one of these examples to get started:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestionPrompts.map((suggestion, index) => (
                  <Card
                    key={index}
                    className="p-4 cursor-pointer hover:border-primary transition-colors"
                    onClick={() => setInput(suggestion.prompt)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{suggestion.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-sm mb-1">{suggestion.title}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {suggestion.prompt}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              placeholder="Describe what data you want to crawl... (include the URL)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isProcessing}
              className="flex-1"
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              disabled={!input.trim() || isProcessing}
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Include the URL in your message. Press Enter to send.
          </p>
        </div>
      </div>
    </div>
  );
}
