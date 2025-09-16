import { useState, useEffect } from "react";
import { Modal } from "../../../components/Modal/Modal";
import { Button } from "../../../components/Button";
import type { DiaryEntry } from "../../../types/calendar";

interface EditDiaryModalProps {
	open: boolean;
	entry: DiaryEntry | null;
	onUpdate: (
		entryId: string,
		data: {
			title: string;
			body: string;
			updated_at: string;
			status: string;
			tags: string[];
			is_public: boolean;
		}
	) => void;
	onClose: () => void;
}

export function EditDiaryModal({
	open,
	entry,
	onUpdate,
	onClose,
}: EditDiaryModalProps) {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [updatedAt, setUpdatedAt] = useState("");
	const [status, setStatus] = useState("draft");
	const [tags, setTags] = useState<string[]>([]);
	const [isPublic, setIsPublic] = useState(false);

	useEffect(() => {
		if (entry && open) {
			setTitle(entry.title);
			setBody(entry.body);
			setUpdatedAt(entry.updated_at || "");
			setStatus(entry.status || "draft");
			setTags(entry.tags || []);
			setIsPublic(entry.is_public ?? false);
		}
	}, [entry, open]);

	const handleSubmit = () => {
		if (!entry) return;
		onUpdate(entry.id, {
			title,
			body,
			updated_at: updatedAt,
			status,
			tags,
			is_public: isPublic,
		});
	};

	if (!entry) return null;

	return (
		<Modal open={open} onClose={onClose}>
			<h2>Edit Diary</h2>
			<label>
				Title
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</label>
			<label>
				Body
				<textarea
					value={body}
					onChange={(e) => setBody(e.target.value)}
				/>
			</label>
			<label>
				Updated At
				<input
					type="text"
					value={updatedAt}
					onChange={(e) => setUpdatedAt(e.target.value)}
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
			<div className="modal-actions">
				<Button onClick={handleSubmit}>Save</Button>
				<Button onClick={onClose}>Cancel</Button>
			</div>
		</Modal>
	);
}
