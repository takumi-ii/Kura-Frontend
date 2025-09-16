import { Modal } from "../../../components/Modal/Modal";

export interface EventDetail {
	title: string;
	date: string;
	start_time?: string;
	end_time?: string;
	is_all_day?: boolean;
	location?: string;
	content?: string;
	tags?: string[];
	checklist?: string[];
}

interface EventDetailModalProps {
	event: EventDetail | null;
	onClose: () => void;
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
	if (!event) return null;
	return (
		<Modal open={!!event} onClose={onClose}>
			<h2>{event.title}</h2>
			<p>
				<strong>日付:</strong> {event.date}
			</p>
			{event.start_time && (
				<p>
					<strong>開始:</strong> {event.start_time}
				</p>
			)}
			{event.end_time && (
				<p>
					<strong>終了:</strong> {event.end_time}
				</p>
			)}
			<p>
				<strong>終日:</strong> {event.is_all_day ? "はい" : "いいえ"}
			</p>
			{event.location && (
				<p>
					<strong>場所:</strong> {event.location}
				</p>
			)}
			{event.content && (
				<p>
					<strong>内容:</strong> {event.content}
				</p>
			)}
			{event.tags && event.tags.length > 0 && (
				<p>
					<strong>タグ:</strong> {event.tags.join(", ")}
				</p>
			)}
			{event.checklist && event.checklist.length > 0 && (
				<p>
					<strong>チェックリスト:</strong>{" "}
					{event.checklist.join(", ")}
				</p>
			)}
			<div className="modal-actions">
				<button onClick={onClose}>閉じる</button>
			</div>
		</Modal>
	);
}
