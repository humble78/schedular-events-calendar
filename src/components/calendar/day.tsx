'use client';

import { FC, ReactNode, useEffect, useState } from "react";
import { useCalendar } from "./store";
import { getColorClass, getEventsForDay, getTopPosition } from "./hooks";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ColumnDay } from "./column-day";
import { Calendar } from "../ui/calendar";
import { SelectSingleEventHandler } from "react-day-picker";
import { cn } from "@/lib/utils";
import { differenceInDays, format, isSameDay } from "date-fns"
import { Event } from "./types";

interface DayProps {
    events: Event[],
}

type SetCeilDayProps = {
    events: Event[];
};

const CeilDay: FC<SetCeilDayProps> = ({ events }) => {
    const { date, isShowEventDialog, setIsShowEventDialog, setSelectEvent } = useCalendar();

    return (
        <div
            className={cn(
                "flex flex-1 flex-col gap-1 border-l py-1",
            )}
        >
            {events.map((event, index) => {
                const totalDays = differenceInDays(event.endedAt, event.startedAt) + 1;
                const dayOfEvent = totalDays - differenceInDays(event.endedAt, date);

                return (
                    <div
                        key={index}
                        role="button"
                        onClick={() => {
                            setSelectEvent(event);
                            setIsShowEventDialog(!isShowEventDialog);
                        }}
                        className={cn(
                            "mx-1 flex size-auto h-7 select-none items-center justify-between gap-1.5 truncate whitespace-nowrap rounded-md border px-2 text-xs",
                            getColorClass(event.status),
                        )}>

                        <p className="flex-1 truncate font-semibold">
                            <span className="text-xs">Day {dayOfEvent} of {totalDays} • </span>
                            {event.name}
                        </p>
                        <span>
                            {format(event.startedAt, "HH:mm")}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

export const Day: FC<DayProps> = ({ events }) => {
    const { date, setDate, setEventsCount } = useCalendar();
    const [currentTime, setCurrentTime] = useState(new Date());

    const currentTimeTopPosition = getTopPosition(currentTime);
    const dayEvents = getEventsForDay(events, date);
    const ceilDayEvents = dayEvents.filter((event) => {
        return event.startedAt.getDate() !== event.endedAt.getDate();
    });
    const days: ReactNode = <CeilDay events={ceilDayEvents} />;;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setEventsCount(dayEvents.length);
    }, [dayEvents.length, setEventsCount]);

    return (
        <div className="flex border-b lg:border-b-0">
            <div className="flex flex-1 flex-col">
                <div>
                    {dayEvents.length !== 0 && (<div className="flex border-b">
                        <div className="w-[4.5rem]"></div>
                        {
                            days
                        }
                    </div>)}

                    <div className="relative z-20 flex border-b shadow-calendar dark:shadow-calendar-dark">
                        <div className="w-[4.5rem]"></div>
                        <div className="flex-1 border-l py-2 text-center">
                            <span className="text-xs font-medium capitalize leading-7">
                                <span className="text-gray-400">
                                    {date.toLocaleDateString(undefined, { weekday: 'short' })}
                                </span>
                                <span className="font-semibold"> {date.getDate()}</span>
                            </span>
                        </div>
                    </div>
                </div>
                {/* <div className="relative h-[736px]"> */}
                <ScrollArea className="h-[736px]">
                    <div className="flex">
                        <div className="relative w-[4.5rem]">
                            {Array.from({ length: 24 }).map((_, hour) => (
                                <div key={hour} className="relative" style={{ height: '96px' }}>
                                    <div className="absolute -top-3 right-2 flex h-6 items-center">
                                        <span className="text-xs text-gray-400">
                                            {hour === 0 ? '' : hour < 10 ? `0${hour}:00` : `${hour}:00`}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="relative flex-1 flex">
                            {isSameDay(currentTime, date) && (<div
                                className="pointer-events-none absolute inset-x-0 z-50 border-t border-blue-700 dark:border-blue-700"
                                style={{ top: `${currentTimeTopPosition}px` }}
                            >
                                <div className="absolute -left-1.5 -top-1.5 size-3 rounded-full bg-blue-600 dark:bg-blue-700"></div>
                                <div className="absolute -left-[4.5rem] flex w-16 -translate-y-1/2 justify-end pr-1 text-xs font-medium text-blue-600 dark:text-blue-700 dark:bg-black bg-white">
                                    {format(currentTime, 'HH:mm')}
                                </div>
                            </div>)}
                            <div className="flex-1 divide-x border-l">
                                {
                                    Array.from({ length: 1 }).map((_, index) => {
                                        const currentDateStart = new Date(date);
                                        currentDateStart.setHours(0, 0, 0);
                                        const currentDateEnd = new Date(date);
                                        currentDateEnd.setHours(23, 59, 59);

                                        const events = dayEvents.filter((event) => {
                                            return (
                                                event.startedAt >= currentDateStart &&
                                                event.endedAt <= currentDateEnd
                                            );
                                        });

                                        return (
                                            <ColumnDay key={index} data={events} />
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <ScrollBar />
                </ScrollArea>
                {/* </div> */}
            </div>
            <div className="hidden w-72 divide-y border-l md:block">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate as SelectSingleEventHandler}
                    className="mx-auto w-fit"
                />
                <div className="flex-1 p-5">
                    <p className="text-sm text-zinc-400">No events scheduled for now</p>
                </div>
            </div>
        </div>
    );
};