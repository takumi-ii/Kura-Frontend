import { useEffect, useState, type JSX } from "react";
import { useCalendar } from "../features/calendar/hooks/useCalendarModal";
import { get_calendar_event_detail } from "../features/calendar/CalendarApi";
import { CalendarCell } from "../features/calendar/components/CalendarCell";
import { AddEventModal } from "../features/calendar/components/AddEventModal";
import { EventDetailModal } from "../features/calendar/components/EventDetailModal";
import type { EventDetail } from "../features/calendar/components/EventDetailModal";
import { ProfileModal } from "../features/calendar/components/ProfileModal";
import "./calendar.css";
import { getFormattedDate } from "../utils/date";
import { get_user_profile } from "../utils/profile";
import { DiaryDetailModal } from "../features/diary/components/DiaryDetailModal";
import { AddDiaryModal } from "../features/diary/components/AddDiaryModal";
import { EditDiaryModal } from "../features/diary/components/EditDiaryModal";
import type { DiaryEntry } from "../types/calendar";
import type { CreateDiaryEntryData } from "../types/diary";
import {
	fetchDiaryEntry,
	createDiaryEntry,
	updateDiaryEntry,
	deleteDiaryEntry,
} from "../features/diary/diaryService";

export default function Calendar() {
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<string | null>(null);
	const [showAddModal, setShowAddModal] = useState(false);
	const [detailEvent, setDetailEvent] = useState<EventDetail | null>(null);
	const [showProfile, setShowProfile] = useState(false);
	const { schedule, diaries, addEvent, reload } = useCalendar(currentDate);
	const [showDiaryDetail, setShowDiaryDetail] = useState(false);
	const [showAdd, setShowAdd] = useState(false);
	const [selectedDiary, setSelectedDiary] = useState<DiaryEntry | null>(null);
	const [showDiaryEdit, setShowDiaryEdit] = useState(false);
	const [profileImage, setProfileImage] = useState<string | undefined>(
		undefined
	);
	const year = currentDate.getFullYear();
	const month = currentDate.getMonth();

	useEffect(() => {
		(async () => {
			const profile = await get_user_profile();
			// console.log("Raw profile:", profile);

			// diarybook_ids がオブジェクト配列なので id のみ抽出
			const profile_image = profile.profile_image;
			setProfileImage(profile_image);
		})();
	}, []);

	const getDateKey = (y: number, m: number, d: number) =>
		`${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

	const handlePrevMonth = () => {
		const d = new Date(currentDate);
		d.setMonth(month - 1);
		setCurrentDate(d);
		setSelectedDate(null);
	};

	const handleNextMonth = () => {
		const d = new Date(currentDate);
		d.setMonth(month + 1);
		setCurrentDate(d);
		setSelectedDate(null);
	};

	const handleEventClick = async (eventId: string) => {
		try {
			const detail = (await get_calendar_event_detail(
				eventId
			)) as EventDetail;
			setDetailEvent(detail);
		} catch (err) {
			console.error("詳細の取得に失敗:", err);
		}
	};

	const handleDiaryClick = async (diaryId: string) => {
		try {
			const entry = await fetchDiaryEntry(diaryId);
			setSelectedDiary(entry);
			setShowDiaryDetail(true);
		} catch (err) {
			console.error("日記の取得に失敗:", err);
		}
	};

	const renderDays = () => {
		const firstDay = new Date(year, month, 1).getDay();
		const daysInMonth = new Date(year, month + 1, 0).getDate();
		const rows: JSX.Element[] = [];
		let cells: JSX.Element[] = [];

		for (let i = 0; i < firstDay; i++) {
			cells.push(<td key={`empty-${i}`}></td>);
		}
		for (let day = 1; day <= daysInMonth; day++) {
			const dateKey = getDateKey(year, month, day);
			const isToday =
				new Date().toDateString() ===
				new Date(year, month, day).toDateString();
			const isSelected = selectedDate === dateKey;
			const daySchedule = schedule[dateKey] || [];
			const dayDiaries = diaries[dateKey] || [];
			cells.push(
				<CalendarCell
					key={dateKey}
					dateKey={dateKey}
					day={day}
					isToday={isToday}
					isSelected={isSelected}
					events={daySchedule}
					diaries={dayDiaries}
					onSelect={() => {
						setSelectedDate(dateKey);
					}}
					onEventClick={handleEventClick}
					onDiaryClick={handleDiaryClick}
				/>
			);
			if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
				rows.push(<tr key={`row-${day}`}>{cells}</tr>);
				cells = [];
			}
		}
		return rows;
	};
	// const handleAdd = async (data: {
	// 	title: string;
	// 	body: string;
	// 	book_id: string;
	// 	images?: File[];
	// }) => {
	// 	try {
	// 		await createDiaryEntry(data);
	// 		await reload();
	// 	} catch (e) {
	// 		console.error(e);
	// 	}
	// };
	const handleAdd = async (data: CreateDiaryEntryData) => {
		try {
			await createDiaryEntry(data);
			await reload();
		} catch (e) {
			console.error(e);
		}
	};

	const handleUpdate = async (
		entryId: string,
		data: {
			title: string;
			body: string;
			updated_at: string;
			status: string;
			tags: string[];
			is_public: boolean;
		}
	) => {
		try {
			await updateDiaryEntry(entryId, data);
			await reload();
			setShowDiaryEdit(false);
			setSelectedDiary(null);
		} catch (e) {
			console.error(e);
		}
	};

	const handleDelete = async (entryId: string) => {
		try {
			await deleteDiaryEntry(entryId);
			await reload();
			setShowDiaryDetail(false);
			setSelectedDiary(null);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<>
			<div className="calendar-container">
				<header className="calendar-header">
					<div className="menu-left">
						<button id="menu-toggle">☰</button>
						<span className="logo">📅 MyCalendar</span>
					</div>
					<h1 id="calendar-title">{`${year}年${month + 1}月`}</h1>
					<button className="bt-month" onClick={handlePrevMonth}>
						&lt; Prev
					</button>
					<button className="bt-month" onClick={handleNextMonth}>
						Next &gt;
					</button>
					<div className="menu-right">
						<button onClick={() => setShowAdd(true)}>📝</button>
						<button
							onClick={() => {
								if (!selectedDate) {
									setSelectedDate(getFormattedDate());
								}
								setShowAddModal(true);
							}}
						>
							＋
						</button>
					</div>
					<div className="profile">
						<img
							className="profile-icon"
							onClick={() => setShowProfile(true)}
							src={profileImage}
							alt="profile picture"
						/>
					</div>
				</header>

				<nav className="side-icons">
					<button title="通知">🔔</button>
					<button title="カレンダー">🗓️</button>
					<button title="設定">⚙️</button>
				</nav>

				<table className="calendar-table">
					<thead>
						<tr>
							<th>日</th>
							<th>月</th>
							<th>火</th>
							<th>水</th>
							<th>木</th>
							<th>金</th>
							<th>土</th>
						</tr>
					</thead>
					<tbody>{renderDays()}</tbody>
				</table>
			</div>
			<AddEventModal
				open={showAddModal}
				date={selectedDate}
				onAdd={addEvent}
				onClose={() => setShowAddModal(false)}
			/>
			<EventDetailModal
				event={detailEvent}
				onClose={() => setDetailEvent(null)}
			/>
			<AddDiaryModal
				open={showAdd}
				onAdd={handleAdd}
				onClose={() => setShowAdd(false)}
			/>
			<DiaryDetailModal
				open={showDiaryDetail}
				entry={selectedDiary}
				onEdit={() => {
					setShowDiaryDetail(false);
					setShowDiaryEdit(true);
				}}
				//
				onDelete={async () => {
					if (!selectedDiary) return;
					// 1) 削除 API 呼び出し
					await handleDelete(selectedDiary.id);
					// 2) 削除が終わったらモーダルを閉じる
					setShowDiaryDetail(false);
				}}
				onClose={() => setShowDiaryDetail(false)}
			/>
			<EditDiaryModal
				open={showDiaryEdit}
				entry={selectedDiary}
				onUpdate={handleUpdate}
				onClose={() => {
					setShowDiaryEdit(false);
					setSelectedDiary(null);
				}}
			/>
			<ProfileModal
				open={showProfile}
				onClose={() => setShowProfile(false)}
			/>
		</>
	);
}
