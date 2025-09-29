
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { LayoutDashboard, User, Map, MessageSquare, Users, Crown, LogOut, Sparkles, Shield } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';


const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/character/sheet', label: 'Character', icon: User },
  { href: '/dashboard/adventure', label: 'Adventures', icon: Map },
  { href: '/dashboard/chat', label: 'Chat', icon: MessageSquare },
  { href: '/dashboard/clans', label: 'Groups', icon: Users },
  { href: '/dashboard/admin', label: 'Admin', icon: Crown },
];

function SidebarLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg">
            <Sparkles className="text-primary-foreground" />
        </div>
        <div>
            <h2 className="font-headline text-lg text-foreground">Mythic Realms</h2>
            <p className="text-xs text-muted-foreground">MMORPG Adventure</p>
        </div>
    </Link>
  );
}


export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarLogo />
        <SidebarTrigger className="md:hidden" />
      </SidebarHeader>
      <SidebarContent>
        <div className="mb-4 ml-2 mt-2">
            <p className="text-xs font-semibold text-muted-foreground tracking-wider">NAVIGATION</p>
        </div>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <div className="flex items-center gap-3">
            <Avatar>
                <AvatarImage src="https://picsum.photos/seed/adventurer/40/40" />
                <AvatarFallback>AV</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-sm font-semibold">Adventurer</span>
                <span className="text-xs text-muted-foreground">Level 1 Explorer</span>
            </div>
         </div>
         <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/">
                <LogOut className="size-4" />
                <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
            </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
