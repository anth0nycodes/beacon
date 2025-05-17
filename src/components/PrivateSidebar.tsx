import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";

export default function PrivateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar className="shrink-0" />
        <div className="flex-1 ">{children}</div>
      </div>
    </SidebarProvider>
  );
}
