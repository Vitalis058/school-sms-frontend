import FooterV2 from "@/components/Footer/Footer";
import MainNav from "@/components/nav/mainNav";
import React from "react";

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1300px] px-3">
      <MainNav />
      {children}
      <FooterV2 />
    </div>
  );
}

export default MainLayout;
