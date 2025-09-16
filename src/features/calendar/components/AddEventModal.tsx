import { useEffect, useState } from "react";
import { Modal } from "../../../components/Modal/Modal";
import { Button } from "../../../components/Button";
import { getFormattedDate } from "../../../utils/date";
import type { AddEventModalProps, FormDataType } from "../../../types/calendar";
import { get_calendar_ids } from "../CalendarApi";

export function AddEventModal({
	open,
	date,
	onClose,
	onAdd,
}: AddEventModalProps) {
	const [formData, setFormData] = useState<FormDataType>({
		date: date || getFormattedDate(),
		calendar: "",
		title: "",
		content: "",
		location: "",
		start_time: "",
		end_time: "",
		is_all_day: false,
		tags: [],
		urls: [],
		checklist: [],
		share_with: [],
		is_public: false,
		notification_time: "",
	});

	useEffect(() => {
		setFormData((prev) => ({
			...prev,
			date: date || getFormattedDate(),
		}));
	}, [date, open]);

	// ②カレンダーIDを取得し、最初のIDを formData.calendar にセット
	useEffect(() => {
		if (!open) return;

		const loadCalendar = async () => {
			try {
				const calendars = await get_calendar_ids();
				if (calendars.length > 0) {
					setFormData((prev) => ({
						...prev,
						calendar: calendars[0].id, // 最初のIDをセット
					}));
				}
			} catch (err) {
				console.error("カレンダーIDの取得に失敗しました:", err);
			}
		};

		loadCalendar();
	}, [open]);

	const handleSubmit = () => {
		// if (!formData.date || !formData.title) return;
		// onAdd(formData);
		if (!formData.date || !formData.title) return;

		// 空の文字列・空配列を持つキーを除去
		const cleanedData = (
			Object.entries(formData) as [keyof FormDataType, any][]
		).reduce<Partial<FormDataType>>((acc, [key, val]) => {
			// 空文字列は除外
			if (typeof val === "string" && val.trim() === "") {
				return acc;
			}
			// 空配列は除外
			if (Array.isArray(val) && val.length === 0) {
				return acc;
			}
			// それ以外はそのままセット
			acc[key] = val;
			return acc;
		}, {});

		onAdd(cleanedData as FormDataType);

		onClose();
	};

	return (
		<Modal open={open} onClose={onClose}>
			<h2>Add Event</h2>
			<label>
				Date:
				<input
					type="date"
					value={formData.date}
					onChange={(e) =>
						setFormData({ ...formData, date: e.target.value })
					}
				/>
			</label>
			<label htmlFor="event-title">Title</label>
			<input
				id="event-title"
				value={formData.title}
				onChange={(e) =>
					setFormData({ ...formData, title: e.target.value })
				}
			/>
			<label>
				Content:
				<input
					type="text"
					value={formData.content}
					onChange={(e) =>
						setFormData({ ...formData, content: e.target.value })
					}
				/>
			</label>
			<label>
				Location:
				<input
					type="text"
					value={formData.location}
					onChange={(e) =>
						setFormData({ ...formData, location: e.target.value })
					}
				/>
			</label>
			<label htmlFor="event-time">Start Time</label>
			<input
				id="event-time"
				type="time"
				value={formData.start_time}
				onChange={(e) =>
					setFormData({ ...formData, start_time: e.target.value })
				}
			/>
			<label>
				End Time
				<input
					type="time"
					value={formData.end_time}
					onChange={(e) =>
						setFormData({ ...formData, end_time: e.target.value })
					}
				/>
			</label>
			<label>
				All Day
				<input
					type="checkbox"
					checked={formData.is_all_day}
					onChange={(e) =>
						setFormData({
							...formData,
							is_all_day: e.target.checked,
						})
					}
				/>
			</label>
			<label>
				Tags (comma separated)
				<input
					type="text"
					value={formData.tags.join(",")}
					onChange={(e) =>
						setFormData({
							...formData,
							tags: e.target.value
								.split(",")
								.map((t) => t.trim()),
						})
					}
				/>
			</label>
			<label>
				URLs (comma separated)
				<input
					type="text"
					value={formData.urls.join(",")}
					onChange={(e) =>
						setFormData({
							...formData,
							urls: e.target.value
								.split(",")
								.map((u) => u.trim()),
						})
					}
				/>
			</label>
			<label>
				Checklist (comma separated)
				<input
					type="text"
					value={formData.checklist.join(",")}
					onChange={(e) =>
						setFormData({
							...formData,
							checklist: e.target.value
								.split(",")
								.map((c) => c.trim()),
						})
					}
				/>
			</label>
			<label>
				Share With (comma separated)
				<input
					type="text"
					value={formData.share_with.join(",")}
					onChange={(e) =>
						setFormData({
							...formData,
							share_with: e.target.value
								.split(",")
								.map((s) => s.trim()),
						})
					}
				/>
			</label>
			<label>
				Public
				<input
					type="checkbox"
					checked={formData.is_public}
					onChange={(e) =>
						setFormData({
							...formData,
							is_public: e.target.checked,
						})
					}
				/>
			</label>
			<label>
				Notification Time
				<input
					type="datetime-local"
					value={formData.notification_time}
					onChange={(e) =>
						setFormData({
							...formData,
							notification_time: e.target.value,
						})
					}
				/>
			</label>
			<div className="modal-actions">
				<Button onClick={handleSubmit}>Add</Button>
				<Button onClick={onClose}>Cancel</Button>
			</div>
		</Modal>
	);
}
