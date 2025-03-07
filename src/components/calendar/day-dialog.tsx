'use client';

import { Button } from "../ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"
import { useCalendar } from "./store"
import { Repeat } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils";
import { getColorClass } from "./hooks";

export const DayDialog = () => {
    const { isShowDayDialog, setIsShowDayDialog, dayEvents, dateForDayDialog } = useCalendar();

    return (
        <Dialog onOpenChange={setIsShowDayDialog} open={isShowDayDialog} modal defaultOpen={isShowDayDialog} >
            <DialogContent className="sm:max-w-[40rem] flex-1">
                <DialogHeader>
                    <DialogTitle>
                        {dateForDayDialog && format(dateForDayDialog, 'MMMM d, yyyy')}
                    </DialogTitle>
                </DialogHeader>
                <div className="py-2 space-y-4">
                    {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        dayEvents.map((event, index) => {
                            return (
                                <div
                                    key={event.id}
                                    className={cn(
                                        "mb-2 p-4 border rounded-md",
                                        getColorClass(event.status)
                                    )}>
                                    <div className="flex-1 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            {/* <Avatar>
                                        <AvatarImage src="" alt="@shadcn" />
                                        <AvatarFallback className={getBgColor(colors[index % colors.length])}>
                                            {getFirstLetters(event.name)}
                                        </AvatarFallback>
                                    </Avatar> */}
                                            <p className="whitespace-break-spaces truncate">{event.name}</p>
                                        </div>
                                        <p className="whitespace-nowrap flex flex-col items-center gap-2 min-[450px]:flex-row">
                                            <span className="whitespace-nowrap">
                                                {format(event.startedAt, "d, HH:mm")}
                                            </span>
                                            <Repeat className="size-4" />
                                            <span className="whitespace-nowrap">
                                                {format(event.endedAt, "d, HH:mm")}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <DialogFooter className="flex-1">
                    <Button
                        type="button"
                        onClick={() => setIsShowDayDialog(!isShowDayDialog)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
