export interface Event {
    id: string;
    startedAt: Date;
    endedAt: Date;
    name: string;
    status: string;
    point?: 'start' | 'end' | 'none',
}