import { useState } from "react";
import { Activity, Database, Download, Plus, TrendingUp, Sparkles, Send, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";

interface Crawl {
  id: string;
  url: string;
  status: "completed" | "running" | "failed";
  itemsFound: number;
  date: string;
}

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

interface DashboardPageProps {
  onNavigate: (page: string, crawlId?: string) => void;
  crawls: Crawl[];
  onStartCrawlFromChat: (url: string, prompt: string) => void;
}

export function DashboardPage({ onNavigate, crawls, onStartCrawlFromChat }: DashboardPageProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content: "👋 Hi! I'm your AI crawling assistant. Tell me what data you need to extract and from which website.\n\nI'll automatically:\n✅ Parse your requirements\n✅ Call the backend API to crawl the site\n✅ Extract and structure the data\n✅ Save everything to the database\n\nJust describe what you need! Example: 'Extract product names and prices from https://example.com/shop'",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const stats = {
    totalCrawls: crawls.length,
    storedItems: crawls.reduce((sum, c) => sum + c.itemsFound, 0),
    exportHistory: crawls.filter(c => c.status === "completed").length,
    successRate: crawls.length > 0 
      ? Math.round((crawls.filter(c => c.status === "completed").length / crawls.length) * 100)
      : 0,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "running":
        return <Badge className="bg-blue-500">Running</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const parseUserRequest = (message: string): { url: string; prompt: string } | null => {
    // Extract URL using regex
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    const urlMatch = message.match(urlRegex);
    
    if (!urlMatch) {
      return null;
    }

    const url = urlMatch[0];
    
    // Extract what to crawl (everything that's not the URL)
    let prompt = message.replace(url, "").trim();
    
    // Clean up common phrases to get to the actual extraction intent
    prompt = prompt
      .replace(/^(please|can you|could you|i want to|i need to|extract|get|fetch|scrape|crawl)/gi, "")
      .replace(/(from|on|at)\s*$/gi, "")
      .trim();

    // If no specific prompt, use a generic one
    if (!prompt || prompt.length < 5) {
      prompt = "Extract all relevant data from this page";
    } else {
      // Ensure it starts with "Extract"
      if (!prompt.toLowerCase().startsWith("extract")) {
        prompt = "Extract " + prompt;
      }
    }

    return { url, prompt };
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: chatInput,
      timestamp: new Date().toISOString(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsProcessing(true);

    // Simulate AI processing
    setTimeout(() => {
      const parsedRequest = parseUserRequest(userMessage.content);

      if (!parsedRequest) {
        // AI couldn't find a URL
        const aiMessage: ChatMessage = {
          role: "ai",
          content: "I couldn't find a URL in your request. Please include the full website URL (starting with http:// or https://). For example: 'Extract product data from https://example.com/products'",
          timestamp: new Date().toISOString(),
        };
        setChatMessages(prev => [...prev, aiMessage]);
        setIsProcessing(false);
      } else {
        // AI understood the request
        const aiMessage: ChatMessage = {
          role: "ai",
          content: `Perfect! I understood your request:\n\n🌐 **URL:** ${parsedRequest.url}\n📋 **Task:** ${parsedRequest.prompt}\n\nI'm now:\n1️⃣ Calling the backend crawl API\n2️⃣ Extracting the data you requested\n3️⃣ Saving results to the database\n\nStarting crawl... 🚀`,
          timestamp: new Date().toISOString(),
        };
        setChatMessages(prev => [...prev, aiMessage]);
        
        // Start the crawl after a brief delay
        setTimeout(() => {
          setIsProcessing(false);
          toast.success("Backend crawl initiated!");
          onStartCrawlFromChat(parsedRequest.url, parsedRequest.prompt);
        }, 1500);
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your web crawling activity
          </p>
        </div>
        <Button onClick={() => onNavigate("new-crawl")}>
          <Plus className="mr-2 h-4 w-4" />
          New Crawl
        </Button>
      </div>

      {/* AI Chat Assistant */}
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Crawl Assistant
          </CardTitle>
          <CardDescription>
            Describe what you want to crawl in natural language, and I'll handle the rest
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ScrollArea className="h-[280px] w-full rounded-lg border bg-background p-4">
              <div className="space-y-4">
                {chatMessages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap space-y-2">
                        {msg.content.split('\n').map((line, i) => (
                          <p key={i}>{line}</p>
                        ))}
                      </div>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                placeholder="e.g., 'Extract product names and prices from https://example.com/shop'"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isProcessing}
                className="flex-1"
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-muted-foreground">
                <strong>💡 Quick start templates (click to use):</strong>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setChatInput("Extract product names, prices, and ratings from https://example.com/shop")}
                  disabled={isProcessing}
                  className="text-xs h-auto py-2 px-3 justify-start text-left"
                >
                  <div className="space-y-1">
                    <div>🛍️ E-commerce</div>
                    <div className="text-[10px] text-muted-foreground">Products, prices, ratings</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setChatInput("Get job titles, companies, locations, and salaries from https://jobs.example.com")}
                  disabled={isProcessing}
                  className="text-xs h-auto py-2 px-3 justify-start text-left"
                >
                  <div className="space-y-1">
                    <div>💼 Job Listings</div>
                    <div className="text-[10px] text-muted-foreground">Titles, companies, locations</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setChatInput("Extract article headlines, authors, and dates from https://news.example.com")}
                  disabled={isProcessing}
                  className="text-xs h-auto py-2 px-3 justify-start text-left"
                >
                  <div className="space-y-1">
                    <div>📰 News Articles</div>
                    <div className="text-[10px] text-muted-foreground">Headlines, authors, dates</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Crawls</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalCrawls}</div>
            <p className="text-xs text-muted-foreground">
              All time crawling tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Stored Items</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.storedItems.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Data points extracted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Export History</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.exportHistory}</div>
            <p className="text-xs text-muted-foreground">
              Successful exports
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Completion rate
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Crawls</CardTitle>
          <CardDescription>
            Your latest web crawling activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {crawls.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3>No crawls yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first crawl
              </p>
              <Button onClick={() => onNavigate("new-crawl")}>
                <Plus className="mr-2 h-4 w-4" />
                Create Crawl
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {crawls.slice(0, 10).map((crawl) => (
                  <TableRow key={crawl.id}>
                    <TableCell className="max-w-xs truncate">
                      {crawl.url}
                    </TableCell>
                    <TableCell>{getStatusBadge(crawl.status)}</TableCell>
                    <TableCell>{crawl.itemsFound}</TableCell>
                    <TableCell>{new Date(crawl.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onNavigate("crawl-detail", crawl.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

