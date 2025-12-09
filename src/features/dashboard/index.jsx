import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { MoreOptionsIcon } from "@/components/MoreOptionsIcon";
import UnionIcon from "@/assets/icons/Union.svg";
import EurekyLogo from "@/assets/icons/Union (1).svg";
import { MiDiaSection } from "./sections/MiDiaSection";
import { Proximos7Section } from "./sections/Proximos7Section";
import { TareasSection } from "./sections/TareasSection";
import { CalendarioSectionView } from "./sections/CalendarioSection";
import { TaskList } from "@/components/TaskList";
import { AddTask } from "@/components/AddTask";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SoporteIcon from "@/assets/icons/life-buoy-01.svg";
import AjustesIcon from "@/assets/icons/settings-01.svg";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("mi-dia");


  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0 min-w-[370px]">
        <div className="overflow-auto">
          <div className={`mx-auto lg:p-6 ${activeSection !== 'mi-dia' ? 'max-w-full' : 'max-w-4xl'
            }`}>
            {/* Mobile Header */}
            <div className="lg:hidden relative">
              <div className="flex items-center justify-between px-5 py-4">
                {/* Left: User Avatar with Green Badge */}
                <div className="relative w-8 h-8 rounded-full bg-[#312465] border border-[rgba(0,0,0,0.08)] flex items-center justify-center flex-shrink-0">
                  <div className="absolute bottom-[-1px] right-[-1px] w-[10px] h-[10px] rounded-[5px] bg-[#6FE36B] border-[1.5px] border-white"></div>
                </div>

                {/* Middle: Logo Icons */}
                <div className="flex items-center gap-2 flex-1 justify-center">
                  <img src={UnionIcon} alt="Logo" className="h-[22.824px] w-auto svg-icon" />
                  <img src={EurekyLogo} alt="eureky" className="h-[22.824px] w-auto svg-icon" />
                </div>

                {/* Right: More Options */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="flex-shrink-0 w-5 h-5">
                      <MoreOptionsIcon size={20} className="w-5 h-5 text-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[131px] p-0 bg-card rounded-[8px] border-0 shadow-[0px_4px_4px_-1px_rgba(12,12,13,0.1),0px_4px_4px_-1px_rgba(12,12,13,0.05)]" sideOffset={8}>
                    <DropdownMenuItem className="px-4 py-3 text-[16px] leading-[1.5] hover:bg-accent cursor-pointer border-b border-border rounded-none">
                      <img src={SoporteIcon} alt="" className="w-4 h-4 mr-2 svg-icon" />
                      <span style={{ fontFamily: "'DM Sans', sans-serif" }}>Soporte</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="px-4 py-3 text-[16px] leading-[1.5] hover:bg-accent cursor-pointer">
                      <img src={AjustesIcon} alt="" className="w-4 h-4 mr-2 svg-icon" />
                      <span style={{ fontFamily: "'DM Sans', sans-serif" }}>Ajustes</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* Divider line */}
              <div className="absolute left-0 top-16 w-full h-px bg-[#34324a]"></div>
            </div>

            {/* Render section based on activeSection */}
            {activeSection === "mi-dia" && (
              <MiDiaSection />
            )}

            {activeSection === "proximos-7" && (
              <Proximos7Section />
            )}

            {activeSection === "tareas" && (
              <TareasSection />
            )}

            {activeSection === "calendario" && (
              <CalendarioSectionView />
            )}

            {activeSection !== "mi-dia" &&
              activeSection !== "proximos-7" &&
              activeSection !== "tareas" &&
              activeSection !== "calendario" && (
                <div className="flex flex-col min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-48px)]">
                  <div className="flex-1">
                    <h1 className="text-[32px] lg:text-[48px] font-bold mb-8 px-4 lg:px-0">
                      {activeSection}
                    </h1>
                    <TaskList filterByListName={activeSection} />
                  </div>
                  <AddTask />
                </div>
              )}
          </div>
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
    </div>
  );
};

export default Dashboard;