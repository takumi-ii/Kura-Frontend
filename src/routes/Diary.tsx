import { useEffect, useState, type JSX } from "react";
import {
	fetchDiaryEntries,
	fetchDiaryEntry,
	createDiaryEntry,
	updateDiaryEntry,
	deleteDiaryEntry,
} from "../features/diary/diaryService";
import { AddDiaryModal } from "../features/diary/components/AddDiaryModal";
import { DiaryDetailModal } from "../features/diary/components/DiaryDetailModal";
import { EditDiaryModal } from "../features/diary/components/EditDiaryModal";
import { ProfileModal } from "../features/calendar/components/ProfileModal";
import "./calendar.css";
import type { DiaryEntry } from "../types/calendar";
import { get_user_profile } from "../utils/profile";
import type { CreateDiaryEntryData } from "../types/diary";
import "./diary.css";

export default function Diary(): JSX.Element {
	const [entries, setEntries] = useState<DiaryEntry[]>([]);
	const [showAdd, setShowAdd] = useState(false);
	const [showProfile, setShowProfile] = useState(false);
	const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null);
	const [showDetail, setShowDetail] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [profileImage, setProfileImage] = useState<string | undefined>(
		undefined
	);

	const loadEntries = async () => {
		const now = new Date();
		const start = new Date(
			now.getFullYear(),
			now.getMonth(),
			1
		).toISOString();
		const end = new Date(
			now.getFullYear(),
			now.getMonth() + 1,
			0,
			23,
			59,
			59
		).toISOString();
		try {
			const data = await fetchDiaryEntries(start, end);
			setEntries(data);
		} catch (e) {
			console.error(e);
		}
	};

	useEffect(() => {
		(async () => {
			const profile = await get_user_profile();
			// console.log("Raw profile:", profile);

			// diarybook_ids がオブジェクト配列なので id のみ抽出
			const profile_image = profile.profile_image;
			setProfileImage(profile_image);
		})();
		loadEntries();
	}, []);

	// const handleAdd = async (data: {
	// 	title: string;
	// 	body: string;
	// 	book_id: string;
	// 	images?: File[];
	// }) => {
	// 	try {
	// 		await createDiaryEntry(data);
	// 		await loadEntries();
	// 	} catch (e) {
	// 		console.error(e);
	// 	}
	// };
	const handleAdd = async (data: CreateDiaryEntryData) => {
		try {
			await createDiaryEntry(data);
			await loadEntries();
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
			await loadEntries();
			setShowEdit(false);
			setSelectedEntry(null);
		} catch (e) {
			console.error(e);
		}
	};

	const handleEntryClick = async (entryId: string) => {
		try {
			const data = await fetchDiaryEntry(entryId);
			setSelectedEntry(data);
			setShowDetail(true);
		} catch (e) {
			console.error(e);
		}
	};

	const handleDelete = async (entryId: string) => {
		try {
			await deleteDiaryEntry(entryId);
			await loadEntries();
			setShowDetail(false);
			setSelectedEntry(null);
		} catch (e) {
			console.error(e);
		}
	};

	return (
		<>
			<div className="calendar-container">
				<header className="calendar-header">
					<div className="menu-left">
						<span className="logo">📔 Diary</span>
					</div>
					<div className="menu-right">
						<button onClick={() => setShowAdd(true)}>＋</button>
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
				<ul>
					{entries.map((e) => (
						<li
							key={e.id}
							style={{ marginBottom: "1rem", cursor: "pointer" }}
							onClick={() => {
								setSelectedEntry(e);
								setShowDetail(true);
								handleEntryClick(e.id);
							}}
						>
							<h3>{e.title}</h3>
							{e.images && e.images.length > 0 && (
								<img
									src={`http://localhost:8000/api/diary/image/${e.images[0].immich_asset_id}/thumbnail/`}
									alt={e.title}
									style={{ maxWidth: "100%" }}
								/>
							)}
							<p>{e.body}</p>
							<small>
								{new Date(e.created_at).toLocaleDateString()}
							</small>
						</li>
					))}
				</ul>
			</div>
			<AddDiaryModal
				open={showAdd}
				onAdd={handleAdd}
				onClose={() => setShowAdd(false)}
			/>
			<DiaryDetailModal
				open={showDetail}
				entry={selectedEntry}
				onEdit={() => {
					setShowDetail(false);
					setShowEdit(true);
				}}
				//
				onDelete={async () => {
					if (!selectedEntry) return;
					// 1) 削除 API 呼び出し
					await handleDelete(selectedEntry.id);
					// 2) 削除が終わったらモーダルを閉じる
					setShowDetail(false);
				}}
				onClose={() => setShowDetail(false)}
			/>
			<EditDiaryModal
				open={showEdit}
				entry={selectedEntry}
				onUpdate={handleUpdate}
				onClose={() => {
					setShowEdit(false);
					setSelectedEntry(null);
				}}
			/>
			<ProfileModal
				open={showProfile}
				username="demo"
				email="demo@example.com"
				lastLogin={new Date().toISOString()}
				onClose={() => setShowProfile(false)}
			/>
		</>
	);
}
