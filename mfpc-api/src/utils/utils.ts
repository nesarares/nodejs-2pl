import * as crypto from 'crypto';

export class Utils {
  public static generateId(): string {
    return crypto.randomBytes(12).toString('base64');
  }

  public static sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }
}
