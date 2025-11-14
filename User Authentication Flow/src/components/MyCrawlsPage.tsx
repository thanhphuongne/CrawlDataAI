import { Activity, Download, Search } from "lucide-react";
import { useState } from "react";
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

interface Crawl {
  id: string;
  url: string;
  status: "completed" | "running" | "failed";
  itemsFound: number;
  date: string;
  prompt?: string;
}

interface MyCrawlsPageProps {
  onNavigate: (page: string, crawlId?: string) => void;
  crawls: Crawl[];
}

export function MyCrawlsPage({ onNavigate, crawls }: MyCrawlsPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCrawls = crawls.filter(crawl => 
    crawl.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    crawl.prompt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const stats = {
    total: crawls.length,
    completed: crawls.filter(c => c.status === "completed").length,
    running: crawls.filter(c => c.status === "running").length,
    totalItems: crawls.reduce((sum, c) => sum + c.itemsFound, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>My Crawls</h1>
        <p className="text-muted-foreground">
          View and manage all your web crawling tasks
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Crawls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Running</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.running}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{stats.totalItems}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Crawl History</CardTitle>
          <CardDescription>
            All your crawling activities and results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by URL or task description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {filteredCrawls.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3>No crawls found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try a different search term" : "Start chatting with AI to create your first crawl"}
                </p>
                <Button onClick={() => onNavigate("chat")}>
                  Go to Chat
                </Button>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead>Task</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCrawls.map((crawl) => (
                      <TableRow key={crawl.id}>
                        <TableCell className="max-w-xs truncate">
                          {crawl.url}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {crawl.prompt || "N/A"}
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
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
