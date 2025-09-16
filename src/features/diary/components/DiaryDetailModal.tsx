import { Modal } from "../../../components/Modal/Modal";
import { Button } from "../../../components/Button";
import type { DiaryEntry } from "../../../types/calendar";

interface DiaryDetailModalProps {
	open: boolean;
	entry: DiaryEntry | null;
	onEdit: () => void;
	onClose: () => void;
	onDelete: () => void;
}

export function DiaryDetailModal({
	open,
	entry,
	onEdit,
	onClose,
	onDelete,
}: DiaryDetailModalProps) {
	if (!open || !entry) return null;
	return (
		<Modal open={open} onClose={onClose}>
			<h2>{entry.title}</h2>
			<p>{entry.body}</p>
			<small>{new Date(entry.created_at).toLocaleString()}</small>
			{entry.updated_at && (
				<p>
					<strong>Updated:</strong>{" "}
					{new Date(entry.updated_at).toLocaleString()}
				</p>
			)}
			{entry.status && (
				<p>
					<strong>Status:</strong> {entry.status}
				</p>
			)}
			{entry.tags && entry.tags.length > 0 && (
				<p>
					<strong>Tags:</strong> {entry.tags.join(", ")}
				</p>
			)}
			{entry.is_public !== undefined && (
				<p>
					<strong>Public:</strong> {entry.is_public ? "Yes" : "No"}
				</p>
			)}
			{entry.images && entry.images.length > 0 && (
				<div className="diary-images">
					{entry.images.map((img) => (
						<img
							key={img.id}
							src={`http://localhost:8000/api/diary/image/${img.immich_asset_id}/thumbnail/`}
							alt={entry.title}
							style={{ maxWidth: "100%" }}
						/>
					))}
				</div>
			)}
			<div className="modal-actions">
				<Button onClick={onEdit}>Edit</Button>
				<Button onClick={onDelete}>Delete</Button>
				<Button onClick={onClose}>Close</Button>
			</div>
		</Modal>
	);
}
