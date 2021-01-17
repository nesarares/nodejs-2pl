import * as dayjs from 'dayjs';

export class TimeUtils {
	public static get nowFormatted() {
		return dayjs().format('YYYY-MM-DD HH:mm:ss.SSS');
	}
}