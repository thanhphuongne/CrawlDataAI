import { Download, FileJson, FileSpreadsheet, FileText } from "lucide-react";
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
import { toast } from "sonner@2.0.3";

interface Export {
  id: string;
  crawlName: string;
  format: "json" | "csv" | "pdf";
  date: string;
  size: string;
}

interface ExportsPageProps {
  exports: Export[];
}

export function ExportsPage({ exports }: ExportsPageProps) {
  const handleDownload = (exportItem: Export) => {
    toast.success(`Downloading ${exportItem.crawlName}.${exportItem.format}`);
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "json":
        return <FileJson className="h-4 w-4" />;
      case "csv":
        return <FileSpreadsheet className="h-4 w-4" />;
      case "pdf":
        return <FileText className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const getFormatBadge = (format: string) => {
    const colors = {
      json: "bg-blue-500",
      csv: "bg-green-500",
      pdf: "bg-red-500",
    };
    return (
      <Badge className={colors[format as keyof typeof colors] || ""}>
        {format.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Export History</h1>
        <p className="text-muted-foreground">
          Track and re-download your exported data
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Exports</CardTitle>
          <CardDescription>
            {exports.length} export{exports.length !== 1 ? "s" : ""} available
          </CardDescription>
        </CardHeader>
        <CardContent>
          {exports.length === 0 ? (
            <div className="text-center py-12">
              <Download className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3>No exports yet</h3>
              <p className="text-muted-foreground">
                Complete a crawl and export the data to see it here
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crawl Name</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exports.map((exportItem) => (
                  <TableRow key={exportItem.id}>
                    <TableCell className="max-w-xs truncate">
                      {exportItem.crawlName}
                    </TableCell>
                    <TableCell>{getFormatBadge(exportItem.format)}</TableCell>
                    <TableCell>
                      {new Date(exportItem.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{exportItem.size}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(exportItem)}
                      >
                        {getFormatIcon(exportItem.format)}
                        <span className="ml-2">Download</span>
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
