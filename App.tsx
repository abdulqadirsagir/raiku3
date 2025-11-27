import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Explainer } from './components/Explainer';
import { Search } from './components/Search';
import { Quiz } from './components/Quiz';
import { Leaderboard } from './components/Leaderboard';
import { LeaderboardEntry } from './types';
import { Socials } from './components/Socials';
import { AnimatedSection } from './components/AnimatedSection';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false });

      if (error) throw error;
      setLeaderboardData(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    
    const channel = supabase
      .channel('public:leaderboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, () => {
        fetchLeaderboard();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);


  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-raiku-lime selection:text-black">
      <div 
        className="fixed top-0 left-0 w-full h-full animate-grid-pan -z-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(191, 255, 0, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(191, 255, 0, 0.07) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      ></div>
      
      <Header session={session} />
      
      <main className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-16 md:gap-24 mt-20">
        <AnimatedSection>
          <Explainer />
        </AnimatedSection>
        
        <AnimatedSection>
          <Search />
        </AnimatedSection>
        
        <AnimatedSection>
          <Quiz session={session} onScoreUpdate={fetchLeaderboard} />
        </AnimatedSection>
        
        <AnimatedSection>
          <Leaderboard data={leaderboardData} />
        </AnimatedSection>
        
        <AnimatedSection>
          <Socials />
        </AnimatedSection>
      </main>
      
      <footer className="text-center py-8 text-gray-500 font-mono text-sm">
        <p>&copy; {new Date().getFullYear()} Raiku.com. All rights reserved.</p>
        <p className="mt-2">vibecoded by chrollo69420</p>
      </footer>
    </div>
  );
};

export default App;