import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'hooks';
import { SearchInput } from 'components/SearchInput';
import { Loader } from 'components/Loader';
import { ChatListItem } from '../ChatListItem';
import { useSearchPublicChats, useSearchUsers } from '../../hooks';
import { SearchTabs } from './components';
import { UserListItem } from '../../../UserListItem';
import { SearchTab } from './types';
import type { User } from 'api';
import type { ValueOf } from 'types/utils';
import { Tabs } from './config';

interface Props {
  onSelectChat: (id: number) => void;
  onSelectUser: (user: User) => void;
}

export const ChatSidebarSearch: FC<Props> = ({ onSelectChat, onSelectUser }) => {
  const { t } = useTranslation('chatsPage');
  const [activeTab, setActiveTab] = useState<ValueOf<typeof SearchTab>>(SearchTab.CHATS);
  const [inputValue, setInputValue] = useState('');

  const debouncedQuery = useDebounce(inputValue, 500);

  const isChatsTab = activeTab === SearchTab.CHATS;
  const isUsersTab = activeTab === SearchTab.USERS;

  const { data: chatResults, isLoading: isLoadingChats } = useSearchPublicChats(
    isChatsTab ? debouncedQuery : '',
    isChatsTab,
  );

  const { data: userResults, isLoading: isLoadingUsers } = useSearchUsers(
    isUsersTab ? debouncedQuery : '',
    isUsersTab,
  );

  const isLoading = activeTab === SearchTab.CHATS ? isLoadingChats : isLoadingUsers;
  const results = activeTab === SearchTab.CHATS ? chatResults : userResults;

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="p-2">
        <SearchInput
          value={inputValue}
          onChange={setInputValue}
          placeholder={
            activeTab === SearchTab.CHATS
              ? t('search.publicChatsPlaceholder')
              : t('search.usersPlaceholder')
          }
        />
      </div>

      <SearchTabs
        tabs={Tabs}
        activeTab={activeTab}
        onTabChange={(id) => setActiveTab(id as ValueOf<typeof SearchTab>)}
      />

      <div className="flex-1 overflow-y-auto">
        {isLoading && <Loader />}

        {!isLoading && debouncedQuery.length > 0 && !results?.length && (
          <div className="p-4 text-center text-sm text-gray-500">{t('search.noResults')}</div>
        )}

        {!isLoading && (
          <div className="flex flex-col">
            {activeTab === SearchTab.CHATS
              ? chatResults?.map((chat) => (
                  <ChatListItem
                    key={chat.id}
                    chat={chat}
                    isSelected={false}
                    onClick={() => onSelectChat(chat.id)}
                  />
                ))
              : userResults?.map((user) => (
                  <UserListItem
                    key={user.id}
                    user={user}
                    isSelected={false}
                    onClick={() => onSelectUser(user)}
                  />
                ))}
          </div>
        )}
      </div>
    </div>
  );
};
