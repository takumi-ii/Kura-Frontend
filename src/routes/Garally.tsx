import get_phots from "../features/media/garallyService";

export default function Carally() {
	const photos = get_phots();

	return (
		<div className="gallery">
			{/* ④ photos が配列なら map、未定義なら何もレンダーしない */}
			{photos.map((id) => (
				<img
					key={id}
					src={`http://localhost:8000/api/diary/image/${id}/thumbnail/`}
					alt="thumbnail"
				/>
			))}
		</div>
	);
}
