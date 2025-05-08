import React from "react";
import { Navbar } from "@/components/Navbar";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main>
      {process.env.FLAG_SHOW_PRODUCTION_PAGE !== "true" ? "" : <Navbar />}
      {children}
    </main>
  );
};

export default PublicLayout;
