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

    // if (savedUser) {
    //   setUser(JSON.parse(savedUser));
    // }
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

  const handleStartCrawl = (url: string, prompt: string): string => {
    const crawlId = "crawl-" + Date.now();
    setCurrentCrawlUrl(url);
    setCurrentCrawlPrompt(prompt);
    
    const newCrawl: Crawl = {
      id: crawlId,
      url: url,
      status: "running",
      itemsFound: 0,
      date: new Date().toISOString(),
      prompt: prompt,
    };
    
    setCrawls(prev => [newCrawl, ...prev]);
    
    // Simulate crawl completion after some time
    setTimeout(() => {
      setCrawls(prev => prev.map(c => 
        c.id === crawlId 
          ? { ...c, status: "completed", itemsFound: Math.floor(Math.random() * 50) + 10 }
          : c
      ));
    }, 4000);
    
    return crawlId;
  };

  const handleCrawlComplete = (crawlId: string) => {
    setSelectedCrawlId(crawlId);
    setCurrentPage("crawl-detail");
  };

  const handleExport = (format: string, crawlId: string) => {
    const crawl = crawls.find(c => c.id === crawlId);
    if (!crawl) return;

    const newExport: Export = {
      id: `export-${Date.now()}`,
      crawlName: crawl.url,
      format: format as "json" | "csv" | "pdf",
      date: new Date().toISOString(),
      size: `${Math.floor(Math.random() * 500 + 100)} KB`,
    };

    setExports(prev => [newExport, ...prev]);
    toast.success(`Exported as ${format.toUpperCase()}`);
  };

  const handleUpdateProfile = (name: string, email: string) => {
    if (user) {
      const updatedUser = { ...user, name, email };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const handleUpdatePassword = (currentPassword: string, newPassword: string) => {
    // Mock password update
    toast.success("Password updated successfully");
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    setUser(null);
    setCrawls([]);
    setExports([]);
    setCurrentPage("landing");
    toast.success("Account deleted");
  };

  const renderPage = () => {
    // Public pages
    if (!user) {
      switch (currentPage) {
        case "register":
          return <RegisterPage onNavigate={handleNavigate} onRegister={handleRegister} />;
        case "login":
          return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
        case "forgot-password":
          return <ForgotPasswordPage onNavigate={handleNavigate} />;
        default:
          return <LandingPage onNavigate={handleNavigate} user={user} />;
      }
    }

    // Authenticated pages
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
          />
          <div className="flex-1 flex flex-col">
            <Navbar
              onLogout={handleLogout}
              onNavigate={handleNavigate}
              userName={user.name}
            />
            <main className="flex-1 bg-background">
              {currentPage === "chat" && (
                <ChatPage 
                  onNavigate={handleNavigate} 
                  onStartCrawl={handleStartCrawl}
                />
              )}
              {currentPage === "crawls" && (
                <div className="p-6">
                  <MyCrawlsPage 
                    onNavigate={handleNavigate} 
                    crawls={crawls}
                  />
                </div>
              )}
              {currentPage === "crawl-detail" && (
                <div className="p-6">
                  <CrawlDetailPage
                    crawlId={selectedCrawlId}
                    onNavigate={handleNavigate}
                    onExport={handleExport}
                  />
                </div>
              )}
              {currentPage === "settings" && (
                <div className="p-6">
                  <SettingsPage
                    user={user}
                    onUpdateProfile={handleUpdateProfile}
                    onUpdatePassword={handleUpdatePassword}
                    onDeleteAccount={handleDeleteAccount}
                  />
                </div>
              )}
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  };

  return (
    <>
      {renderPage()}
      <Toaster />
    </>
  );
}

