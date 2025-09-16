import axios from "../../services/axios";
import type { RawScheduleItem } from "../../types/calendar";

export async function fetchMonthlySchedule(
	year: number,
	month: number
): Promise<RawScheduleItem[]> {
	const response = await axios.get<RawScheduleItem[]>(
		//TO-DO neet to fix this
		`/calendar/month/?year=${year}&month=${month}`,
		{ withCredentials: true }
	);
	return response.data;
}
