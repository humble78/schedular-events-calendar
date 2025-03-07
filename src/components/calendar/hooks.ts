import { addDays, endOfMonth, getDay, getDaysInMonth, isSameDay, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { useCalendar } from "./store";
import { Event } from "./types";

export const getTopPosition = (time: Date): number => {
    const minutesFromMidnight = time.getHours() * 60 + time.getMinutes();
    return (minutesFromMidnight / 60) * 96; // 96px per hour
};

export const getHeight = (startTime: Date, endTime: Date): number => {
    const durationInMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    return (durationInMinutes / 60) * 96; // 96px per hour
};

export const getWeekDates = (date: Date): Date[] => {
    const startDate = startOfWeek(date, { weekStartsOn: 1 });
    const weekDates: Date[] = [];

    for (let i = 0; i < 7; i++) {
        weekDates.push(addDays(startDate, i));
    }

    return weekDates;
}

export const monthsForLocale = (
    localeName: Intl.LocalesArgument,
    monthFormat: Intl.DateTimeFormatOptions['month'] = 'long'
) => {
    const format = new Intl.DateTimeFormat(localeName, { month: monthFormat })
        .format;

    return [...new Array(12).keys()].map((m) =>
        format(new Date(Date.UTC(2021, (m) % 12)))
    );
};

// type Color = 'red' | 'yellow' | 'green' | 'gray' | 'purple' | 'blue';

// export const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'gray'];

// export const getColorClass = (color: string): string => {
//     const colorClasses: Record<Color, string> = {
//         red: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
//         yellow: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
//         green: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
//         gray: 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300',
//         purple: 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-300',
//         blue: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
//     };
//     return colorClasses[color as Color] || '';
// };

// export const getBgColor = (color: string): string => {
//     const colorClasses: Record<Color, string> = {
//         red: 'bg-red-400 dark:bg-red-600',
//         yellow: 'bg-yellow-400 dark:bg-yellow-600',
//         green: 'bg-green-400 dark:bg-green-600',
//         gray: 'bg-gray-400 dark:bg-gray-600',
//         purple: 'bg-purple-400 dark:bg-purple-600',
//         blue: 'bg-blue-400 dark:bg-blue-600',
//     };
//     return colorClasses[color as Color] || '';
// };


type Color = 'red' | 'yellow' | 'green' | 'blue';

export const colors = ['red', 'blue', 'green', 'yellow'];

export const getColorClass = (color: string): string => {
    const colorClasses: Record<Color, string> = {
        red: 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300',
        yellow: 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300',
        green: 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300',
        blue: 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300',
    };
    return colorClasses[color as Color] || '';
};

export const getBgColor = (color: string): string => {
    const colorClasses: Record<Color, string> = {
        red: 'bg-red-400 dark:bg-red-600',
        yellow: 'bg-yellow-400 dark:bg-yellow-600',
        green: 'bg-green-400 dark:bg-green-600',
        blue: 'bg-blue-400 dark:bg-blue-600',
    };
    return colorClasses[color as Color] || '';
};

export const useCalendarDays = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(new Date(year, month, 1));
    const firstDay = getDay(new Date(year, month, 0));
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const prevMonthDays = getDaysInMonth(new Date(prevMonthYear, prevMonth, 1));
    const prevMonthDaysArray = Array.from(
        { length: prevMonthDays },
        (_, i) => i + 1
    );
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    const nextMonthDays = getDaysInMonth(new Date(nextMonthYear, nextMonth, 1));
    const nextMonthDaysArray = Array.from(
        { length: nextMonthDays },
        (_, i) => i + 1
    );

    return {
        daysInMonth,
        firstDay,
        prevMonthDaysArray,
        prevMonthDays,
        nextMonthDaysArray,
    };
};

export const getEventsForDay = (events: Event[], date: Date, isWeek = false): Event[] => {
    return events.filter((event) => {
        const startDate = startOfDay(event.startedAt);
        const endDate = startOfDay(event.endedAt);
        const targetDate = startOfDay(date);

        if (isWeek) return (event.startedAt.getDate() !== event.endedAt.getDate()) && (startDate <= targetDate && endDate >= targetDate);
        else return startDate <= targetDate && endDate >= targetDate;
    }).map((event) => {
        let point = undefined;

        if (isSameDay(new Date(event.startedAt).setHours(0, 0, 0, 0), new Date(event.endedAt).setHours(0, 0, 0, 0))) {
            point = 'none';
        } else if (isSameDay(new Date(event.startedAt).setHours(0, 0, 0, 0), new Date(date))) {
            point = 'start';
        } else if (isSameDay(new Date(event.endedAt).setHours(0, 0, 0, 0), new Date(date))) {
            point = 'end';
        }

        return {
            ...event,
            point,
        };
    }) as Event[];
};

export const getEventsForWeek = (events: Event[], date: Date): Event[] => {
    const weekDates = getWeekDates(date);
    const startOfWeek = weekDates[0];
    const endOfWeek = weekDates[6];

    return events.filter((event) => {
        return event.startedAt <= endOfWeek && event.endedAt >= startOfWeek;
    });
}

export const getEventsForMonth = (events: Event[], date: Date): Event[] => {
    const startOfMonthDate = startOfMonth(date);
    const endOfMonthDate = endOfMonth(date);

    return events.filter((event) => {
        return event.startedAt < endOfMonthDate && event.endedAt > startOfMonthDate;
    });
}

export const useGetEventsByMode = (events: Event[]) => {
    const { mode, date } = useCalendar();

    switch (mode) {
        case 'day': {
            return getEventsForDay(events, date);
        }
        case 'week': {
            return getEventsForWeek(events, date);
        }
        case 'month': {
            return getEventsForMonth(events, date);
        }
    }
}