import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import LoginButton from './LoginButton';
import { Flame, Video, Library, User } from 'lucide-react';
import { SiCaffeine } from 'react-icons/si';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <button
                onClick={() => navigate({ to: isAuthenticated ? '/trending' : '/' })}
                className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors"
              >
                <Video className="w-6 h-6 text-primary" />
                <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
                  AI Video Maker
                </span>
              </button>

              {isAuthenticated && (
                <nav className="hidden md:flex items-center gap-6">
                  <Link
                    to="/trending"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    activeProps={{ className: 'text-primary' }}
                  >
                    <Flame className="w-4 h-4" />
                    Trending
                  </Link>
                  <Link
                    to="/templates"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    activeProps={{ className: 'text-primary' }}
                  >
                    <Library className="w-4 h-4" />
                    Templates
                  </Link>
                  <Link
                    to="/account"
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    activeProps={{ className: 'text-primary' }}
                  >
                    <User className="w-4 h-4" />
                    Account
                  </Link>
                </nav>
              )}
            </div>

            <div className="flex items-center gap-4">
              {isAuthenticated && userProfile && (
                <span className="hidden sm:block text-sm text-muted-foreground">
                  {userProfile.name}
                </span>
              )}
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} AI Video Maker. All rights reserved.
            </p>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'ai-video-maker'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Built with <SiCaffeine className="w-4 h-4 text-primary" /> using caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
