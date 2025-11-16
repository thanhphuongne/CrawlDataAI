import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { 
  Download, 
  Search, 
  MessageCircle, 
  Clock,
  Database,
  Send,
  FileJson,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { requestAPI, dataAPI, dialogAPI } from '../utils/api';
import { toast } from "sonner";

interface CrawlData {
  id: string;
  name: string;
  price: string;
  rating: string;
  availability: string;
}

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

interface CrawlDetailPageProps {
  crawlId: string;
  onNavigate: (page: string) => void;
  onExport: (format: string, crawlId: string) => void;
}

export function CrawlDetailPage({ crawlId, onNavigate, onExport }: CrawlDetailPageProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [crawlData, setCrawlData] = useState<any[]>([]);
  const [crawlInfo, setCrawlInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrawlDetails = async () => {
      try {
        // Fetch crawl request details
        const requestResponse = await requestAPI.getRequest(crawlId);
        const request = requestResponse.data;
        
        setCrawlInfo({
          url: request.requirement.includes('from') ? request.requirement.split('from')[1].trim() : request.requirement,
          duration: "2m 34s", // Mock for now
          itemsFound: request.items_found || 0,
          date: request.created_at,
          status: request.status,
        });

        // Fetch crawled data
        const dataResponse = await dataAPI.getCrawledData(parseInt(crawlId));
        setCrawlData(dataResponse.data.data || []);

        // Fetch dialog messages
        const dialogResponse = await dialogAPI.getMessages(1, { request_id: crawlId }); // Assuming user_id = 1
        const messages = dialogResponse.data.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp || new Date().toISOString(),
        }));
        setCrawlData(messages);

      } catch (error) {
        console.error('Failed to fetch crawl details:', error);
        toast.error('Failed to load crawl details');
      } finally {
        setLoading(false);
      }
    };

    if (crawlId) {
      fetchCrawlDetails();
    }
  }, [crawlId]);

  const filteredData = mockData.filter(item =>
    Object.values(item).some(val =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
        content: "Based on the crawled data, I found that the average price is $55.23, with 68% of items in stock. The highest-rated items tend to be priced between $45-75.",
        timestamp: new Date().toISOString(),
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Crawl Details</h1>
          <p className="text-muted-foreground">{crawlInfo.url}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onExport("json", crawlId)}>
              <FileJson className="mr-2 h-4 w-4" />
              Export as JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("csv", crawlId)}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExport("pdf", crawlId)}>
              <FileText className="mr-2 h-4 w-4" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{crawlInfo.duration}</div>
            <p className="text-xs text-muted-foreground">
              {new Date(crawlInfo.date).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Items Found</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{crawlInfo.itemsFound}</div>
            <p className="text-xs text-muted-foreground">
              Data points extracted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Status</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className="bg-green-500">Completed</Badge>
            <p className="text-xs text-muted-foreground mt-2">
              Ready to export
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="data" className="space-y-4">
        <TabsList>
          <TabsTrigger value="data">Data Table</TabsTrigger>
          <TabsTrigger value="json">Raw JSON</TabsTrigger>
          <TabsTrigger value="chat">Chat History</TabsTrigger>
        </TabsList>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Extracted Data</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search..."
                      className="pl-8 w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Availability</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.price}</TableCell>
                      <TableCell>{item.rating}</TableCell>
                      <TableCell>
                        <Badge
                          variant={item.availability === "In Stock" ? "default" : "secondary"}
                        >
                          {item.availability}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle>Raw JSON Data</CardTitle>
              <CardDescription>
                Complete JSON representation of crawled data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] w-full rounded-md border">
                <pre className="p-4 text-sm">
                  {JSON.stringify(mockData, null, 2)}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle>AI Chat History</CardTitle>
              <CardDescription>
                Conversation during the crawl process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
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
                    placeholder="Ask about the data..."
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
