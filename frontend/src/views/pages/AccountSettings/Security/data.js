import { useRequire as getImage } from '../../../../utils/utils'

const headers = [
  { name: 'Browser', width: 220 },
  { name: 'Device', width: 270 },
  { name: 'Location', width: 180 },
  { name: 'Atividades recentes', width: 220 },
]

const activities = [
  {
    browser: 'Firefox',
    device: 'Windows - Dell XPS 13',
    location: 'Canada',
    recentActivity: '2024-09-01 14:30:56',
    image: getImage('browsers/firefox.png'),
  },
  {
    browser: 'Safari',
    device: 'iPhone - iPhone 13 Pro',
    location: 'United States',
    recentActivity: '2024-09-03 09:45:32',
    image: getImage('browsers/safari.png'),
  },
  {
    browser: 'Chrome',
    device: 'Android - Samsung Galaxy S21',
    location: 'Germany',
    recentActivity: '2024-09-05 18:20:21',
    image: getImage('browsers/chrome.png'),
  },
  {
    browser: 'Edge',
    device: 'MacOS - MacBook Air',
    location: 'Japan',
    recentActivity: '2024-09-07 11:10:18',
    image: getImage('browsers/edge.png'),
  },
  {
    browser: 'Opera',
    device: 'Windows - Lenovo ThinkPad',
    location: 'Brazil',
    recentActivity: '2024-09-09 16:55:41',
    image: getImage('browsers/opera.png'),
  },
  {
    browser: 'Brave',
    device: 'Android - Google Pixel 6',
    location: 'South Africa',
    recentActivity: '2024-09-10 08:40:28',
    image: getImage('browsers/brave.svg'),
  },
]

export { activities, headers }

// recentActivity: "September 10, 2023 08:40"
