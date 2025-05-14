import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./ui/app-sidebar";

export default function PrivateSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
