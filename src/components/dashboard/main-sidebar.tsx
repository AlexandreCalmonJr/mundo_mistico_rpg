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
import { Logo } from '@/components/icons/logo';
import { Button } from '../ui/button';
import { LayoutDashboard, Swords, UserPlus, BrainCircuit, LogOut, BookUser } from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
  { href: '/dashboard/character/sheet', label: 'Meu Personagem', icon: BookUser },
  { href: '/dashboard/character/create', label: 'Criar Personagem', icon: UserPlus },
  { href: '/dashboard/classes', label: 'Classes e Raças', icon: Swords },
  { href: '/dashboard/adventure', label: 'Aventura', icon: BrainCircuit },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <Logo />
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
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
          <Button asChild variant="ghost" className="w-full justify-start gap-2">
            <Link href="/">
                <LogOut className="size-4" />
                <span>Sair</span>
            </Link>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
