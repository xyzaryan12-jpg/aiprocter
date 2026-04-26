import {
  IconTrophy,
  IconCode,
  IconClipboardList,
  IconPlus,
  IconChartBar,
  IconLayoutDashboard,
  IconListCheck,
} from '@tabler/icons-react';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'HackProctor',
  },
  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },

  {
    navlabel: true,
    subheader: 'Candidate',
  },
  {
    id: uniqueId(),
    title: 'Challenges',
    icon: IconTrophy,
    href: '/exam',
  },
  {
    id: uniqueId(),
    title: 'My Results',
    icon: IconChartBar,
    href: '/result',
  },

  {
    navlabel: true,
    subheader: 'Organizer',
  },
  {
    id: uniqueId(),
    title: 'Create Challenge',
    icon: IconPlus,
    href: '/create-exam',
  },
  {
    id: uniqueId(),
    title: 'Add MCQ Questions',
    icon: IconListCheck,
    href: '/add-questions',
  },
  {
    id: uniqueId(),
    title: 'Proctoring Logs',
    icon: IconClipboardList,
    href: '/exam-log',
  },
];

export default Menuitems;
