import { useState, useEffect } from "react";
import { Modal } from "../../../components/Modal/Modal";
import { Button } from "../../../components/Button";
import { get_user_profile } from "../../../utils/profile";
import type { CreateDiaryEntryData } from "../../../types/diary";
import { getFormattedDate } from "../../../utils/date";

interface AddDiaryModalProps {
	// open: boolean;
	// onAdd: (data: {
	// 	title: string;
	// 	entry_date: string;
	// 	body: string;
	// 	status: string;
	// 	tags: string[];
	// 	is_public: boolean;
	// 	book_id: string;
	// 	images?: File[];
	// }) => void;
	// onClose: () => void;
	open: boolean;
	onAdd: (data: CreateDiaryEntryData) => void;
	onClose: () => void;
}

export function AddDiaryModal({ open, onAdd, onClose }: AddDiaryModalProps) {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [bookId, setBookId] = useState("");
	const [status, setStatus] = useState("draft");
	const [tags, setTags] = useState<string[]>([]);
	const [isPublic, setIsPublic] = useState(false);
	const [images, setImages] = useState<File[]>([]);
	const [bookIds, setBookIds] = useState<string[]>([]);
	const [entry_date, setEntryDate] = useState(getFormattedDate());
	// const [entryDate, setEntryDate] = useState<string>(
	// 	new Date().toISOString().split("T")[0]
	// );

	useEffect(() => {
		(async () => {
			const profile = await get_user_profile();
			// console.log("Raw profile:", profile);

			// diarybook_ids がオブジェクト配列なので id のみ抽出
			const books = (profile.diarybook_ids ?? []).map(
				(b: { id: string; name: string }) => b.id
			);
			setBookIds(books[0] ? books : [""]); // 最初の book_id をデフォルトに設定
			// console.log("Mapped book IDs:", books[0]);
		})();
	}, []);

	useEffect(() => {
		if (open) {
			setEntryDate(getFormattedDate());
		}
	}, [open]);

	const handleSubmit = () => {
		if (!title || !bookId) return;
		onAdd({
			title,
			entry_date,
			body,
			status,
			tags,
			book_id: bookId,
			is_public: isPublic,
			images,
			shared_users: [],
		});
		setTitle("");
		setBody("");
		setEntryDate("");
		setImages([]);
		setStatus("draft");
		setTags([]);
		setIsPublic(false);
		onClose();
	};

	useEffect(() => {
		if (open && bookIds.length > 0) {
			setBookId(bookIds[0]);
		}
	}, [open, bookIds]);

	return (
		<Modal open={open} onClose={onClose}>
			<h2>日記追加</h2>
			<label>
				Date:
				<input
					type="date"
					value={entry_date}
					onChange={(e) => setEntryDate(e.target.value)}
				/>
			</label>
			<label>
				タイトル
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</label>
			<label>
				本文
				<textarea
					value={body}
					onChange={(e) => setBody(e.target.value)}
				/>
			</label>
			<label>
				Status
				<select
					value={status}
					onChange={(e) => setStatus(e.target.value)}
				>
					<option value="draft">draft</option>
					<option value="complete">complete</option>
				</select>
			</label>
			<label>
				Tags (comma separated)
				<input
					type="text"
					value={tags.join(",")}
					onChange={(e) =>
						setTags(e.target.value.split(",").map((t) => t.trim()))
					}
				/>
			</label>
			<label>
				Public
				<input
					type="checkbox"
					checked={isPublic}
					onChange={(e) => setIsPublic(e.target.checked)}
				/>
			</label>
			<label>
				Images
				<input
					type="file"
					multiple
					onChange={(e) =>
						setImages(
							e.target.files ? Array.from(e.target.files) : []
						)
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
