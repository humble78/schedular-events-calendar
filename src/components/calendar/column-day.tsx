import { Event } from './types';
import React, { useMemo } from 'react';
import { getColorClass, getHeight, getTopPosition } from './hooks';
import { useCalendar } from './store';
import { cn } from '@/lib/utils';

interface ColumnDayProps {
    data: Event[],
    className?: string,
}

// const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'gray'];

export const ColumnDay: React.FC<ColumnDayProps> = ({ data, className }) => {
    const { isShowEventDialog, setIsShowEventDialog, setSelectEvent } = useCalendar();

    const groupEventsByTime = (events: Event[]): Event[][] => {
        const groupedEvents: Event[][] = [];
        events.sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());

        events.forEach(event => {
            let placed = false;
            for (const group of groupedEvents) {
                const overlaps = group.some(existingEvent =>
                    (new Date(event.startedAt) < new Date(existingEvent.endedAt) && new Date(event.endedAt) > new Date(existingEvent.startedAt))
                );
                if (overlaps) {
                    group.push(event);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                groupedEvents.push([event]);
            }
        });
        return groupedEvents;
    };

    const groupedEvents = useMemo(() => groupEventsByTime(data), [data]);

    return (
        <div
            className={
                cn(
                    "relative",
                    className,
                )
            }
            style={{ height: '2304px' }}> {/* 24 hours * 96px per hour */}
            {Array.from({ length: 24 }).map((_, index) => (
                <div key={index} className="relative h-24 border-b">
                    <div className="absolute inset-x-0 top-1/2 border-b border-dashed border-b-tertiary"></div>
                </div>
            ))}
            {groupedEvents.map((group) =>
                group.map((event, index) => (
                    <div
                        key={index}
                        className="absolute p-1"
                        style={{
                            top: `${getTopPosition(event.startedAt)}px`,
                            height: `${getHeight(event.startedAt, event.endedAt)}px`,
                            width: `${100 / group.length}%`,
                            left: `${(100 / group.length) * index}%`,
                        }}
                    >
                        <div
                            role="button"
                            onClick={() => {
                                setSelectEvent(event);
                                setIsShowEventDialog(!isShowEventDialog);
                            }}
                            className={`h-full flex flex-col gap-0.5 truncate whitespace-nowrap rounded-md border px-2 py-1.5 text-xs focus:outline-none ${getColorClass(event.status)}`}
                        >
                            <p className="truncate font-semibold">{event.name}</p>
                            <p>{event.startedAt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })} - {event.endedAt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};