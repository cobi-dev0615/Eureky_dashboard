import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { HomeIcon } from "./HomeIcon";
import { ChartIcon } from "./ChartIcon";
import { TasksIcon } from "./TasksIcon";
import { CalendarStackIcon } from "./CalendarStackIcon";

export const MobileNav = ({ activeSection, onSectionChange }) => {
  const sections = [
    { id: "mi-dia", label: "MI DIA", icon: HomeIcon },
    { id: "proximos-7", label: "7 días", icon: ChartIcon },
    { id: "tareas", label: "Tareas", icon: TasksIcon },
    { id: "calendario", label: "Calendario", icon: CalendarStackIcon },
    { id: "listas", label: "Mis listas", icon: Menu },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-sidebar rounded-tl-[16px] rounded-tr-[16px] lg:hidden z-50 ">
      <div className="flex items-center justify-center gap-6 px-[30px] py-4">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "flex flex-col items-center gap-[2px] transition-colors",
                isActive ? "text-white" : "text-[#444358]"
              )}
            >
              <section.icon 
                size={20} 
                className="w-5 h-5"
              />
              <span className="text-[10px] leading-[16px] font-bold tracking-[0.5px] uppercase" style={{fontFamily: "'Inter', sans-serif"}}>
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
