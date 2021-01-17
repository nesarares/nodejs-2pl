import * as crypto from 'crypto';

export class Utils {
  public static DEADLOCK_WATCH_INTERVAL = 1000;
  public static SLEEP_MS = 3000;

  public static generateId(): string {
    return crypto.randomBytes(12).toString('base64');
  }

  public static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }
}
