import type { ReactNode } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/dashboard/main-sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset>
        <div className="min-h-screen w-full">
            {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
