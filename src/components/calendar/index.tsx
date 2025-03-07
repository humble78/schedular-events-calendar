'use client';

import { CalendarProvider, Month } from "./month";
import { Week } from "./week";
import { useCalendar } from "./store";
import { CalendarHeader } from "./header";
import { FC } from "react";
import { Day } from "./day";
import { ListEvents } from "./list";
import { Event } from "./types";

interface EventsCalendarProps {
    events: Event[]
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getEventsWithCurrentTimeZone(events: Event[]) {
    const date = new Date();

    return events.map((event) => {
        const eventStartDate = new Date(new Date(event.startedAt).getTime() + date.getTimezoneOffset() * 60000);
        const eventEndDate = new Date(new Date(event.endedAt).getTime() + date.getTimezoneOffset() * 60000);

        return {
            id: event.id,
            name: event.name,
            startedAt: eventStartDate,
            endedAt: eventEndDate,
        }
    });
}

export const EventsCalendar: FC<EventsCalendarProps> = ({ events }) => {
    const { mode, isListView, filter } = useCalendar();

    // const updatedEvents = getEventsWithCurrentTimeZone(events);
    const updatedEvents = events.filter((event) => {
        return filter.includes(event.status);
    });

    return (
        <div className="flex flex-1 [&>*]:w-full">
            <CalendarProvider>
                <CalendarHeader />
                {
                    isListView ?
                        <ListEvents events={updatedEvents} />
                        :
                        (
                            <>
                                {mode === 'week' && <Week events={updatedEvents} />}
                                {mode === 'month' && <Month events={updatedEvents} />}
                                {mode === 'day' && <Day events={updatedEvents} />}
                            </>
                        )
                }
            </CalendarProvider>
        </div>
    );
}