import { useState, useEffect } from "react";
import { Modal } from "../../../components/Modal/Modal";
import { get_user_profile } from "../../../utils/profile"; // Assuming you have a profile utility to fetch user data
import LogoutButton from "../../../components/LogoutButton";

interface ProfileModalProps {
	open: boolean;
	id: string;
	username: string;
	first_name: string;
	last_name: string;
	email: string;
	lastLogin: string;
	profile_picture?: string;
	onClose: () => void;
}

export function ProfileModal({ open, onClose }: ProfileModalProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [id, setId] = useState("");
	const [username, setUsername] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [profilePicture, setProfilePicture] = useState<string | undefined>(
		undefined
	);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [lastLogin, setLastLogin] = useState("");

	useEffect(() => {
		(async () => {
			const profile = await get_user_profile();
			// console.log("Raw profile:", profile);
			setId(profile.id);
			setFirstName(profile.first_name);
			setLastName(profile.last_name);
			setProfilePicture(profile.profile_image);
			setUsername(profile.username);
			setEmail(profile.email);
			setLastLogin(profile.last_login);
		})();
	}, []);

	return (
		<Modal open={open} onClose={onClose}>
			<div className="profile-modal-inside">
				<div className="profile-header">
					<h2>プロフィール</h2>
					<img
						src={profilePicture}
						alt="profile"
						className="profile-picture-modal"
					/>
				</div>
				<div className="profile-modal-details">
					{!isEditing && (
						<>
							<p>
								ユーザー名: <span>{username}</span>
							</p>
							<p>
								First Name: <span>{firstName}</span>
							</p>
							<p>
								Last Name: <span>{lastName}</span>
							</p>
							<p>
								メール: <span>{email}</span>
							</p>
							<p>
								Last Login: <span>{lastLogin}</span>
							</p>
						</>
					)}
					{isEditing && (
						<>
							<label>
								ユーザー名:
								<input
									value={username}
									type="text"
									placeholder={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
								/>
							</label>
							<label>
								メール:
								<input
									type="email"
									value={email}
									placeholder={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</label>
							<label>
								パスワード:
								<input
									type="password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
									placeholder="パスワード"
								/>
							</label>
						</>
					)}
					<p>
						最終ログイン: <span>{lastLogin}</span>
					</p>
				</div>
				<div className="profile-modal-actions">
					{isEditing && (
						<button onClick={() => setIsEditing(false)}>
							save
						</button>
					)}
					<button onClick={() => setIsEditing((prev) => !prev)}>
						{isEditing ? "キャンセル" : "プロフィール編集"}
					</button>
					<LogoutButton />
					<button onClick={onClose}>✖️</button>
				</div>
			</div>
		</Modal>
	);
}
