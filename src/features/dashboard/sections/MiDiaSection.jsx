import { useState, useMemo } from "react";
import { CalendarSection } from "@/components/CalendarSection";
import { TaskList } from "@/components/TaskList";
import { AddTask } from "@/components/AddTask";
import { cn } from "@/lib/utils";
import { useMiDiaData } from "../hooks/useMiDiaData";
import { useAuth } from "@/shared/hooks/useAuth";

export const MiDiaSection = () => {
  const [selectedFilter, setSelectedFilter] = useState("Personal");
  const { user } = useAuth();
  const { calendarEvents } = useMiDiaData();

  const userName = user?.name?.split(' ')[0] || 'Usuario';

  // Determinar el saludo según la hora del día
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'Buenos días';
    } else if (hour >= 12 && hour < 20) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  }, []);

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-48px)]">
      <div className="flex-1">
        <h1 className="text-[32px] lg:text-[48px] font-bold leading-[1.2] tracking-[-0.64px] lg:leading-[64px] lg:tracking-[-0.48px] mt-12 lg:mt-16 mb-6 lg:mb-8 px-6 lg:px-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          <span className="lg:hidden">Buenos días, {userName}.</span>
          <span className="hidden lg:inline">Buenos días, {userName}</span>
        </h1>

        <CalendarSection events={calendarEvents} />

        <TaskList />
      </div>

      <div className="flex flex-wrap justify-center items-center lg:hidden fixed bottom-[150px] left-0 right-0 flex gap-2 px-6 overflow-x-auto bg-background pb-2 z-30">
        {["Personal", "Trabajo", "Freelance"].map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={cn(
              "px-6 py-1 rounded-[40px] text-[14px] leading-[20px] font-normal whitespace-nowrap transition-colors",
              selectedFilter === filter
                ? "bg-[#8465FF] text-white"
                : "bg-[#0F1521] text-white"
            )}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {filter}
          </button>
        ))}
      </div>

      <AddTask />
    </div>
  );
};