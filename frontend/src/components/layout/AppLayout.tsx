// Import the React tools, the router outlet and our layout pieces.
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";

// The frame around every page: sidebar on the left, header on top, footer at the bottom.
export default function AppLayout() {
  // Remember whether the mobile menu drawer is open.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      {/* Desktop sidebar: always visible on large screens. */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 lg:block">
        <Sidebar onNavigate={() => setIsMenuOpen(false)} />
      </aside>

      {/* Mobile sidebar: slides over the page when the menu button is pressed. */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsMenuOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-60">
            <Sidebar onNavigate={() => setIsMenuOpen(false)} />
          </aside>
        </div>
      )}

      {/* The main area. On large screens it starts after the sidebar. */}
      <div className="flex min-h-screen flex-col lg:pl-60">
        <Header onMenuClick={() => setIsMenuOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6">
          {/* The current page is drawn here. */}
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
