'use client';

import { useState, useEffect } from "react";
import { SidebarProvider } from "./ui/sidebar";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { LandingPage } from "./LandingPage";
import { RegisterPage } from "./RegisterPage";
import { LoginPage } from "./LoginPage";
import { ForgotPasswordPage } from "./ForgotPasswordPage";
import VerifyOTPPage from "./VerifyOTPPage";
import { ChatPage } from "./ChatPage";
import { MyCrawlsPage } from "./MyCrawlsPage";
import { CrawlProgressPage } from "./CrawlProgressPage";
import { CrawlDetailPage } from "./CrawlDetailPage";
import { SettingsPage } from "./SettingsPage";
import { AppSidebar } from "./AppSidebar";
import { Navbar } from "./Navbar";
import { authAPI, userAPI, dataAPI } from '../utils/api';

interface User {
  id?: number;
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
  const [pendingVerification, setPendingVerification] = useState<{ accountName: string; password: string } | null>(null);

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

  const handleRegister = async (email: string, password: string, name: string) => {
    try {
      const response = await authAPI.register({ accountName: email, password, email });
      
      if (response.data.success) {
        // Store credentials for verification
        setPendingVerification({ accountName: email, password });
        setCurrentPage("verify-otp" as Page);
        toast.success("Registration successful! Check your email for verification code.");
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      const errorMsg = error.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMsg);
    }
  };

  const handleVerified = (accessToken: string, user: any) => {
    const newUser: User = {
      id: user.id,
      email: user.email,
      name: user.accountName || user.email.split("@")[0],
      token: accessToken,
    };

    // Store auth token
    localStorage.setItem('auth_token', accessToken);
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    setPendingVerification(null);
    setCurrentPage("chat");
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ accountName: email, password });
      const { accessToken, user } = response.data;

      // Store token
      localStorage.setItem('auth_token', accessToken);

      // Create user object from API response
      const newUser: User = {
        id: user.id,
        email: user.email || email,
        name: user.accountName || email.split("@")[0],
        token: accessToken,
      };

      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      setCurrentPage("chat");
      toast.success("Welcome back!");
    } catch (error) {
      console.error('Login failed:', error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
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

  const handleExport = async (format: string, crawlId: string) => {
    try {
      // Create export request
      await dataAPI.createExport({ request_id: parseInt(crawlId), format });
      
      // Download the export
      const response = await dataAPI.downloadExport(parseInt(crawlId), format);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `crawl_${crawlId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Export failed. Please try again.');
    }
  };

  const handleUpdateProfile = async (name: string, email: string) => {
    if (!user) return;

    try {
      await userAPI.updateProfile(user.id || 1, { name, email });

      const updatedUser = { ...user, name, email };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error("Failed to update profile");
    }
  };

  const handleUpdatePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return;

    try {
      await userAPI.updatePassword(user.id || 1, {
        current_password: currentPassword,
        new_password: newPassword
      });
      toast.success("Password updated successfully");
    } catch (error) {
      console.error('Password update failed:', error);
      toast.error("Failed to update password");
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    try {
      await userAPI.deleteAccount(user.id || 1);
      localStorage.clear();
      setUser(null);
      setCrawls([]);
      setExports([]);
      setCurrentPage("landing");
      toast.success("Account deleted");
    } catch (error) {
      console.error('Account deletion failed:', error);
      toast.error("Failed to delete account");
    }
  };

  const renderPage = () => {
    // Public pages
    if (!user) {
      switch (currentPage) {
        case "register":
          return <RegisterPage onNavigate={handleNavigate} onRegister={handleRegister} />;
        case "verify-otp":
          return pendingVerification ? (
            <VerifyOTPPage
              accountName={pendingVerification.accountName}
              password={pendingVerification.password}
              onVerified={handleVerified}
              onBack={() => {
                setPendingVerification(null);
                setCurrentPage("register");
              }}
            />
          ) : (
            <LandingPage onNavigate={handleNavigate} user={user} />
          );
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

