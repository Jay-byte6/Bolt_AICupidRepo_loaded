export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isAnonymous: boolean;
}

export interface ConnectionRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
  message?: string;
}

export interface ChatRoom {
  id: string;
  participants: string[];
  isAnonymous: boolean;
  createdAt: string;
  lastMessageAt: string;
}