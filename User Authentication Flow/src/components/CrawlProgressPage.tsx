import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner@2.0.3";
import { 
  Activity, 
  MessageCircle, 
  Send, 
  StopCircle,
  CheckCircle,
  Globe 
} from "lucide-react";

interface CrawlProgressPageProps {
  url: string;
  prompt: string;
  onComplete: (crawlId: string) => void;
  onCancel: () => void;
}

interface LogEntry {
  timestamp: string;
  message: string;
  type: "info" | "success" | "error";
}

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

export function CrawlProgressPage({ 
  url, 
  prompt, 
  onComplete, 
  onCancel 
}: CrawlProgressPageProps) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content: "Hi! I'm analyzing the page now. You can ask me questions or request adjustments while I work.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Simulate crawl progress
    const logMessages = [
      "🔗 Connecting to backend API...",
      "🌐 Loading page content from target URL...",
      "🔍 Analyzing page structure with AI...",
      "🤖 Extracting data based on your prompt...",
      "📊 Processing and structuring found items...",
      "✅ Validating extracted data quality...",
      "💾 Saving crawl results to database...",
      "🎉 Finalizing and preparing data for export...",
    ];

    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < logMessages.length) {
        setLogs(prev => [
          ...prev,
          {
            timestamp: new Date().toISOString(),
            message: logMessages[currentLog],
            type: "info",
          },
        ]);
        setProgress((currentLog + 1) * (100 / logMessages.length));
        currentLog++;
      } else {
        setLogs(prev => [
          ...prev,
          {
            timestamp: new Date().toISOString(),
            message: "✨ Crawl completed successfully! Found 47 items.",
            type: "success",
          },
          {
            timestamp: new Date().toISOString(),
            message: "💾 Data saved to database and ready for export.",
            type: "success",
          },
        ]);
        setIsComplete(true);
        clearInterval(interval);
        toast.success("Crawl completed and data saved!");
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: chatInput,
      timestamp: new Date().toISOString(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        role: "ai",
        content: "I understand your request. I'll adjust the extraction accordingly and refine the results.",
        timestamp: new Date().toISOString(),
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleComplete = () => {
    const crawlId = `crawl-${Date.now()}`;
    onComplete(crawlId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Crawl in Progress</h1>
        <p className="text-muted-foreground">
          Real-time monitoring and AI assistance
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              <div>
                <CardTitle className="text-base">Target: {url}</CardTitle>
                <CardDescription className="text-sm">
                  Extracting: {prompt.slice(0, 60)}...
                </CardDescription>
              </div>
            </div>
            {!isComplete && (
              <Button variant="destructive" size="sm" onClick={onCancel}>
                <StopCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
            {isComplete && (
              <Button variant="default" onClick={handleComplete}>
                <CheckCircle className="mr-2 h-4 w-4" />
                View Results
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Live Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className="flex gap-2 text-sm">
                    <span className="text-muted-foreground whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={
                      log.type === "success" ? "text-green-600" :
                      log.type === "error" ? "text-red-600" :
                      "text-foreground"
                    }>
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat with AI
            </CardTitle>
            <CardDescription>
              Ask questions or request refinements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                <div className="space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Ask the AI something..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
