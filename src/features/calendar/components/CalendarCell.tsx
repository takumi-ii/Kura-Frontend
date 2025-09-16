import type { DiaryEntry, ScheduledEvent } from "../../../types/calendar";
import type { CSSProperties } from "react";

interface CalendarCellProps {
	dateKey: string;
	day: number;
	isToday: boolean;
	isSelected: boolean;
	events: ScheduledEvent[];
	diaries: DiaryEntry[];
	onSelect: () => void;
	onEventClick: (eventId: string) => void;
	onDiaryClick: (diaryId: string) => void;
}

export function CalendarCell({
	dateKey,
	day,
	isToday,
	isSelected,
	events,
	diaries,
	onSelect,
	onEventClick,
	onDiaryClick,
}: CalendarCellProps) {
	// const cellClass = `${isToday ? "today" : ""} ${
	// 	isSelected ? "selected-day" : ""
	// }`;
	const cellClass = `${isToday ? "today" : ""} ${
		isSelected ? "selected-day" : ""
	}`;

	// return (
	// 	<td key={dateKey} className={cellClass} onClick={onSelect}>
	const firstImageId = diaries.find((d) => d.images && d.images.length > 0)
		?.images[0].immich_asset_id;

	const cellStyle: CSSProperties = firstImageId
		? ({
				"--thumbnail-url": `url("http://localhost:8000/api/diary/image/${firstImageId}/thumbnail/")`,
		  } as CSSProperties)
		: {};

	return (
		<td
			key={dateKey}
			className={cellClass}
			data-date={dateKey}
			data-image={firstImageId ? true : undefined}
			style={cellStyle}
			onClick={onSelect}
		>
			<div className="day-label">{day}</div>
			{events.map((ev, i) => (
				<div
					key={`ev-${i}`}
					className={`event ${ev.done ? "event-box" : ""}`}
					style={ev.color && !ev.done ? { color: ev.color } : {}}
					onClick={(e) => {
						e.stopPropagation();
						onEventClick(ev.event_id);
					}}
				>
					{ev.color && !ev.done ? (
						<>
							<span
								className="dot"
								style={{ background: ev.color }}
							/>
							{ev.title} {ev.time}
						</>
					) : ev.done ? (
						`■ ${ev.title}`
					) : (
						ev.title
					)}
				</div>
			))}
			{diaries.map((di, i) => (
				<div
					key={`di-${i}`}
					className="diary-entry"
					onClick={(e) => {
						e.stopPropagation();
						onDiaryClick(di.id);
					}}
				>
					📝 {di.title}
				</div>
			))}
		</td>
	);
}
