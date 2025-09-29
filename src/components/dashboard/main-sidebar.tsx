
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
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { LayoutDashboard, User, Map, MessageSquare, Users2, Crown, LogOut, Sparkles, Swords, ShieldPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useEffect, useState } from 'react';


const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/character/sheet', label: 'Meu Personagem', icon: User },
  { href: '/dashboard/character/create', label: 'Criar Personagem', icon: ShieldPlus },
  { href: '/dashboard/classes', label: 'Classes e Raças', icon: Swords },
  { href: '/dashboard/clans', label: 'Clãs', icon: Users2 },
  { href: '/dashboard/adventure', label: 'Aventura', icon: Map },
  { href: '/dashboard/chat', label: 'Chat Global', icon: MessageSquare },
];

const adminMenuItems = [
    { href: '/dashboard/admin', label: 'Admin', icon: Crown },
]


function SidebarLogo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-3">
        <div className="bg-primary p-2 rounded-lg">
            <Sparkles className="text-primary-foreground" />
        </div>
        <div>
            <h2 className="font-headline text-lg text-foreground">Mundo Mítico</h2>
            <p className="text-xs text-muted-foreground">Aventura MMORPG</p>
        </div>
    </Link>
  );
}


export function MainSidebar() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
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
        {isAdmin && (
            <SidebarMenu className="mt-auto">
                <div className="mb-2 ml-2 mt-2">
                    <p className="text-xs font-semibold text-muted-foreground tracking-wider">ADMINISTRAÇÃO</p>
                </div>
                {adminMenuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        isActive={pathname.startsWith(item.href)}
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
        )}
      </SidebarContent>
      <SidebarFooter>
         <div className="flex items-center gap-3">
            <Avatar>
                <AvatarImage src="https://picsum.photos/seed/adventurer/40/40" />
                <AvatarFallback>AV</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-sm font-semibold">Aventureiro</span>
                <span className="text-xs text-muted-foreground">Nível 1 Explorador</span>
            </div>
         </div>
         <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/">
                <LogOut className="size-4" />
                <span className="group-data-[collapsible=icon]:hidden">Sair</span>
            </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
