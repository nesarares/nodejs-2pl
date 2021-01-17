export class AbortException extends Error {
	constructor(message?: string) {
		super(message || 'Transaction has been aborted');
	}
}