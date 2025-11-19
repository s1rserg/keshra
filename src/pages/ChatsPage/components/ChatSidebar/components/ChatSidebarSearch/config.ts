import type { TabOption } from './components';
import { SearchTab } from './types';

export const Tabs: TabOption[] = [
  { id: SearchTab.CHATS, label: 'tabs.publicChats' },
  { id: SearchTab.USERS, label: 'tabs.users' },
];
