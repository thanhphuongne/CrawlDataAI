import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, Play } from "lucide-react";

interface NewCrawlStep2Props {
  url: string;
  onStart: (prompt: string) => void;
  onBack: () => void;
}

const PRESET_TEMPLATES = {
  ecommerce: "Extract product name, price, description, rating, and availability status from all products on this page.",
  news: "Extract article title, author, publication date, article body, and category from all articles.",
  jobs: "Extract job title, company name, location, salary range, job description, and application deadline.",
  custom: "",
};

export function NewCrawlStep2({ url, onStart, onBack }: NewCrawlStep2Props) {
  const [prompt, setPrompt] = useState("");
  const [template, setTemplate] = useState<string>("");

  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    if (value !== "custom") {
      setPrompt(PRESET_TEMPLATES[value as keyof typeof PRESET_TEMPLATES]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error("Please enter a prompt or select a template");
      return;
    }

    onStart(prompt);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1>New Crawl - Step 2</h1>
        <p className="text-muted-foreground">
          Tell the AI what data to extract from {url}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Extraction Prompt
          </CardTitle>
          <CardDescription>
            Describe what information you want to extract in natural language
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="template">Template (Optional)</Label>
              <Select value={template} onValueChange={handleTemplateChange}>
                <SelectTrigger id="template">
                  <SelectValue placeholder="Choose a preset template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce">E-commerce Products</SelectItem>
                  <SelectItem value="news">News Articles</SelectItem>
                  <SelectItem value="jobs">Job Listings</SelectItem>
                  <SelectItem value="custom">Custom (write your own)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Extraction Instructions</Label>
              <Textarea
                id="prompt"
                placeholder="Example: Extract the product name, price, and customer rating from each product card..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[200px] text-base"
              />
              <p className="text-sm text-muted-foreground">
                Be specific about the data fields you need
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <h4 className="text-sm">Example prompts:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>"Get all product names and prices"</li>
                <li>"Extract headlines, authors, and publication dates from articles"</li>
                <li>"Find all contact information including emails and phone numbers"</li>
                <li>"Collect all image URLs and their alt text"</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button type="submit" className="flex-1">
                <Play className="mr-2 h-4 w-4" />
                Start Crawl
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

