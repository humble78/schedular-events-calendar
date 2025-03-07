import { CalendarRange, LayoutList } from "lucide-react";
import { Button } from "../ui/button";
import { CalendarDatePagination } from "./pagination";
import { useCalendar } from "./store";
import { format } from "date-fns";
import { Badge } from "../ui/badge";
import { CalendarFilter } from "./fliter";
import { CalendarMode } from "./mode";

export const CalendarHeader = () => {
    const { setDate, date, isListView, setIsListView, eventsCount } = useCalendar();
    const today = new Date();

    function handleClickTodayDate() {
        setDate(today);
    }

    return (
        <div className="flex-1 flex flex-wrap gap-4 border-b p-4 items-center justify-between">
            <div className="flex items-center gap-3">
                <button
                    onClick={handleClickTodayDate}
                    className="flex size-16 flex-col items-start overflow-hidden rounded-lg border">
                    <p className="flex h-6 w-full items-center justify-center bg-blue-600 text-center font-semibold text-white">
                        {today.toLocaleDateString(undefined, {
                            month: 'short'
                        })}
                    </p>
                    <p className="py-1 flex w-full items-center justify-center text-lg font-bold">
                        {today.getDate()}
                    </p>
                </button>
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold">{format(date, 'MMMM yyyy')}</span>
                        <Badge variant="outline" className="text-xs font-medium whitespace-nowrap">{eventsCount} Events</Badge>
                    </div>
                    <CalendarDatePagination />
                </div>
            </div>
            <div className="inline-flex gap-4">
                <div className="inline-flex gap-2">
                    <CalendarFilter />
                    <Button
                        variant="outline"
                        onClick={() => setIsListView(!isListView)}
                        className="size-min"
                    >
                        {
                            isListView ?
                                <CalendarRange />
                                :
                                <LayoutList />
                        }
                    </Button>
                </div>
                <CalendarMode />
            </div>
        </div>
    );
}