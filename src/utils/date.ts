export function getCurrentDate(): Date {
	return new Date();
}
export function getFormattedDate(): string {
	const d = getCurrentDate();
	const year = d.getFullYear();
	const month = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}
