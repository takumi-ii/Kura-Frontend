export interface CreateDiaryEntryData {
	title: string;
	entry_date: string;
	body: string;
	status: string;
	tags: string[];
	is_public: boolean;
	book_id: string;
	images?: File[];
	shared_users: [];
}
