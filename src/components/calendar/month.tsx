'use client';

import { cn } from '@/lib/utils';
import { useEffect, type ReactNode } from 'react';
import { getBgColor, getColorClass, getEventsForDay, getEventsForMonth, getWeekDates, useCalendarDays } from './hooks';
import { useCalendar } from './store';
import { createContext } from "react";
import { isSameDay } from 'date-fns';
import { Event } from './types';

type CalendarContextProps = {
    locale: Intl.LocalesArgument;
};

export const CalendarContext = createContext<CalendarContextProps>({
    locale: 'en-US',
});

type SetCeilDayMonthProps = {
    events: Event[];
    date: Date;
    isOutOfBoundsDay: boolean;
    setDayEvents: (dayEvents: Event[]) => void;
    setDateForDayDialog: (dateForDayDialog: Date) => void;
    setIsShowDayDialog: (isShowDayDialog: boolean) => void;
    isShowDayDialog: boolean;
};

let prevEventsForMonth: Array<Event | undefined> = [];

const setCeilMonthDay = ({ events, date, isOutOfBoundsDay, setDayEvents, setDateForDayDialog, setIsShowDayDialog, isShowDayDialog }: SetCeilDayMonthProps) => {
    const slots: Array<Event | undefined> = new Array(3).fill(undefined);
    let moreCount = 0;

    events.forEach((event) => {
        const slotIndex = prevEventsForMonth.findIndex(
            (prevEvent, index) => {
                if ((!prevEvent && event.point === 'start')) {
                    return true;
                }
                if (prevEvent && (prevEvent.point === 'end' || prevEvent.point === 'none') && event.point === 'start' && !slots[index]) {
                    return true;
                }
                return (prevEvent && prevEvent.id === event.id);
            }
        );

        if (slotIndex !== -1 && !slots[slotIndex]) {
            slots[slotIndex] = event;
        } else {
            const freeSlotIndex = slots.findIndex((slot) => !slot);
            if (freeSlotIndex !== -1 && !prevEventsForMonth[freeSlotIndex] && (event.point === 'start' || event.point === 'none')) {
                slots[freeSlotIndex] = event;
            } else {
                moreCount++;
            }
        }
    });

    const day = (
        <div key={date.getDate()}
            className={cn(
                "relative py-1.5 flex h-max w-full flex-col gap-1 text-muted-foreground text-xs",
                isOutOfBoundsDay && 'bg-zinc-100 dark:bg-zinc-900',
            )}>
            <p className='h-5 pl-1.5 text-sm font-semibold'>
                <span className={cn(
                    'px-1 lg:px-2 lg:py-1',
                    !isOutOfBoundsDay && 'dark:text-white',
                    isSameDay(date, new Date()) && 'rounded-full text-white bg-black dark:text-black dark:bg-white'
                )}>
                    {date.getDate()}
                </span>
            </p>
            <div className={cn(
                "relative h-5 lg:h-24 flex gap-1 px-2 lg:flex-col lg:gap-2 lg:px-0",
            )}>
                {slots.map((event, index) => {
                    return (
                        <div key={index} className="lg:flex-1 lg:min-h-7">
                            {event && <CeilMonthDayItem event={event} index={index} />}
                        </div>
                    );
                })}
                <button
                    onClick={() => {
                        setDayEvents(events);
                        setDateForDayDialog(date);
                        setIsShowDayDialog(!isShowDayDialog);
                    }}
                    className="lg:hidden z-10 absolute size-full">
                </button>
            </div>

            {(moreCount > 0) ? (
                <p onClick={() => {
                    setDayEvents(events);
                    setDateForDayDialog(date);
                    setIsShowDayDialog(!isShowDayDialog);
                }}
                    className="cursor-pointer h-4 lg:mt-1 px-1.5 text-xs font-semibold text-t-quaternary opacity-50"
                >
                    <span className="sm:hidden">
                        +{moreCount}
                    </span>
                    <span className="hidden sm:inline">
                        +{moreCount} more
                    </span>
                </p>
            ) : (
                <p className="h-4 lg:mt-1"></p>
            )}
        </div >
    );

    prevEventsForMonth = slots;
    return day;
};

type MonthProps = {
    events: Event[];
};

export const Month = ({ events }: MonthProps) => {
    const { date, setEventsCount, setDayEvents, setDateForDayDialog, setIsShowDayDialog, isShowDayDialog } = useCalendar();
    const month = date.getMonth();
    const year = date.getFullYear();
    const monthEvents = getEventsForMonth(events, date);
    const days: ReactNode[] = [];

    useEffect(() => {
        setEventsCount(monthEvents.length);
    }, [monthEvents.length]);

    const {
        daysInMonth,
        firstDay,
        prevMonthDaysArray,
        prevMonthDays,
        nextMonthDaysArray
    } = useCalendarDays(year, month);

    for (let i = 0; i < firstDay; i++) {
        const day = prevMonthDaysArray[prevMonthDays - firstDay + i];

        if (day) {
            const date = new Date(year, month - 1, day);
            const eventsForDay = getEventsForDay(monthEvents, date);
            days.push(setCeilMonthDay({
                events: eventsForDay,
                date: date,
                isOutOfBoundsDay: true,
                isShowDayDialog: isShowDayDialog,
                setDateForDayDialog: setDateForDayDialog,
                setDayEvents: setDayEvents,
                setIsShowDayDialog: setIsShowDayDialog,
            }));
        }
    }


    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const eventsForDay = getEventsForDay(monthEvents, date);
        days.push(setCeilMonthDay({
            date: date,
            events: eventsForDay,
            isOutOfBoundsDay: false,
            isShowDayDialog: isShowDayDialog,
            setDateForDayDialog: setDateForDayDialog,
            setDayEvents: setDayEvents,
            setIsShowDayDialog: setIsShowDayDialog,
        }));
    }

    const remainingDays = 7 - ((firstDay + daysInMonth) % 7);
    if (remainingDays < 7) {
        for (let i = 0; i < remainingDays; i++) {
            const day = nextMonthDaysArray[i];

            if (day) {
                const date = new Date(year, month + 1, day);
                const eventsForDay = getEventsForDay(monthEvents, date);
                days.push(setCeilMonthDay({
                    date: date,
                    events: eventsForDay,
                    isOutOfBoundsDay: true,
                    isShowDayDialog: isShowDayDialog,
                    setDateForDayDialog: setDateForDayDialog,
                    setDayEvents: setDayEvents,
                    setIsShowDayDialog: setIsShowDayDialog,
                }));
            }
        }
    }

    return (
        <>
            <HeaderLineWeek isMonth={true} />
            <div className="grid flex-grow grid-cols-7 overflow-hidden border-b lg:border-b-0">
                {days.map((day, index) => (
                    <div
                        key={index}
                        className={cn(
                            'relative aspect-auto overflow-hidden border-t border-l',
                            index % 7 === 0 && 'border-l-0'
                        )}
                    >
                        {day}
                    </div>
                ))}
            </div>
        </>
    );
};

type HeaderLineWeekProps = {
    className?: string;
    isMonth: boolean;
};

export const HeaderLineWeek = ({ className, isMonth }: HeaderLineWeekProps) => {
    const { date } = useCalendar();
    const weekDates = getWeekDates(date);

    return (
        <div className={cn(
            "grid flex-1 grid-cols-7 divide-x",
            !isMonth && "border-l",
            className
        )}>
            {weekDates.map((date, index) => {
                return (
                    <div key={index} className="flex flex-col items-center justify-center py-2">
                        <span className="text-xs font-medium text-t-quaternary capitalize">
                            {date.toLocaleDateString(undefined, { weekday: 'short' }) + ' '}
                            {!isMonth && <span className={cn(
                                "font-semibold text-t-secondary",
                                isSameDay(date, new Date()) && "px-2 py-0.5 rounded-full text-white bg-black dark:text-black dark:bg-white",
                            )}> {date.getDate()}</span>}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

type CalendarItemProps = {
    event: Event;
    index: number;
    className?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CeilMonthDayItem = ({ event, className, index }: CalendarItemProps) => {
    const { isShowEventDialog, setIsShowEventDialog, setSelectEvent } = useCalendar();
    const commonClasses = `cursor-pointer size-auto h-full select-none items-center justify-between gap-1.5 truncate whitespace-nowrap border rounded-md px-2 text-xs hidden lg:flex`;

    const renderContent = (additionalClasses = '', displayName = true, displayTime = true) => (
        <>
            <div className={
                cn(
                    'size-2 rounded-full lg:hidden',
                    getBgColor(event.status),
                )
            }>
            </div>
            <div
                className={
                    cn(
                        `mx-1 relative z-10 ${additionalClasses}`,
                        getColorClass(event.status),
                        className
                    )
                }
                key={event.id}
                onClick={() => {
                    setSelectEvent(event);
                    setIsShowEventDialog(!isShowEventDialog);
                }}
            >
                {displayName && <p className="truncate">{event.name}</p>}
                {displayTime && (
                    <span>
                        {event.startedAt.toLocaleTimeString(undefined, {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span>
                )}
            </div>
        </>
    );

    switch (event.point) {
        case 'none':
            return renderContent(`${commonClasses} rounded-md [&>span]:mr-2.5`);
        case 'start':
            return renderContent(`${commonClasses} mr-0 w-[calc(100%_+_1px)] rounded-r-none border-r-0 [&>span]:mr-2.5`);
        case 'end':
            return renderContent(`${commonClasses} ml-0 rounded-l-none border-l-0`, false, false);
        default:
            return renderContent(`${commonClasses} mx-0 w-[calc(100%_+_1px)] rounded-none border-x-0`, false, false);
    }
};

type CalendarProviderProps = {
    locale?: Intl.LocalesArgument;
    children: ReactNode;
    className?: string;
};

export const CalendarProvider = ({
    locale,
    children,
    className,
}: CalendarProviderProps) => (
    <CalendarContext.Provider value={{ locale }}>
        <div className={cn('overflow-hidden h-fit w-full lg:rounded-xl lg:border bg-background', className)}>{children}</div>
    </CalendarContext.Provider>
);
