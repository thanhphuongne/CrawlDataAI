import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Sparkles, MessageSquare, Database, Download } from "lucide-react";

interface LandingPageProps {
  onNavigate: (page: string) => void;
  user: User | null;
}

export function LandingPage({ onNavigate, user }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <Card className="max-w-4xl w-full shadow-2xl">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-3xl">AI CrawlBot</h1>
                  </div>
                  
                  <h2 className="text-4xl">
                    Chat with AI to get any web data
                  </h2>
                  
                  <p className="text-muted-foreground text-lg">
                    Simply describe what data you need in plain English. Our AI assistant will crawl websites, extract the data, and deliver it in your preferred format - all through a ChatGPT-like conversation.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      size="lg"
                      onClick={() => user ? onNavigate("chat") : onNavigate("login")}
                      className="flex-1"
                    >
                      {user ? "Go to Dashboard" : "Start"}
                    </Button>
                    {!user && (
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => onNavigate("register")}
                        className="flex-1"
                      >
                        Sign Up
                      </Button>
                    )}
                  </div>

                  <div className="pt-6 grid grid-cols-3 gap-4 border-t">
                    <div>
                      <div className="text-2xl text-primary">10K+</div>
                      <div className="text-sm text-muted-foreground">Crawls</div>
                    </div>
                    <div>
                      <div className="text-2xl text-primary">500+</div>
                      <div className="text-sm text-muted-foreground">Users</div>
                    </div>
                    <div>
                      <div className="text-2xl text-primary">99.9%</div>
                      <div className="text-sm text-muted-foreground">Uptime</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <div className="rounded-xl overflow-hidden shadow-lg">
                      <ImageWithFallback
                        src="https://images.unsplash.com/photo-1674027444485-cec3da58eef4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwbmV0d29ya3xlbnwxfHx8fDE3NjMxMjU5Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                        alt="AI Network Visualization"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                  
                  {/* Feature highlights */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <MessageSquare className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-xs">Chat Interface</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Database className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-xs">Auto Extract</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <Download className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <div className="text-xs">Export Data</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
