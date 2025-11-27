import React from 'react';
import { supabase } from '../supabase';
import { Button } from './ui/Button';

interface AuthProps {
  session: any;
}

export const Auth: React.FC<AuthProps> = ({ session }) => {
  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in with Discord');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <Button onClick={handleLogin} className="flex items-center gap-2 text-sm px-4 py-2">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 19.019 19.019 0 0 0-1.044 2.135 18.195 18.195 0 0 0-4.634 0 19.017 19.017 0 0 0-1.045-2.135.071.071 0 0 0-.076-.037 19.791 19.791 0 0 0-4.886 1.515.072.072 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.018.077.077 0 0 0 .084-.027 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.007-.127c.125-.094.251-.192.374-.291a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.018.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z" />
        </svg>
        Login with Discord
      </Button>
    );
  }

  const avatarUrl = session.user.user_metadata.avatar_url;
  const username = session.user.user_metadata.full_name || session.user.user_metadata.name || session.user.email;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3">
        {avatarUrl && (
          <img src={avatarUrl} alt={username} className="w-8 h-8 rounded-full border border-raiku-lime" />
        )}
        <span className="text-raiku-lime font-mono text-sm hidden md:inline">{username}</span>
      </div>
      <Button onClick={handleLogout} variant="secondary" className="text-xs px-3 py-1">
        Logout
      </Button>
    </div>
  );
};
