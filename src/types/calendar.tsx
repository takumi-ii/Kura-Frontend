// src/types/calendar.ts

export interface DiaryBookItem {
	id: string;
	name: string;
}

export interface CalendarIdItem {
	id: string;
	name: string;
}

export interface UserItems {
	id: string;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	last_login: string;
	calendar_ids: CalendarIdItem[];
	diarybook_ids: DiaryBookItem[];
	reminder_group_ids: string[];
	profile_image: string; // オプションのプロファイル画像URL
}

export interface ScheduleItem {
	title: string;
	time?: string;
	color?: string;
	done?: boolean;
	event_id?: string;
	calendar_id?: string;
}

export interface DiaryEntry {
	id: string;
	title: string;
	body: string;
	/** 指定日付。存在しない場合は created_at を使用 */
	entry_date?: string;
	created_at: string;
	updated_at: string;
	status: string;
	tags: string[];
	is_public: boolean;
	book: string;
	author: string;
	shared_users: string[];
	images: DiaryImage[];
}

export interface DiaryImage {
	id: string;
	immich_asset_id: string;
}

export interface CalendarItem {
	id: string;
	name: string;
}

export interface UserProfileResponse {
	// 他のフィールドは必要に応じて追加
	calendar_ids: CalendarItem[];
	diary_book_ids: string[];
}

export type FormDataType = {
	date: string;
	title: string;
	content: string;
	location: string;
	start_time: string;
	end_time: string;
	is_all_day: boolean;
	tags: string[];
	urls: string[];
	checklist: string[];
	share_with: string[];
	is_public: boolean;
	notification_time: string;
	calendar: string;
};

export interface RawScheduleItem {
	/** イベントの一意識別子（UUID など） */
	event_id: string;
	/** イベントタイトル */
	title: string;
	/** 日付（'YYYY-MM-DD' 形式） */
	date: string;
	/** 開始時刻（'HH:mm:ss' 形式）、終日予定の場合は undefined */
	start_time?: string;
	/** 終日予定フラグ */
	is_all_day: boolean;
	/** カレンダー ID */
	calendar: string;
}

/** 画面表示用に整形したスケジュールイベント */
export interface ScheduledEvent {
	title: string;
	time?: string; // 'HH:mm'
	color?: string;
	done: boolean;
	event_id: string;
	calendar_id: string;
}

/** 日付文字列 ('YYYY-MM-DD') ごとのイベント配列 */
export type Schedule = Record<string, ScheduledEvent[]>;

/** 新規作成・編集用のカレンダーイベント */
export interface CalendarEvent {
	id: string;
	title: string;
	date: string; // 'YYYY-MM-DD'
	time?: string;
}

/** 日付文字列ごとの日記エントリ配列 */
export type Diaries = Record<string, DiaryEntry[]>;

export interface AddEventModalProps {
	open: boolean;
	date: string | null;
	onAdd: (_event: Omit<CalendarEvent, "id">) => void;
	onClose: () => void;
}
