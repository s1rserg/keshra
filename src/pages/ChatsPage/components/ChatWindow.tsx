import { type FC } from 'react';
import type { ChatDetailsResponse } from 'api';
import { Loader } from 'components/Loader';

interface ChatWindowProps {
  chatDetails: ChatDetailsResponse;
  isLoading: boolean;
}

export const ChatWindow: FC<ChatWindowProps> = ({ chatDetails, isLoading }) => {
  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col">
      <span className="px-4 py-2.5 border-b border-gray-200 font-bold">{chatDetails.title}</span>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chatDetails.participants.map((p) => (
          <div key={p.id} className="text-sm text-gray-700">
            {p.user.username} joined at {new Date(p.joinedAt).toLocaleTimeString()}
          </div>
        ))}
      </div>
    </div>
  );
};
