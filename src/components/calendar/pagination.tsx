import { cn } from "@/lib/utils";
import { useCalendar } from "./store";
import { Button } from "../ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { subWeeks, addWeeks, subMonths, addMonths, startOfMonth, endOfMonth, format, startOfWeek, endOfWeek, subDays, addDays } from 'date-fns';

export type CalendarDatePaginationProps = {
    className?: string;
};

export const CalendarDatePagination = ({
    className,
}: CalendarDatePaginationProps) => {
    const { date, setDate, mode } = useCalendar();

    const handlePrevious = () => {
        switch (mode) {
            case 'day': {
                setDate(subDays(date, 1));
                break;
            }
            case 'week': {
                setDate(subWeeks(date, 1));
                break;
            }
            case 'month': {
                setDate(subMonths(date, 1));
                break;
            }
        }
    };

    const handleNext = () => {
        switch (mode) {
            case 'day': {
                setDate(addDays(date, 1));
                break;
            }
            case 'week': {
                setDate(addWeeks(date, 1));
                break;
            }
            case 'month': {
                setDate(addMonths(date, 1));
                break;
            }
        }
    };

    const formatDateRange = () => {
        const formatStr = 'MMM d, yyyy';

        switch (mode) {
            case 'day': {
                return format(date, formatStr);
            }
            case 'week': {
                const startDate = startOfWeek(date, { weekStartsOn: 1 });
                const endDate = endOfWeek(date, { weekStartsOn: 1 });
                return `${format(startDate, formatStr)} – ${format(endDate, formatStr)}`;
            }
            case 'month': {
                const startDate = startOfMonth(date);
                const endDate = endOfMonth(date);
                return `${format(startDate, formatStr)} – ${format(endDate, formatStr)}`;
            }
        }
    };

    return (
        <div className={cn('flex items-center gap-2', className)}>
            <Button onClick={() => handlePrevious()} variant="outline" size="icon">
                <ChevronLeftIcon size={16} />
            </Button>
            <span className="text-sm whitespace-nowrap text-zinc-500">
                {formatDateRange()}
            </span>
            <Button onClick={() => handleNext()} variant="outline" size="icon">
                <ChevronRightIcon size={16} />
            </Button>
        </div>
    );
};