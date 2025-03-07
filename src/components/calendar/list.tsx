import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";
import { FC } from "react";
import { getBgColor, getColorClass, useGetEventsByMode } from "./hooks";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { format } from "date-fns";
import { Repeat } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCalendar } from "./store";
import { Event } from "./types";

const getFirstLetters = (str: string): string => {
    const words = str.split(" ");

    if (words.length < 2) {
        return str;
    }

    const firstLetterFirstWord = words[0].charAt(0);
    const firstLetterSecondWord = words[1].charAt(0);

    return `${firstLetterFirstWord}${firstLetterSecondWord}`;
};

interface ListEventsProps {
    events: Event[];
}

export const ListEvents: FC<ListEventsProps> = ({ events }) => {
    const { isShowEventDialog, setIsShowEventDialog, setSelectEvent } = useCalendar();
    const eventsByMode = useGetEventsByMode(events);

    return (
        <Command className="py-4 h-[40rem]">
            <div className="mb-4 mx-4 rounded-lg border shadow-md">
                <CommandInput placeholder="Type a command or search..." />
            </div>
            <CommandList className="max-h-max px-3">
                <CommandGroup>
                    {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        eventsByMode.map((event, index) => {
                            return (
                                <CommandItem
                                    key={event.id}
                                    onSelect={() => {
                                        setSelectEvent(event);
                                        setIsShowEventDialog(!isShowEventDialog);
                                    }}
                                    className={cn(
                                        "mb-2 p-4 border rounded-md data-[selected=true]:bg-bg data-[selected=true]:text-none",
                                        getColorClass(event.status)
                                    )}>
                                    <div className="w-full flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-2">
                                            <Avatar>
                                                <AvatarImage src="" alt="@shadcn" />
                                                <AvatarFallback className={getBgColor(event.status)}>
                                                    {getFirstLetters(event.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <p>{event.name}</p>
                                        </div>
                                        <div className="w-40 sm:w-auto flex items-center gap-4">
                                            <p className="flex flex-wrap">
                                                <span className="block">
                                                    {format(event.startedAt, "MMMM d, ")}
                                                </span>
                                                <span className="block">
                                                    {format(event.startedAt, "HH:mm")}
                                                </span>
                                            </p>
                                            <Repeat />
                                            <p className="flex flex-wrap">
                                                <span className="block">
                                                    {format(event.endedAt, "MMMM d, ")}
                                                </span>
                                                <span className="block">
                                                    {format(event.endedAt, "HH:mm")}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </CommandItem>
                            );
                        })}
                </CommandGroup>
                <CommandEmpty>No results found.</CommandEmpty>
            </CommandList>
        </Command>
    );
};