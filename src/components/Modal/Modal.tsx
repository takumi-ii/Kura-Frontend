import React from "react";
import "./modal.css";
interface ModalProps {
	open: boolean;
	onClose: () => void;
	children: React.ReactNode;
}
export function Modal({ open, onClose, children }: ModalProps) {
	if (!open) return null;
	return (
		<div className="modal-backdrop" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				{children}
			</div>
		</div>
	);
}
