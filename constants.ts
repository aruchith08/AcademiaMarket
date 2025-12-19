
import { Task, UserProfile } from './types.ts';

export const MOCK_USERS: UserProfile[] = [];

export const INITIAL_TASKS: Task[] = [];

export const PREDEFINED_AVATARS = [
  "https://api.dicebear.com/7.x/notionists/svg?seed=Felix",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Aria",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Jasper",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Luna",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Leo",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Maya",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Milo",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Zoe",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Oscar",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Ruby",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Silas",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Iris"
];

export const getRandomAvatar = () => PREDEFINED_AVATARS[Math.floor(Math.random() * PREDEFINED_AVATARS.length)];
