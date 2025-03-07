'use client'

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Event } from "./types";
import { immer } from 'zustand/middleware/immer'

export type CalendarState = {
    mode: 'day' | 'week' | 'month';
    date: Date;
    dateForDayDialog?: Date;
    selectEvent?: Event;
    dayEvents: Event[];
    isShowEventDialog: boolean;
    isShowDayDialog: boolean;
    isListView: boolean;
    eventsCount: number;
    filter: string[];
    setMode: (mode: CalendarState['mode']) => void;
    setDate: (date: Date) => void;
    setDateForDayDialog: (dateForDayDialog: Date) => void;
    setSelectEvent: (selectEvent: Event) => void;
    setDayEvents: (dayEvents: Event[]) => void;
    setIsShowEventDialog: (isShowEventDialog: boolean) => void;
    setIsShowDayDialog: (isShowDayDialog: boolean) => void;
    setIsListView: (isListView: boolean) => void;
    setEventsCount: (eventsCount: number) => void;
    setFilter: (filter: string[]) => void;
};


export const useCalendar = create<CalendarState>()(
    devtools(immer((set) => ({
        mode: 'month',
        date: new Date(),
        dayEvents: [],
        isShowEventDialog: false,
        isShowDayDialog: false,
        isListView: false,
        eventsCount: 0,
        filter: [
            'green',
            'yellow',
            'blue',
            'red',
        ],
        setMode: (mode: CalendarState['mode']) => set({ mode }),
        setDate: (date: Date) => set({ date }),
        setDateForDayDialog: (dateForDayDialog: Date) => set({ dateForDayDialog }),
        setSelectEvent: (selectEvent: Event) => set({ selectEvent }),
        setDayEvents: (dayEvents: Event[]) => set({ dayEvents }),
        setIsShowEventDialog: (isShowEventDialog: boolean) => set({ isShowEventDialog }),
        setIsShowDayDialog: (isShowDayDialog: boolean) => set({ isShowDayDialog }),
        setIsListView: (isListView: boolean) => set({ isListView }),
        setEventsCount: (eventsCount: number) => set({ eventsCount }),
        setFilter: (filter: string[]) => set({ filter }),
    })))
);