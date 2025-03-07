"use client"

import { Button } from "../ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { getBgColor } from "./hooks"
import { useState } from "react"
import { useCalendar } from "./store"

export const CalendarFilter = () => {
    const { filter, setFilter } = useCalendar();
    const [isOpen, setIsOpen] = useState(false);
    const colors = ['green', 'yellow', 'blue', 'red'];

    const handleCheckboxChange = (color: string, checked: boolean) => {
        if (checked) {
            setFilter([...filter, color]);
        } else {
            setFilter(filter.filter(value => value !== color));
        }
    };

    return (
        <DropdownMenu open={isOpen} defaultOpen={isOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" onClick={() => setIsOpen(!isOpen)}>
                    <Filter />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-max"
                onPointerDownOutside={() => setIsOpen(false)}
            >
                <DropdownMenuLabel>Filter by color</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div>
                    {colors.map(color => (
                        <DropdownMenuCheckboxItem
                            key={color}
                            checked={filter.includes(color)}
                            onCheckedChange={(checked) => handleCheckboxChange(color, checked)}
                            className="gap-2"
                        >
                            <span className={cn("size-4 rounded-full", getBgColor(color))}></span>
                            <span>{color.charAt(0).toUpperCase() + color.slice(1)}</span>
                        </DropdownMenuCheckboxItem>
                    ))}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
