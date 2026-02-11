import { AppState, UserStats } from '../types';

/**
 * This service simulates a real backend API.
 * In a production app, these would be fetch/axios calls to your server.
 */
export const mockBackend = {
  // Simulate saving user data to a cloud database
  syncData: async (data: AppState): Promise<{ success: boolean; timestamp: string }> => {
    return new Promise((resolve) => {
      console.log('Syncing data to Fitbro Cloud...', data);
      setTimeout(() => {
        resolve({
          success: true,
          timestamp: new Date().toISOString()
        });
      }, 1500);
    });
  },

  // Simulate fetching the latest workout plans
  getLatestWorkouts: async () => {
    // This could fetch seasonal workouts or dynamic content
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 500);
    });
  }
};