'use client';

import { useState, useCallback } from 'react';
import { TickerBar } from '@/components/ticker-bar';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { DestinationsSection } from '@/components/destinations-section';
import { HotelsSection } from '@/components/hotels-section';
import { BeachesSection } from '@/components/beaches-section';
import { PlannerSection } from '@/components/planner-section';
import { MoodengSection } from '@/components/moodeng-section';
import { BudgetSection } from '@/components/budget-section';
import { FaqSection } from '@/components/faq-section';
import { EarningSection } from '@/components/earning-section';
import { ChatInterface } from '@/components/chat-interface';
import { Footer } from '@/components/footer';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<'landing' | 'chat'>('landing');

  const handleNavigate = useCallback((view: 'landing' | 'chat') => {
    setCurrentView(view);
  }, []);

  const handleScrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleLaunchChat = useCallback(() => {
    setCurrentView('chat');
  }, []);

  const handleExplore = useCallback(() => {
    setCurrentView('landing');
    setTimeout(() => {
      const el = document.getElementById('destinations');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Ticker Bar */}
      <TickerBar />

      {/* Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onScrollTo={handleScrollTo}
      />

      {/* Main Content */}
      <main className="flex-1">
        {currentView === 'landing' ? (
          <div>
            {/* Hero */}
            <HeroSection
              onLaunchChat={handleLaunchChat}
              onExplore={handleExplore}
            />

            {/* Destinations */}
            <DestinationsSection />

            {/* Hotels */}
            <HotelsSection />

            {/* Beaches */}
            <BeachesSection />

            {/* Planner */}
            <PlannerSection />

            {/* Moo Deng */}
            <MoodengSection />

            {/* Budget */}
            <BudgetSection />

            {/* FAQ */}
            <FaqSection />

            {/* Earning */}
            <EarningSection />

            {/* Footer */}
            <Footer />
          </div>
        ) : (
          <ChatInterface />
        )}
      </main>
    </div>
  );
}
