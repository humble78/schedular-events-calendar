import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { CalendarState, useCalendar } from "./store";
import { Columns2, Grid3X3, List } from "lucide-react";

export const CalendarMode = () => {
    const { setMode, mode } = useCalendar();

    function selectCalendarMode(mode: CalendarState['mode']) {
        setMode(mode);
    }

    return (
        <div className="inline-flex">
            <Button
                variant={"outline"}
                onClick={() => selectCalendarMode('day')}
                className={cn(
                    "rounded-e-none dark:border-zinc-700",
                    mode === 'day' && 'bg-accent'
                )}>
                <List />
                <span className="hidden xl:block">Day</span>
            </Button>
            <Button
                variant={"outline"}
                onClick={() => selectCalendarMode('week')}
                className={cn(
                    "hidden md:flex rounded-none border-x-0 dark:border-zinc-700",
                    mode === 'week' && 'bg-accent'
                )}>
                <Columns2 />
                <span className="hidden xl:block">Week</span>
            </Button>
            <Button
                variant={"outline"}
                onClick={() => selectCalendarMode('month')}
                className={cn(
                    "rounded-s-none dark:border-zinc-700",
                    mode === 'month' && 'bg-accent'
                )}>
                <Grid3X3 />
                <span className="hidden xl:block">Month</span>
            </Button>
        </div>
    );
}