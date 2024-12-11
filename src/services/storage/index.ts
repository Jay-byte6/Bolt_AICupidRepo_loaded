import { LocalStorageAdapter } from './LocalStorageAdapter';
import { ProfileStorage } from './profileStorage';

// Create singleton instances
const storageAdapter = new LocalStorageAdapter();
export const profileStorage = new ProfileStorage(storageAdapter);

export * from './constants';
export * from './types';