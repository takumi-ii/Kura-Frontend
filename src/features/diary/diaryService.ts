import axios from "../../services/axios";
import type { DiaryEntry } from "../../types/calendar";
import type { CreateDiaryEntryData } from "../../types/diary";

export async function fetchDiaryEntries(
	startDate: string,
	endDate: string
): Promise<DiaryEntry[]> {
	const response = await axios.get<DiaryEntry[]>(
		//TO-DO neet to fix this
		`/diary/entries/?start_date=${startDate}&end_date=${endDate}`,
		{ withCredentials: true }
	);
	return response.data;
}

// export async function createDiaryEntry(data: {
// 	title: string;
// 	body: string;
// 	book_id: string;
// 	images?: File[];
// }) {
// 	const form = new FormData();
// 	form.append("title", data.title);
// 	form.append("body", data.body);
// 	form.append("book_id", data.book_id);
// 	if (data.images) {
// 		data.images.forEach((img) => form.append("images", img));
// 	}
// 	await axios.post("/diary/entry/", form, { withCredentials: true });
// }

export async function createDiaryEntry(data: CreateDiaryEntryData) {
	const form = new FormData();
	form.append("title", data.title);
	if (data.entry_date) {
		form.append("entry_date", data.entry_date);
	}
	form.append("body", data.body);
	form.append("status", data.status);
	data.tags.forEach((tag) => form.append("tags", tag));
	form.append("is_public", data.is_public ? "True" : "False");
	form.append("book_id", data.book_id);
	form.append("shared_users", JSON.stringify(data.shared_users));
	if (data.images) {
		data.images.forEach((img) => form.append("images", img));
	}
	await axios.post("/diary/entry/", form, { withCredentials: true });
}

export async function fetchDiaryEntry(entryId: string): Promise<DiaryEntry> {
	const res = await axios.get<DiaryEntry>(`/diary/entry/${entryId}/`, {
		withCredentials: true,
	});
	return res.data;
}

export async function updateDiaryEntry(
	entryId: string,
	data: {
		title: string;
		body: string;
		updated_at: string;
		status: string;
		tags: string[];
		is_public: boolean;
	}
) {
	await axios.patch(`/diary/entry/${entryId}/`, data, {
		withCredentials: true,
	});
}

export async function deleteDiaryEntry(entryId: string, deleteImages = false) {
	await axios.delete(`/diary/entry/${entryId}/`, {
		params: { delete_images: deleteImages },
		withCredentials: true,
	});
}
