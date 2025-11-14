import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner@2.0.3";
import { Globe, ArrowRight } from "lucide-react";

interface NewCrawlStep1Props {
  onNext: (url: string) => void;
  onBack: () => void;
}

export function NewCrawlStep1({ onNext, onBack }: NewCrawlStep1Props) {
  const [url, setUrl] = useState("");

  const validateUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    if (!validateUrl(url)) {
      toast.error("Please enter a valid URL");
      return;
    }

    onNext(url);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1>New Crawl - Step 1</h1>
        <p className="text-muted-foreground">
          Enter the URL you want to crawl
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Target URL
          </CardTitle>
          <CardDescription>
            Enter the website URL you want to extract data from
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="text-lg"
              />
              <p className="text-sm text-muted-foreground">
                Make sure the URL includes the protocol (http:// or https://)
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="text-sm">Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Use the exact page URL you want to crawl</li>
                <li>Ensure the website is publicly accessible</li>
                <li>Check that the site allows web scraping (robots.txt)</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onBack}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
