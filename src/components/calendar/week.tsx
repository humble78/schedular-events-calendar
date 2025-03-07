'use client';

import { FC, ReactNode, useEffect, useState } from 'react';
import { ColumnDay } from './column-day';
import { format, isSameDay } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import { getColorClass, getEventsForDay, getEventsForWeek, getTopPosition, getWeekDates } from './hooks';
import { HeaderLineWeek } from './month';
import { useCalendar } from './store';
import { cn } from '@/lib/utils';
import { Event } from './types';

type SetCeilDayWeekProps = {
    events: Event[];
    date: Date;
    maxSlots: number;
};

let prevEventsForWeek: Array<Event | undefined> = [];

const setCeilWeekDay = ({ events, date, maxSlots }: SetCeilDayWeekProps) => {
    const eventsForDay = getEventsForDay(events, date, true);
    const slots: Array<Event | undefined> = new Array(maxSlots).fill(undefined);

    eventsForDay.forEach((event, index) => {
        const slotIndex = prevEventsForWeek.findIndex(
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

            if (index === 2) {
                return;
            }

            if (freeSlotIndex !== -1) {
                slots[freeSlotIndex] = event;
            }
        }
    });

    prevEventsForWeek = slots;

    return (
        <div
            key={date.getDate()}
            className={cn(
                "flex h-full flex-col gap-1 py-1",
            )}
        >
            {slots.map((event, index) => {
                if (!event) return (
                    <div key={index} className="h-7"></div>
                );

                return (
                    <CeilWeekDayItem key={index} event={event} index={index} />
                );

            })}
        </div>
    );
};

type CeilWeekDayItemProps = {
    event: Event;
    index: number;
    className?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const CeilWeekDayItem = ({ event, className, index }: CeilWeekDayItemProps) => {
    const { isShowEventDialog, setIsShowEventDialog, setSelectEvent } = useCalendar();

    const commonClasses = `cursor-pointer h-7 select-none items-center justify-between gap-1.5 truncate whitespace-nowrap border rounded-md px-2 text-xs flex`;

    const renderContent = (additionalClasses = '', displayName = true, displayTime = true) => (
        <>
            <div
                className={cn(
                    `mx-1 relative z-10 ${additionalClasses}`,
                    getColorClass(event.status),
                    className,
                )}
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

interface WeekProps {
    events: Event[],
}

export const Week: FC<WeekProps> = ({ events }) => {
    const { date, setEventsCount } = useCalendar();
    const weekDates = getWeekDates(date);
    const weekEvents = getEventsForWeek(events, date);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setEventsCount(weekEvents.length);
    }, [weekEvents.length]);

    let maxSlots = 0;
    const daysData = weekDates.map((date) => {
        const eventsForDay = getEventsForDay(weekEvents, date, true);
        if (eventsForDay.length > maxSlots) {
            maxSlots = eventsForDay.length;
        }
        return { date, eventsForDay };
    });

    const days: ReactNode[] = daysData.map(({ date, eventsForDay }) =>
        setCeilWeekDay({
            events: eventsForDay,
            date: date,
            maxSlots: maxSlots,
        })
    );

    const condition = weekEvents.length !== 0 && weekEvents.some((event) => {
        return !isSameDay(event.startedAt, event.endedAt);
    });

    const currentTimeTopPosition = getTopPosition(currentTime);

    return (
        <>
            <div className="flex flex-col items-center justify-center border-b py-4 text-sm text-gray-400 sm:hidden">
                <p>Week view is not available on smaller devices.</p>
                <p>Please switch to day or month view.</p>
            </div>
            <div className="hidden flex-col border-b sm:flex lg:border-b-0">
                {condition && (<div className="hidden overflow-hidden sm:flex border-b">
                    <div className="w-[4.5rem]"></div>
                    <div className="grid h-max flex-1 grid-cols-7 divide-x border-l">
                        {
                            days
                        }
                    </div>
                </div>)}
                <div className="relative z-20 flex border-b shadow-calendar dark:shadow-calendar-dark">
                    <div className="w-[4.5rem]"></div>
                    <HeaderLineWeek isMonth={false} />
                </div>
                <div className="relative h-[736px]">
                    <ScrollArea className="size-full">
                        <div className="flex">
                            <div className="relative w-[4.5rem]">
                                {Array.from({ length: 24 }).map((_, hour) => (
                                    <div key={hour} className="relative" style={{ height: '96px' }}>
                                        <div className="absolute -top-3 right-2 flex h-6 items-center">
                                            <span className="text-xs text-t-quaternary">
                                                {hour === 0 ? '' : hour < 10 ? `0${hour}:00` : `${hour}:00`}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="relative flex-1">
                                {weekDates[0] <= currentTime && currentTime <= weekDates[6] && (<div
                                    className="pointer-events-none absolute inset-x-0 z-50 border-t border-blue-700 dark:border-blue-700"
                                    style={{ top: `${currentTimeTopPosition}px` }}
                                >
                                    <div className="absolute -left-1.5 -top-1.5 size-3 rounded-full bg-blue-600 dark:bg-blue-700"></div>
                                    <div className="absolute -left-[4.5rem] flex w-16 -translate-y-1/2 justify-end pr-1 text-xs font-medium text-blue-600 dark:text-blue-700 dark:bg-black bg-white">
                                        {format(currentTime, 'HH:mm')}
                                    </div>
                                </div>)}
                                <div className="grid grid-cols-7 divide-x border-l">
                                    {
                                        Array.from({ length: 7 }).map((_, index) => {
                                            const date = weekDates[index];
                                            const currentDateStart = new Date(date);
                                            currentDateStart.setHours(0, 0, 0);
                                            const currentDateEnd = new Date(date);
                                            currentDateEnd.setHours(23, 59, 59);

                                            const dayEvents = weekEvents.filter((event) => {
                                                return (
                                                    event.startedAt >= currentDateStart &&
                                                    event.endedAt <= currentDateEnd
                                                );
                                            });

                                            return (
                                                <ColumnDay
                                                    key={index}
                                                    data={dayEvents}
                                                // className='min-w-32'
                                                />
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </>
    );
};