import axios from "../../services/axios";
import type { CalendarItem, UserProfileResponse } from "../../types/calendar";

const BASE_URL = "http://localhost:8000/api";
//const WEATHER_URL = `${BASE_URL}/weather/`;
const CALENDAR_CREATE_URL = `${BASE_URL}/calendar/create/`;
const USER_PROFILE_URL = `${BASE_URL}/user/profile/`;
const CALENDAR_EVENT_URL = `${BASE_URL}/calendar/`;

// カレンダーID取得
export const get_calendar_ids = async (): Promise<CalendarItem[]> => {
	try {
		const response = await axios.get<UserProfileResponse>(
			USER_PROFILE_URL,
			{
				withCredentials: true,
			}
		);
		// calendar_idsは配列で返る
		return response.data.calendar_ids as { id: string; name: string }[];
	} catch (error) {
		console.error(error);
		return [];
	}
};

// カレンダーイベント登録
export const submit_calendar_event = async (eventData: {
	calendar: string;
	date: string;
	start_time: string;
	end_time: string;
	is_all_day: boolean;
	title: string;
	content: string;
	location: string;
	tags: string[];
	urls: string[];
	checklist: string[];
	share_with: string[];
	is_public: boolean;
	notification_time: string;
}) => {
	console.log(eventData);
	try {
		const response = await axios.post(CALENDAR_CREATE_URL, eventData, {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const get_calendar_event_detail = async (eventId: string) => {
	const url = `${CALENDAR_EVENT_URL}${eventId}/`;

	try {
		const response = await axios.get(url, {
			withCredentials: true,
		});
		//console.log("APIレスポンス:", response);
		return response.data;
	} catch (error) {
		throw error;
	}
};
