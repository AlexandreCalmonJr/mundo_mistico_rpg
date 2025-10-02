
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
import { LayoutDashboard, User, Map, MessageSquare, Users2, Crown, LogOut, Sparkles, Swords, ShieldPlus, GitMerge } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '@/hooks/use-auth';


const menuItems = [
  { href: '/dashboard', label: 'Quartel-General', icon: LayoutDashboard },
  { href: '/dashboard/character/sheet', label: 'Mestre & Servo', icon: User },
  { href: '/dashboard/character/create', label: 'Invocar Servo', icon: Sparkles },
  { href: '/dashboard/adventure', label: 'Mapa de Batalha', icon: Map },
  { href: '/dashboard/chat', label: 'Chat dos Mestres', icon: MessageSquare },
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
            <h2 className="font-headline text-lg text-foreground">Guerra do Graal</h2>
            <p className="text-xs text-muted-foreground">Edição Fuyuki</p>
        </div>
    </Link>
  );
}


export function MainSidebar() {
  const pathname = usePathname();
  const { user, character, isAdmin, logout } = useAuth();


  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => {
            // Hide links that require a character if one doesn't exist
            if (!character && (item.href.includes('/character/sheet') || item.href === '/dashboard' || item.href === '/dashboard/adventure')) {
                return null;
            }
            // Hide the creation link if a character already exists
            if (character && item.href.includes('/character/create')) {
                return null;
            }
            return (
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
            )
           })}
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
                <AvatarImage src={user?.photoURL || ""} />
                <AvatarFallback>{character?.name?.charAt(0) || user?.displayName?.charAt(0) || 'M'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <span className="text-sm font-semibold">{character?.name || user?.displayName || 'Mestre'}</span>
                <span className="text-xs text-muted-foreground">{ isAdmin ? 'Administrador' : `Nível ${character?.level || 0}` }</span>
            </div>
         </div>
         <Button asChild variant="ghost" className="w-full justify-start gap-2" onClick={logout}>
            <Link href="#">
                <LogOut className="size-4" />
                <span className="group-data-[collapsible=icon]:hidden">Sair</span>
            </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
