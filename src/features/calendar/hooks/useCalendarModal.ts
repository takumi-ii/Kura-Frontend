import { useState, useEffect, useCallback } from "react";
import { fetchMonthlySchedule } from "../calendarService";
import { fetchDiaryEntries } from "../../diary/diaryService";
import { get_calendar_ids, submit_calendar_event } from "../CalendarApi";
import type {
	Schedule,
	Diaries,
	RawScheduleItem,
	FormDataType,
} from "../../../types/calendar";

export function useCalendar(currentDate: Date) {
	const [schedule, setSchedule] = useState<Schedule>({});
	const [diaries, setDiaries] = useState<Diaries>({});
	const loadData = useCallback(async () => {
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth() + 1;
		try {
			const rawSchedule: RawScheduleItem[] = await fetchMonthlySchedule(
				year,
				month
			);
			const scheduleByDate: Schedule = {};
			rawSchedule.forEach((item) => {
				const d = item.date;
				if (!scheduleByDate[d]) scheduleByDate[d] = [];
				scheduleByDate[d].push({
					title: item.title,
					time: item.start_time?.slice(0, 5),
					color: item.is_all_day ? undefined : "red",
					done: item.is_all_day,
					event_id: item.event_id,
					calendar_id: item.calendar,
				});
			});
			setSchedule(scheduleByDate);

			const start = new Date(year, month - 1, 1).toISOString();
			const end = new Date(
				year,
				month - 1,
				new Date(year, month, 0).getDate(),
				23,
				59,
				59
			).toISOString();
			// const diaryData = await fetchDiaryEntries(start, end);
			// const diaryByDate: Diaries = {};
			// diaryData.forEach((entry) => {
			// 	const d = entry.created_at.split("T")[0];
			// 	if (!diaryByDate[d]) diaryByDate[d] = [];
			// 	diaryByDate[d].push(entry);
			// });
			// const diaryData = await fetchDiaryEntries(start, end);
			// const diaryByDate: Diaries = {};
			// diaryData.forEach((entry) => {
			// 	const d = entry.entry_date;
			// 	if (!diaryByDate[d]) diaryByDate[d] = [];
			// 	diaryByDate[d].push(entry);
			// });
			// setDiaries(diaryByDate);
			const diaryData = await fetchDiaryEntries(start, end);
			const diaryByDate: Diaries = {};
			diaryData.forEach((entry) => {
				const d = (entry.entry_date || entry.created_at).split("T")[0];
				if (!diaryByDate[d]) diaryByDate[d] = [];
				diaryByDate[d].push(entry);
			});
			setDiaries(diaryByDate);
		} catch (err) {
			console.error(err);
		}
	}, [currentDate]);

	useEffect(() => {
		loadData();
	}, [currentDate, loadData]);

	// 新規イベント追加ロジック
	// 新規イベント追加ロジック
	const addEvent = async (event: FormDataType) => {
		try {
			const calendars = await get_calendar_ids();
			const calendarId = calendars[0]?.id;
			if (calendarId) {
				await submit_calendar_event({
					calendar: calendarId,
					...event,
				});
				// 追加したイベントをローカル状態にも反映
				setSchedule((prev) => {
					const dateKey = event.date;
					const newEvent = {
						title: event.title,
						time: event.start_time?.slice(0, 5),
						color: event.is_all_day ? undefined : "red",
						done: event.is_all_day,
						event_id: "",
						calendar_id: calendarId,
					};
					return {
						...prev,
						[dateKey]: [...(prev[dateKey] || []), newEvent],
					};
				});
			}
		} catch (err) {
			console.error(err);
		}
	};

	return { schedule, diaries, addEvent, reload: loadData };
}
