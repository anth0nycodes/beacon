import { SidebarTrigger } from "@/components/ui/sidebar";

export default function PrivateHeader() {
  return (
    <header className="h-14 z-50 border-b bg-background flex sticky top-0 items-center px-4 w-full">
      <SidebarTrigger />
    </header>
  );
}
