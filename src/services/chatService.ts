import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';
import { ChatMessage, ChatRoom } from '../types/chat';
import { areUsersConnected } from './connectionService';

const CHAT_ROOMS_KEY = 'ai_cupid_chat_rooms';
const CHAT_MESSAGES_KEY = 'ai_cupid_chat_messages';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getStoredChatRooms = (): ChatRoom[] => {
  try {
    const stored = localStorage.getItem(CHAT_ROOMS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading chat rooms:', error);
    return [];
  }
};

export const getStoredMessages = (): ChatMessage[] => {
  try {
    const stored = localStorage.getItem(CHAT_MESSAGES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading messages:', error);
    return [];
  }
};

export const createChatRoom = (
  participant1: string,
  participant2: string,
  isAnonymous: boolean
): ChatRoom => {
  if (!areUsersConnected(participant1, participant2)) {
    throw new Error('Users must be connected to start a chat');
  }

  const rooms = getStoredChatRooms();
  const existingRoom = rooms.find(room => 
    room.participants.includes(participant1) && 
    room.participants.includes(participant2)
  );

  if (existingRoom) {
    return existingRoom;
  }

  const newRoom: ChatRoom = {
    id: uuidv4(),
    participants: [participant1, participant2],
    isAnonymous,
    createdAt: new Date().toISOString(),
    lastMessageAt: new Date().toISOString()
  };

  rooms.push(newRoom);
  localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(rooms));

  return newRoom;
};

export const sendMessage = async (
  roomId: string,
  senderId: string,
  receiverId: string,
  content: string
): Promise<ChatMessage> => {
  const rooms = getStoredChatRooms();
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) {
    throw new Error('Chat room not found');
  }

  if (!room.participants.includes(senderId) || !room.participants.includes(receiverId)) {
    throw new Error('Invalid participants for this chat room');
  }

  const messages = getStoredMessages();
  const newMessage: ChatMessage = {
    id: uuidv4(),
    senderId,
    receiverId,
    content,
    timestamp: new Date().toISOString(),
    isAnonymous: room.isAnonymous
  };

  messages.push(newMessage);
  localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages));

  // Update room's last message timestamp
  room.lastMessageAt = newMessage.timestamp;
  localStorage.setItem(CHAT_ROOMS_KEY, JSON.stringify(rooms));

  // Analyze message for persona updates
  await analyzeMessageForPersona(senderId, content);

  return newMessage;
};

export const getRoomMessages = (roomId: string): ChatMessage[] => {
  const room = getStoredChatRooms().find(r => r.id === roomId);
  if (!room) {
    throw new Error('Chat room not found');
  }

  const messages = getStoredMessages();
  return messages.filter(msg => 
    room.participants.includes(msg.senderId) && 
    room.participants.includes(msg.receiverId)
  ).sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

export const getUserChatRooms = (userId: string): ChatRoom[] => {
  return getStoredChatRooms()
    .filter(room => room.participants.includes(userId))
    .sort((a, b) => 
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
};

const analyzeMessageForPersona = async (userId: string, message: string): Promise<void> => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Analyze the message for personality traits, communication style, and emotional expression."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    // Store the analysis results for future compatibility matching
    // This would be expanded in a real implementation
    console.log('Message analysis:', completion.choices[0].message);
  } catch (error) {
    console.error('Error analyzing message:', error);
  }
};