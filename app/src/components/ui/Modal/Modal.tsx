import { useEffect } from 'react';
import type { ReactNode, CSSProperties } from 'react';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    maxWidth?: string | number;
    children: ReactNode;
    zIndex?: number;
}

interface ModalHeaderProps {
    children: ReactNode;
    style?: CSSProperties;
}

interface ModalActionsProps {
    children: ReactNode;
    style?: CSSProperties;
}

const ModalHeader = ({ children, style }: ModalHeaderProps) => (
    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', ...style }}>
        {children}
    </h2>
);

const ModalActions = ({ children, style }: ModalActionsProps) => (
    <div className="modal-actions" style={style}>
        {children}
    </div>
);

const ModalBase = ({ open, onClose, maxWidth, children, zIndex }: ModalProps) => {
    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            className="modal-backdrop"
            style={zIndex != null ? { zIndex } : undefined}
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="modal-content"
                style={maxWidth != null ? { maxWidth } : undefined}
                onMouseDown={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export const Modal = Object.assign(ModalBase, {
    Header: ModalHeader,
    Actions: ModalActions,
});
