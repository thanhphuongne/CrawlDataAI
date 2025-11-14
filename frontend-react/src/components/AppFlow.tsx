'use client';

import { useState, useEffect } from "react";
import { SidebarProvider } from "./ui/sidebar";
import { Toaster } from "./ui/sonner";
import { LandingPage } from "./LandingPage";
import { RegisterPage } from "./RegisterPage";
import { LoginPage } from "./LoginPage";
import { ForgotPasswordPage } from "./ForgotPasswordPage";
import { ChatPage } from "./ChatPage";
import { MyCrawlsPage } from "./MyCrawlsPage";
import { CrawlProgressPage } from "./CrawlProgressPage";
import { CrawlDetailPage } from "./CrawlDetailPage";
import { SettingsPage } from "./SettingsPage";
import { AppSidebar } from "./AppSidebar";
import { Navbar } from "./Navbar";
import { toast } from "sonner";

interface User {
  email: string;
  name: string;
  token: string;
}

interface Crawl {
  id: string;
  url: string;
  status: "completed" | "running" | "failed";
  itemsFound: number;
  date: string;
  prompt?: string;
}

interface Export {
  id: string;
  crawlName: string;
  format: "json" | "csv" | "pdf";
  date: string;
  size: string;
}

type Page = 
  | "landing"
  | "register"
  | "login"
  | "forgot-password"
  | "chat"
  | "crawls"
  | "crawl-progress"
  | "crawl-detail"
  | "exports"
  | "settings";

export default function AppFlow() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [crawls, setCrawls] = useState<Crawl[]>([]);
  const [exports, setExports] = useState<Export[]>([]);
  const [currentCrawlUrl, setCurrentCrawlUrl] = useState("");
  const [currentCrawlPrompt, setCurrentCrawlPrompt] = useState("");
  const [selectedCrawlId, setSelectedCrawlId] = useState("");

  // Load data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedDarkMode = localStorage.getItem("darkMode");
    const savedCrawls = localStorage.getItem("crawls");
    const savedExports = localStorage.getItem("exports");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentPage("chat");
    }
    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode));
    }
    if (savedCrawls) {
      setCrawls(JSON.parse(savedCrawls));
    }
    if (savedExports) {
      setExports(JSON.parse(savedExports));
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Save crawls to localStorage
  useEffect(() => {
    localStorage.setItem("crawls", JSON.stringify(crawls));
  }, [crawls]);

  // Save exports to localStorage
  useEffect(() => {
    localStorage.setItem("exports", JSON.stringify(exports));
  }, [exports]);

  const handleRegister = (email: string, password: string, name: string) => {
    const newUser: User = {
      email,
      name: name || email.split("@")[0],
      token: "mock-jwt-token-" + Date.now(),
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    setCurrentPage("chat");
    toast.success("Account created successfully!");
  };

  const handleLogin = (email: string, password: string) => {
    // Mock login - in production, this would validate credentials
    const newUser: User = {
      email,
      name: email.split("@")[0],
      token: "mock-jwt-token-" + Date.now(),
    };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    setCurrentPage("chat");
    toast.success("Welcome back!");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    setCurrentPage("landing");
    toast.success("Logged out successfully");
  };

  const handleNavigate = (page: string, crawlId?: string) => {
    if (crawlId) {
      setSelectedCrawlId(crawlId);
    }
    setCurrentPage(page as Page);
  };

  const handleNewCrawlStep1 = (url: string) => {
    setCurrentCrawlUrl(url);
    setCurrentPage("new-crawl-step-2");
  };

  const handleNewCrawlStart = (prompt: string) => {
    setCurrentCrawlPrompt(prompt);
    setCurrentPage("crawl-progress");
    // Simulate crawl progress
    setTimeout(() => {
      const newCrawl: Crawl = {
        id: Date.now().toString(),
        url: currentCrawlUrl,
        status: "completed",
        itemsFound: Math.floor(Math.random() * 100) + 10,
        date: new Date().toISOString().split("T")[0],
        prompt: currentCrawlPrompt,
      };
      setCrawls((prev) => [...prev, newCrawl]);
      setCurrentPage("crawl-detail");
      setSelectedCrawlId(newCrawl.id);
    }, 3000);
  };

  const handleExport = (crawlId: string, format: "json" | "csv" | "pdf") => {
    const crawl = crawls.find((c) => c.id === crawlId);
    if (crawl) {
      const newExport: Export = {
        id: Date.now().toString(),
        crawlName: crawl.url,
        format,
        date: new Date().toISOString().split("T")[0],
        size: (Math.random() * 10 + 1).toFixed(1) + " MB",
      };
      setExports((prev) => [...prev, newExport]);
      toast.success(`Export in ${format.toUpperCase()} format started!`);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={handleNavigate} />;
      case "register":
        return <RegisterPage onRegister={handleRegister} onNavigate={handleNavigate} />;
      case "login":
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case "forgot-password":
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
      case "chat":
        return <ChatPage user={user} onNavigate={handleNavigate} />;
      case "crawls":
        return <MyCrawlsPage crawls={crawls} onNavigate={handleNavigate} />;
      case "crawl-progress":
        return <CrawlProgressPage url={currentCrawlUrl} prompt={currentCrawlPrompt} />;
      case "crawl-detail":
        return (
          <CrawlDetailPage
            crawl={crawls.find((c) => c.id === selectedCrawlId)!}
            onExport={handleExport}
            onNavigate={handleNavigate}
          />
        );
      case "exports":
        return <MyCrawlsPage crawls={crawls} onNavigate={handleNavigate} />; // Placeholder
      case "settings":
        return <SettingsPage user={user} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        {user && <AppSidebar user={user} onNavigate={handleNavigate} onLogout={handleLogout} />}
        {user && <Navbar user={user} onNavigate={handleNavigate} />}
        <main className={user ? "lg:pl-64 pt-16" : ""}>
          {renderPage()}
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}

