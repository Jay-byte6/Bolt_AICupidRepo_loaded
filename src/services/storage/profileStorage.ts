import { Profile } from '../../types/profile';
import { STORAGE_KEYS } from './constants';
import { IProfileStorage, StorageAdapter, StorageError } from './types';

export class ProfileStorage implements IProfileStorage {
  private profiles: Map<string, Profile>;
  private storage: StorageAdapter;

  constructor(storage: StorageAdapter) {
    this.profiles = new Map();
    this.storage = storage;
    this.loadProfiles();
  }

  private loadProfiles(): void {
    try {
      const storedProfiles = this.storage.get(STORAGE_KEYS.PROFILES);
      if (storedProfiles) {
        Object.entries(storedProfiles).forEach(([id, profile]) => {
          this.profiles.set(id, profile as Profile);
        });
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
      throw new StorageError('Failed to load profiles');
    }
  }

  private saveProfiles(): void {
    try {
      const profilesObj = Object.fromEntries(this.profiles);
      this.storage.set(STORAGE_KEYS.PROFILES, profilesObj);
    } catch (error) {
      console.error('Error saving profiles:', error);
      throw new StorageError('Failed to save profiles');
    }
  }

  public storeProfile(profile: Profile): void {
    if (!profile.cupidId) {
      throw new StorageError('Profile must have a CUPID ID');
    }
    this.profiles.set(profile.cupidId, profile);
    this.saveProfiles();
  }

  public getProfile(cupidId: string): Profile | null {
    return this.profiles.get(cupidId) || null;
  }

  public getAllProfiles(): Profile[] {
    return Array.from(this.profiles.values());
  }

  public getCurrentProfile(): Profile | null {
    try {
      return this.storage.get(STORAGE_KEYS.CURRENT_PROFILE);
    } catch (error) {
      console.error('Error getting current profile:', error);
      throw new StorageError('Failed to get current profile');
    }
  }

  public setCurrentProfile(profile: Profile): void {
    try {
      this.storage.set(STORAGE_KEYS.CURRENT_PROFILE, profile);
      this.storeProfile(profile);
    } catch (error) {
      console.error('Error setting current profile:', error);
      throw new StorageError('Failed to set current profile');
    }
  }

  public clearCurrentProfile(): void {
    this.storage.remove(STORAGE_KEYS.CURRENT_PROFILE);
  }
}