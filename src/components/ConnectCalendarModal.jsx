import { useState, useEffect } from "react";
import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Button } from "./ui/button";

export const ConnectCalendarModal = ({
  children,
  onConnectGoogle,
  onConnectOutlook,
  onConnectICloud,
  isConnecting = false
}) => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleConnect = (connectFn) => {
    connectFn();
    setOpen(false);
  };

  const calendarOptions = [
    {
      name: "Conectar Google Calendar",
      onClick: () => handleConnect(onConnectGoogle),
    },
    {
      name: "Conectar Outlook Calendar",
      onClick: () => handleConnect(onConnectOutlook),
    },
    {
      name: "Conectar iCloud Calendar",
      onClick: () => handleConnect(onConnectICloud),
    },
  ];

  const ModalContent = () => (
    <div className="lg:bg-[#0F1521] bg-[#141B2B] lg:rounded-[8px] rounded-t-[20px] overflow-hidden">
      <div className="lg:hidden px-4 py-4 text-white text-[18px] leading-[28px] font-bold text-center border-b border-[#34324a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        Conectar calendario
      </div>

      <div className="lg:p-0 p-4">
        {calendarOptions.map((option, index) => (
          <button
            key={option.name}
            onClick={option.onClick}
            disabled={isConnecting}
            className={cn(
              "w-full flex items-center justify-between px-4 py-3 text-white text-[16px] leading-[1.5] hover:bg-[#1C273E] transition-colors disabled:opacity-50",
              index < calendarOptions.length - 1 && "border-b border-[#34324a]",
              "lg:py-3 py-4"
            )}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            <span>{option.name}</span>
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        ))}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="p-0 bg-[#141B2B] border-0 rounded-t-[20px] max-h-[90vh]"
          hideClose={true}
        >
          <ModalContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent
        className="max-w-[375px] p-0 bg-[#0F1521] border-0 rounded-[8px] shadow-lg cursor-pointer"
        align="start"
        sideOffset={38}
        side="bottom"
      >
        <ModalContent />
      </PopoverContent>
    </Popover>
  );
};

