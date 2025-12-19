
import { Task, TaskStatus, UserProfile } from './types.ts';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'u1',
    username: 'alex_j',
    name: 'Alex Johnson',
    role: 'assigner',
    rating: 4.8,
    completedTasks: 12,
    avatar: 'https://picsum.photos/seed/alex/100',
    password: 'password123'
  },
  {
    id: 'u2',
    username: 'sarah_pro',
    name: 'Sarah Smith',
    role: 'writer',
    rating: 4.9,
    completedTasks: 45,
    earnings: 12500,
    pricePerPage: 50.00,
    avatar: 'https://picsum.photos/seed/sarah/100',
    password: 'password123',
    bio: 'Expert in History and Literature essays. 5 years experience.',
    specialties: ['History', 'English'],
    isBusy: false,
    pastWork: ['WWII Origins Analysis', 'Renaissance Art Review', 'Industrial Revolution Notes']
  },
  {
    id: 'u3',
    username: 'mike_writes',
    name: 'Mike Chen',
    role: 'writer',
    rating: 4.7,
    completedTasks: 32,
    earnings: 8900,
    pricePerPage: 10.00,
    avatar: 'https://picsum.photos/seed/mike/100',
    password: 'password123',
    bio: 'CS student helping with lab records and technical notes.',
    specialties: ['CS', 'Physics'],
    isBusy: true,
    pastWork: ['Python Lab Record', 'Digital Logic Homework']
  }
];

export const INITIAL_TASKS: Task[] = [];
