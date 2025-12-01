import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout";
import { DriverLanding, DriverTicket } from "@/components/features/driver";
import {
  AdminDashboard,
  AdminScanner,
  AdminLogin,
} from "@/components/features/admin";
import { AuthService } from "@/services/auth.service";
import type { View } from "@/types";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("driver");
  const [ticketId, setTicketId] = useState<string>("");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);

      if (hash.startsWith("/ticket/")) {
        setTicketId(hash.replace("/ticket/", ""));
        setCurrentView("ticket");
      } else if (hash === "/admin/login") {
        setCurrentView("login");
      } else if (hash === "/admin") {
        // Check if user is authenticated
        if (AuthService.isAuthenticated()) {
          setCurrentView("admin");
        } else {
          // Redirect to login
          window.location.hash = "/admin/login";
        }
      } else if (hash === "/admin/scanner") {
        // Check if user is authenticated
        if (AuthService.isAuthenticated()) {
          setCurrentView("scanner");
        } else {
          // Redirect to login
          window.location.hash = "/admin/login";
        }
      } else {
        setCurrentView("driver");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (view: View, id?: string) => {
    if (view === "ticket" && id) {
      window.location.hash = `/ticket/${id}`;
    } else if (view === "login") {
      window.location.hash = "/admin/login";
    } else if (view === "admin") {
      // Check authentication before navigating
      if (AuthService.isAuthenticated()) {
        window.location.hash = "/admin";
      } else {
        window.location.hash = "/admin/login";
      }
    } else if (view === "scanner") {
      // Check authentication before navigating
      if (AuthService.isAuthenticated()) {
        window.location.hash = "/admin/scanner";
      } else {
        window.location.hash = "/admin/login";
      }
    } else {
      window.location.hash = "/";
    }
  };

  return (
    <AppLayout>
      {currentView === "driver" && <DriverLanding onNavigate={navigateTo} />}
      {currentView === "ticket" && (
        <DriverTicket ticketId={ticketId} onNavigate={navigateTo} />
      )}
      {currentView === "login" && <AdminLogin onNavigate={navigateTo} />}
      {currentView === "admin" && <AdminDashboard onNavigate={navigateTo} />}
      {currentView === "scanner" && <AdminScanner onNavigate={navigateTo} />}
    </AppLayout>
  );
}
