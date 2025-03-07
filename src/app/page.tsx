'use client';

import {
  addDays,
} from 'date-fns';
import { EventsCalendar } from '@/components/calendar';
import { ModeToggle } from '@/components/change-theme';

const today = new Date();
const exampleFeatures = [
  {
    id: '1',
    name: 'AI Scene Analysis',
    startedAt: addDays(today, 2),
    endedAt: addDays(today, 4),
    status: 'blue',
  },
  {
    id: '2',
    name: 'Collaborative Editing',
    startedAt: today,
    endedAt: addDays(today, 3),
    status: 'green',
  },
  {
    id: '3',
    name: 'AI-Powered Color Grading',
    startedAt: addDays(today, 4),
    endedAt: addDays(today, 5),
    status: 'yellow',
  },
  {
    id: '4',
    name: 'blet',
    startedAt: addDays(today, 5),
    endedAt: addDays(today, 7),
    status: 'red',
  },
  {
    id: '5',
    name: 'Real-Time Collaboration Tool',
    startedAt: addDays(today, 8),
    endedAt: addDays(today, 10),
    status: 'blue',
  },
  {
    id: '6',
    name: 'Improved UI for Dashboard',
    startedAt: addDays(today, 11),
    endedAt: addDays(today, 12),
    status: 'yellow',
  },
  {
    id: '7',
    name: 'User Authentication Overhaul',
    startedAt: addDays(today, 14),
    endedAt: addDays(today, 16),
    status: 'green',
  },
  {
    id: '8',
    name: 'Video Streaming Service Integration',
    startedAt: addDays(today, 18),
    endedAt: addDays(today, 20),
    status: 'red',
  },
  {
    id: '9',
    name: 'Bug Fixes & Performance Improvements',
    startedAt: addDays(today, 22),
    endedAt: addDays(today, 23),
    status: 'blue',
  },
  {
    id: '10',
    name: 'Advanced Analytics Dashboard',
    startedAt: addDays(today, 25),
    endedAt: addDays(today, 28),
    status: 'yellow',
  },
  {
    id: '11',
    name: 'Bug Fixes for Mobile App',
    startedAt: addDays(today, 8),
    endedAt: addDays(today, 9),
    status: 'green',
  },
  {
    id: '12',
    name: 'Prototype New Feature Set',
    startedAt: addDays(today, 9),
    endedAt: addDays(today, 11),
    status: 'red',
  },
  {
    id: '13',
    name: 'Beta Testing Phase',
    startedAt: addDays(today, 12),
    endedAt: addDays(today, 15),
    status: 'blue',
  },
  {
    id: '14',
    name: 'Internal Documentation Update',
    startedAt: addDays(today, 15),
    endedAt: addDays(today, 16),
    status: 'yellow',
  },
  {
    id: '15',
    name: 'Onboarding New Team Members',
    startedAt: addDays(today, 17),
    endedAt: addDays(today, 18),
    status: 'green',
  },
  {
    id: '16',
    name: 'Data Migration for New Features',
    startedAt: addDays(today, 20),
    endedAt: addDays(today, 22),
    status: 'red',
  },
  {
    id: '17',
    name: 'SEO Optimization for Website',
    startedAt: addDays(today, 21),
    endedAt: addDays(today, 23),
    status: 'blue',
  },
  {
    id: '18',
    name: 'Bug Fixes for API Integration',
    startedAt: addDays(today, 23),
    endedAt: addDays(today, 24),
    status: 'yellow',
  },
  {
    id: '19',
    name: 'Launch New Marketing Campaign',
    startedAt: addDays(today, 24),
    endedAt: addDays(today, 26),
    status: 'green',
  },
  {
    id: '20',
    name: 'Customer Feedback Session',
    startedAt: addDays(today, 27),
    endedAt: addDays(today, 28),
    status: 'red',
  },
  {
    id: '21',
    name: 'Performance Review Meetings',
    startedAt: addDays(today, 28),
    endedAt: addDays(today, 29),
    status: 'blue',
  },
  {
    id: '22',
    name: 'AI Model Training for Predictions',
    startedAt: addDays(today, 29),
    endedAt: addDays(today, 30),
    status: 'yellow',
  },
  {
    id: '23',
    name: 'Release Candidate Preparation',
    startedAt: addDays(today, 30),
    endedAt: addDays(today, 31),
    status: 'green',
  },
  {
    id: '24',
    name: 'API Rate Limiting Implementation',
    startedAt: addDays(today, 1),
    endedAt: addDays(today, 2),
    status: 'red',
  },
  {
    id: '25',
    name: 'User Role Management',
    startedAt: addDays(today, 3),
    endedAt: addDays(today, 5),
    status: 'blue',
  },
  {
    id: '26',
    name: 'Multilingual Support for App',
    startedAt: addDays(today, 6),
    endedAt: addDays(today, 7),
    status: 'yellow',
  },
  {
    id: '27',
    name: 'Cloud Backup Solution',
    startedAt: addDays(today, 10),
    endedAt: addDays(today, 12),
    status: 'green',
  },
  {
    id: '28',
    name: 'Automated Testing for New Features',
    startedAt: addDays(today, 13),
    endedAt: addDays(today, 14),
    status: 'red',
  },
  {
    id: '29',
    name: 'User Analytics Dashboard',
    startedAt: addDays(today, 17),
    endedAt: addDays(today, 18),
    status: 'blue',
  },
  {
    id: '30',
    name: 'Performance Benchmarking Tool',
    startedAt: addDays(today, 19),
    endedAt: addDays(today, 21),
    status: 'yellow',
  },
  {
    id: '31',
    name: 'Product Documentation Overhaul',
    startedAt: addDays(today, 22),
    endedAt: addDays(today, 24),
    status: 'green',
  },
  {
    id: '32',
    name: 'Team Collaboration Platform Update',
    startedAt: addDays(today, 25),
    endedAt: addDays(today, 27),
    status: 'red',
  },
  {
    id: '33',
    name: 'Security Audit for Platform',
    startedAt: addDays(today, 28),
    endedAt: addDays(today, 30),
    status: 'blue',
  },
  {
    id: '34',
    name: 'Security Audit for Platform',
    startedAt: today,
    endedAt: today,
    status: 'yellow',
  },
];


// const earliestYear = exampleFeatures
//   .map((feature) => feature.startedAt.getFullYear())
//   .sort()
//   .at(0) ?? new Date().getFullYear();

// const latestYear = exampleFeatures
//   .map((feature) => feature.endedAt.getFullYear())
//   .sort()
//   .at(-1) ?? new Date().getFullYear();

export default function Home() {
  return (
    <div className="p-40 pt-14 h-full flex-1 flex-col gap-2">
      <div className="absolute right-40 top-10">
        <ModeToggle />
      </div>
      <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
      <p className="text-muted-foreground">
        Here&apos;s your orders for this month!
      </p>

      <EventsCalendar events={exampleFeatures} />
    </div>
  )
}
