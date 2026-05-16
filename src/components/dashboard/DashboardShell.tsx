'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X, Bell } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

export type NavItem = {
  label: string;
  href: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

type DashboardShellProps = {
  role: 'Родитель' | 'Врач';
  userName: string;
  userMeta?: string;
  navItems: NavItem[];
  children: React.ReactNode;
  rightSlot?: React.ReactNode;
};

export default function DashboardShell({
  role,
  userName,
  userMeta,
  navItems,
  children,
  rightSlot,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const initials = userName
    .split(' ')
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar (mobile) */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/85 backdrop-blur-md border-b border-border px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <AppLogo size={28} />
          <span className="text-base font-semibold">NeuroHub</span>
        </Link>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Меню"
          className="w-10 h-10 rounded-lg border border-border flex items-center justify-center bg-white"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            open ? 'translate-x-0' : '-translate-x-full'
          } fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white border-r border-border transition-transform lg:translate-x-0 flex flex-col`}
        >
          <div className="px-6 py-6 border-b border-border">
            <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
              <AppLogo size={32} />
              <span className="text-lg font-semibold tracking-tight">NeuroHub</span>
            </Link>
            <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Кабинет · {role}
            </p>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-secondary text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.Icon className="w-4.5 h-4.5" strokeWidth={active ? 2.25 : 1.75} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="px-3 py-4 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-primary text-sm font-semibold">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
                {userMeta && (
                  <p className="text-xs text-muted-foreground truncate">{userMeta}</p>
                )}
              </div>
            </div>
            <Link
              href="/login"
              className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Сменить роль
            </Link>
          </div>
        </aside>

        {open && (
          <div
            role="presentation"
            className="lg:hidden fixed inset-0 z-30 bg-black/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Main */}
        <main className="flex-1 min-w-0">
          <div className="hidden lg:flex items-center justify-between px-8 py-4 border-b border-border bg-white/60 backdrop-blur-sm">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                Кабинет {role.toLowerCase()}а
              </p>
              <p className="text-sm font-medium text-foreground">Добрый день, {userName.split(' ')[0]}</p>
            </div>
            <div className="flex items-center gap-3">
              {rightSlot}
              <button
                type="button"
                className="relative w-10 h-10 rounded-lg border border-border bg-white flex items-center justify-center hover:border-primary/40 transition-colors"
                aria-label="Уведомления"
              >
                <Bell className="w-4.5 h-4.5 text-muted-foreground" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
              </button>
            </div>
          </div>

          <div className="px-5 md:px-8 py-6 md:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
