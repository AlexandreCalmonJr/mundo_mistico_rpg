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
import { LayoutDashboard, Swords, UserPlus, BrainCircuit, LogOut } from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
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
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Link href="/" legacyBehavior passHref>
            <Button variant="ghost" className="w-full justify-start gap-2">
                <LogOut className="size-4" />
                <span>Sair</span>
            </Button>
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
