import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { Send, User } from 'lucide-react';
import { ChatMessage } from '../../types/chat';
import { getCurrentProfile } from '../../services/profileStorage';
import { sendMessage, getRoomMessages } from '../../services/chatService';

interface Props {
  roomId: string;
  partnerId: string;
  isAnonymous: boolean;
}

const ChatRoom: React.FC<Props> = ({ roomId, partnerId, isAnonymous }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentProfile = getCurrentProfile();

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000); // Poll for new messages
    return () => clearInterval(interval);
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = () => {
    try {
      const roomMessages = getRoomMessages(roomId);
      setMessages(roomMessages);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentProfile) return;

    try {
      await sendMessage(roomId, currentProfile.cupidId, partnerId, newMessage);
      setNewMessage('');
      loadMessages();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  if (!currentProfile) return null;

  return (
    <div className="flex flex-col h-full">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 mb-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = message.senderId === currentProfile.cupidId;

          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  isOwnMessage
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {!isOwnMessage && !isAnonymous && (
                  <div className="flex items-center mb-1 text-sm text-gray-500">
                    <User className="w-4 h-4 mr-1" />
                    <span>Partner</span>
                  </div>
                )}
                <p className="break-words">{message.content}</p>
                <div
                  className={`text-xs mt-1 ${
                    isOwnMessage ? 'text-indigo-200' : 'text-gray-500'
                  }`}
                >
                  {formatMessageTime(message.timestamp)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;