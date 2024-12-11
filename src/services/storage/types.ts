import { Profile } from '../../types/profile';

export interface StorageAdapter {
  get(key: string): any;
  set(key: string, value: any): void;
  remove(key: string): void;
}

export interface IProfileStorage {
  storeProfile(profile: Profile): void;
  getProfile(cupidId: string): Profile | null;
  getAllProfiles(): Profile[];
  getCurrentProfile(): Profile | null;
  setCurrentProfile(profile: Profile): void;
  clearCurrentProfile(): void;
}

export class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}