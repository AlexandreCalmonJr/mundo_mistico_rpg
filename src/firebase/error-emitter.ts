// A simple, generic event emitter class
class EventEmitter<T extends Record<string, any>> {
  private listeners: { [K in keyof T]?: ((data: T[K]) => void)[] } = {};

  on<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  off<K extends keyof T>(event: K, callback: (data: T[K]) => void): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event]!.filter(
      (cb) => cb !== callback
    );
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event]!.forEach((callback) => {
      try {
        callback(data);
      } catch (e) {
        console.error(`Error in event listener for ${String(event)}:`, e);
      }
    });
  }
}

// Define the events and their payload types
type AppEvents = {
  'permission-error': import('./errors').FirestorePermissionError;
};

// Export a singleton instance of the emitter
export const errorEmitter = new EventEmitter<AppEvents>();
