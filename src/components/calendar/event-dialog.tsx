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
import { Calendar, Clock4 } from "lucide-react"
import { format } from "date-fns"

export const EventDialog = () => {
    const { isShowEventDialog, setIsShowEventDialog, selectEvent } = useCalendar();

    return (
        <Dialog onOpenChange={setIsShowEventDialog} open={isShowEventDialog} modal defaultOpen={isShowEventDialog} >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{selectEvent?.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="dark:text-gray-300 flex items-start gap-2">
                        <Calendar size={20} />
                        <div>
                            <p className="text-sm font-medium">Start Date</p>
                            <p className="text-sm text-t-secondary">
                                {selectEvent && format(selectEvent?.startedAt, 'MMM d, yyyy HH:mm')}
                            </p>
                        </div>
                    </div>
                    <div className="dark:text-gray-300 flex items-start gap-2">
                        <Clock4 size={20} />
                        <div>
                            <p className="text-sm font-medium">End Date</p>
                            <p className="text-sm text-t-secondary">
                                {selectEvent && format(selectEvent?.endedAt, 'MMM d, yyyy HH:mm')}
                            </p>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        type="button"
                        onClick={() => setIsShowEventDialog(!isShowEventDialog)}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
