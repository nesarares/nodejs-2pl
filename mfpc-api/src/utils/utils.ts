import * as crypto from 'crypto';

export class Utils {
	public static generateId(): string {
		return crypto.randomBytes(12).toString('base64')
	}
}