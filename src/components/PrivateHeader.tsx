import { SidebarTrigger } from "@/components/ui/sidebar";

export default function PrivateHeader() {
  return (
    <header className="h-14 border-b bg-background flex items-center px-4 w-full">
      <SidebarTrigger />
    </header>
  );
}
