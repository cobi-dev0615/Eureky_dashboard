import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import UnionIcon from "@/assets/icons/Union.svg";
import Soporte from "@/assets/icons/life-buoy-01.svg";
import Ajustes from "@/assets/icons/settings-01.svg";
import EurekyLogo from "@/assets/icons/Union (1).svg";
import { HomeIcon } from "./HomeIcon";
import { ChartIcon } from "./ChartIcon";
import { TasksIcon } from "./TasksIcon";
import { CalendarStackIcon } from "./CalendarStackIcon";
import VectorLeft from "@/assets/icons/Vector.svg";
import VectorRight from "@/assets/icons/Vector (1).svg";
import NavAccountMenuIcon from "@/assets/icons/__Nav account card menu button.svg";
import { useLists, useCreateList } from "@/features/lists/hooks/useListsQuery";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Input } from "./ui/input";
import { useAuth } from "@/shared/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Sidebar = ({ activeSection, onSectionChange }) => {
  const { user, email } = useAuth();
  const navigate = useNavigate();
  const userName = user?.name?.split(' ')[0] || 'Usuario';

  // Fetch lists from backend
  const { data: lists = [], isLoading: isLoadingLists } = useLists({
    status: 'ACTIVE',
    isCompleted: false,
    includeItems: false,
    limit: 50,
    offset: 0,
    orderBy: 'createdAt',
    orderDirection: 'desc'
  });

  // Create list mutation
  const createListMutation = useCreateList();

  // State for add list popover
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [newListName, setNewListName] = useState("");

  const mainSections = [
    { id: "mi-dia", label: "Mi día", icon: HomeIcon },
    { id: "proximos-7", label: "Próximos 7 días", icon: ChartIcon },
    { id: "tareas", label: "Tareas", icon: CalendarStackIcon },
    { id: "calendario", label: "Mi calendario", icon: TasksIcon },
  ];

  // Handle creating a new list
  const handleCreateList = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!newListName.trim()) return;

    createListMutation.mutate(
      {
        name: newListName.trim(),
        description: "",
        metadata: {}
      },
      {
        onSuccess: () => {
          setNewListName("");
          setPopoverOpen(false);
        },
        onError: (error) => {
          console.error("Error creating list:", error);
        }
      }
    );
  };

  // Get list names for display
  const listNames = lists.map(list => list.name || list);

  const handleUpgradePlan = () => {
    navigate('/payments/checkout');
  };

  return (
    <aside className="w-[301px] bg-sidebar flex flex-col h-screen">
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center gap-2 py-2">
          <img src={UnionIcon} alt="Logo" className="h-[28px] w-auto svg-icon" />
          <img src={EurekyLogo} alt="eureky" className="h-[28px] w-auto svg-icon" />
        </div>
      </div>

      <nav className="flex-1 pt-4 pb-0 pl-0 pr-0 overflow-y-auto relative">
        <div className="space-y-[2px] mb-4 px-4">
          {mainSections.map((section) => {
            return (
              <button
                key={section.id}
                onClick={(e) => {
                  onSectionChange(section.id);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-[16px] leading-[24px] transition-colors sidebar-button-hover sidebar-nav-button rounded-[6px]",
                  activeSection === section.id
                    ? "sidebar-button-active"
                    : "text-sidebar-foreground"
                )}
                style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
              >
                <section.icon
                  size={20}
                  className={cn(
                    "w-5 h-5",
                    activeSection === section.id ? "text-white" : "text-[#CDCEDF]"
                  )}
                />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>

        <div className="px-4">
          <div className="flex items-center justify-between px-3 py-2 mb-[2px] sidebar-button-hover sidebar-nav-button rounded-[6px]">
            <span className="text-[16px] leading-[24px] font-semibold text-sidebar-foreground" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Mis Listas</span>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <form onSubmit={handleCreateList} className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Nombre de la lista
                    </label>
                    <Input
                      type="text"
                      value={newListName}
                      onChange={(e) => setNewListName(e.target.value)}
                      placeholder="Ej: Personal, Trabajo..."
                      className="w-full"
                      autoFocus
                      disabled={createListMutation.isPending}
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setPopoverOpen(false);
                        setNewListName("");
                      }}
                      disabled={createListMutation.isPending}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      disabled={!newListName.trim() || createListMutation.isPending}
                    >
                      {createListMutation.isPending ? "Creando..." : "Crear"}
                    </Button>
                  </div>
                </form>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-[2px]">
            {isLoadingLists ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                Cargando listas...
              </div>
            ) : listNames.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No hay listas
              </div>
            ) : (
              listNames.map((listName, index) => {
                const list = lists[index];
                const listId = list?.id || listName;
                return (
                  <button
                    key={listId}
                    onClick={(e) => {
                      onSectionChange(listName);
                    }}
                    className={cn(
                      "w-full flex items-center px-3 py-2 text-[16px] leading-[1.5] transition-colors sidebar-button-hover sidebar-nav-button rounded-[6px]",
                      activeSection === listName
                        ? "sidebar-button-active"
                        : "text-sidebar-foreground"
                    )}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <span>{listName}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </nav>

      <div className="pt-0 pb-0 space-y-[2px] px-4">
        <button
          className="w-full flex items-center gap-2 px-3 py-2 text-[16px] leading-[24px] text-sidebar-foreground transition-colors sidebar-button-hover sidebar-nav-button rounded-[6px]"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
        >
          <img src={Soporte} alt="" className="w-5 h-5 svg-icon" />
          <span>Soporte</span>
        </button>
        <button
          className="w-full flex items-center gap-2 px-3 py-2 text-[16px] leading-[24px] text-sidebar-foreground transition-colors sidebar-button-hover sidebar-nav-button rounded-[6px]"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
        >
          <img src={Ajustes} alt="" className="w-5 h-5 svg-icon" />
          <span>Ajustes</span>
        </button>
      </div>

      <div className="px-4 py-4">
        <Button
          onClick={handleUpgradePlan}
          className="hover:opacity-90 transition-opacity relative overflow-hidden flex items-center justify-center w-[269px] h-[64px] rounded-[8px]"
          style={{
            backgroundColor: '#6A52CC'
          }}
        >
          <img
            src={VectorRight}
            alt=""
            className="absolute left-0 top-4 -translate-y-1/2 w-[63px] h-[64px]"
          />
          <img
            src={VectorLeft}
            alt=""
            className="absolute right-3 top-16 -translate-y-1/2 w-[63px] h-[64px]"
          />
          <span className="relative z-10 text-[18px] leading-[1.6] font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Mejora tu plan</span>
        </Button>
      </div>

      <div className="px-4 pb-6">
        <div
          className="bg-card p-3 rounded-[12px] flex items-center gap-4 border border-[#34324a] transition-colors cursor-pointer relative"
        >
          <div className="relative w-10 h-10 rounded-full bg-[#312465] flex items-center justify-center">
            <div className="absolute bottom-0 right-0 w-[10px] h-[10px] rounded-[5px] bg-[#6FE36B] border-[1.5px] border-sidebar"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] leading-[20px] font-semibold text-[#F5F5FF] truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{userName}</p>
            <p className="text-[14px] leading-[20px] text-[#444358] truncate" style={{ fontFamily: "'Inter', sans-serif" }}>{email}</p>
          </div>
          <img
            src={NavAccountMenuIcon}
            alt="Menu"
            className="w-8 h-8 flex-shrink-0 cursor-pointer svg-icon"
          />
        </div>
      </div>
    </aside>
  );
};
