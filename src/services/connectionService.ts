import { v4 as uuidv4 } from 'uuid';
import { ConnectionRequest } from '../types/chat';

const CONNECTIONS_KEY = 'ai_cupid_connections';

export const getStoredConnections = (): ConnectionRequest[] => {
  try {
    const stored = localStorage.getItem(CONNECTIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading connections:', error);
    return [];
  }
};

export const sendConnectionRequest = (fromUserId: string, toUserId: string, message?: string): ConnectionRequest => {
  const connections = getStoredConnections();
  
  // Check if request already exists
  const existingRequest = connections.find(
    req => req.fromUserId === fromUserId && req.toUserId === toUserId
  );
  
  if (existingRequest) {
    throw new Error('Connection request already sent');
  }

  const newRequest: ConnectionRequest = {
    id: uuidv4(),
    fromUserId,
    toUserId,
    status: 'pending',
    timestamp: new Date().toISOString(),
    message
  };

  connections.push(newRequest);
  localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));

  return newRequest;
};

export const updateConnectionStatus = (
  requestId: string,
  status: 'accepted' | 'rejected'
): ConnectionRequest => {
  const connections = getStoredConnections();
  const index = connections.findIndex(req => req.id === requestId);
  
  if (index === -1) {
    throw new Error('Connection request not found');
  }

  connections[index] = {
    ...connections[index],
    status
  };

  localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
  return connections[index];
};

export const getConnectionRequests = (userId: string): ConnectionRequest[] => {
  const connections = getStoredConnections();
  return connections.filter(
    req => req.toUserId === userId || req.fromUserId === userId
  );
};

export const areUsersConnected = (userId1: string, userId2: string): boolean => {
  const connections = getStoredConnections();
  return connections.some(
    req => req.status === 'accepted' &&
    ((req.fromUserId === userId1 && req.toUserId === userId2) ||
     (req.fromUserId === userId2 && req.toUserId === userId1))
  );
};