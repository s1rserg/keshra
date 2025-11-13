import { type FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'hooks/useDebounce';
import { SearchInput } from 'components/SearchInput';
import { Loader } from 'components/Loader';
import { ChatListItem } from './ChatListItem';
import { useSearchPublicChats } from '../hooks';

interface Props {
  onSelectChat: (id: number) => void;
}

export const ChatSidebarSearch: FC<Props> = ({ onSelectChat }) => {
  const { t } = useTranslation('chatsPage');
  const [inputValue, setInputValue] = useState('');

  const debouncedQuery = useDebounce(inputValue, 500);
  const { data: searchResults, isLoading } = useSearchPublicChats(debouncedQuery);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="border-b border-gray-200 p-2">
        <SearchInput
          value={inputValue}
          onChange={setInputValue}
          placeholder={t('search.publicChatsPlaceholder')}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && <Loader />}
        {!isLoading && debouncedQuery.length > 2 && !searchResults?.length && (
          <div className="p-4 text-center text-sm text-gray-500">{t('search.noResults')}</div>
        )}

        {!isLoading &&
          searchResults &&
          searchResults.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={false}
              onClick={() => onSelectChat(chat.id)}
            />
          ))}
      </div>
    </div>
  );
};
