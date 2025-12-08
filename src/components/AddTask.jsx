import { useState } from "react";
import { List } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { CheckCircleFilled } from "./CheckCircleFilled";
import { CheckCircleOutline } from "./CheckCircleOutline";
import { CheckIcon } from "./CheckIcon";
import { useAddItemToDefaultList, useAddItemToList } from "@/features/lists/hooks/useListItemsQuery";
import { useLists } from "@/features/lists/hooks/useListsQuery";

export const AddTask = ({ listId = null }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedListId, setSelectedListId] = useState(listId);
  const [listPopoverOpen, setListPopoverOpen] = useState(false);

  const { data: lists = [], isLoading: isLoadingLists } = useLists({
    status: 'ACTIVE',
    includeItems: false
  });

  const addToDefaultMutation = useAddItemToDefaultList();
  const addToListMutation = useAddItemToList();

  const handleSubmit = () => {
    if (!taskTitle.trim()) return;

    const itemData = {
      content: taskTitle.trim(),
      description: "",
      priority: "medium",
      metadata: {}
    };

    if (selectedListId) {
      addToListMutation.mutate(
        { listId: selectedListId, itemData },
        {
          onSuccess: () => {
            setTaskTitle("");
            setSelectedListId(listId);
          }
        }
      );
    } else {

      addToDefaultMutation.mutate(itemData, {
        onSuccess: () => {
          setTaskTitle("");
          setSelectedListId(null);
        }
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "Escape") {
      setTaskTitle("");
      setSelectedListId(listId);
    }
  };


  return (
    <div className="fixed bottom-0 left-0 right-0 lg:left-[280px] pb-2 pt-2 lg:pb-8 mt-8 z-40 pointer-events-none">
      <div className="max-w-4xl mx-auto px-6 lg:px-6 pointer-events-auto">
        <div className="bg-card rounded-[100px] h-[64px] flex items-center px-8 mb-20 lg:mb-0">
          <div className="flex items-center gap-4 flex-1">
            <Input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Agregar tarea"
              className="flex-1 bg-transparent border-0 outline-none h-auto text-[16px] leading-[1.5] font-normal placeholder:text-[#CDCEDF] focus-visible:ring-0 px-0"
              style={{ fontFamily: "'DM Sans', sans-serif" }} />

            <Popover open={listPopoverOpen} onOpenChange={setListPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-[40px] w-[40px] flex-shrink-0 rounded-[69px] bg-[#1C273E] hover:bg-[#1C273E]/80 p-0 cursor-pointer"
                >
                  <List className="w-5 h-5 text-foreground" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[324px] lg:w-[292px] p-0 bg-[#0F1521] rounded-[8px] border-0 mb-3" align="end" sideOffset={8}>
                <div className="p-0 bg-[#0F1521] rounded-[8px] overflow-hidden">
                  <div className="px-4 py-3 text-white text-[14px] leading-[20px] font-bold tracking-[0.56px] uppercase border-b border-[#34324a]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    MIS LISTAS
                  </div>
                  {isLoadingLists ? (
                    <div className="p-4 text-sm text-muted-foreground">Cargando listas...</div>
                  ) : (
                    <>
                      {lists.map((list, index) => (
                        <button
                          key={list.id}
                          onClick={() => {
                            setSelectedListId(list.id);
                            setListPopoverOpen(false);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3 text-white text-[16px] leading-[1.5] hover:bg-[#1C273E] transition-colors",
                            index < lists.length - 1 && "border-b border-[#34324a]"
                          )}
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          <span>{list.name}</span>
                          <div className="relative w-4 h-4 flex items-center justify-center">
                            {selectedListId === list.id ? (
                              <>
                                <CheckCircleFilled size={16} className="absolute" />
                                <CheckIcon size={12} className="absolute" />
                              </>
                            ) : (
                              <CheckCircleOutline size={16} className="absolute" />
                            )}
                          </div>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};
