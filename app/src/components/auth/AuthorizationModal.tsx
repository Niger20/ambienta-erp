import { Modal } from '../ui/Modal';
import type { AuthModalProps } from './useAuthorizedAction';

/** 100% presentacional — recibe todo por props, cero useState propio. */
export const AuthorizationModal = (props: AuthModalProps) => {
    const { open, label, codeInput, onCodeChange, error, isVerifying, onSubmit, onCancel } = props;

    return (
        <Modal open={open} onClose={() => !isVerifying && onCancel()} maxWidth={400}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ backgroundColor: 'var(--accent-danger-bg)', padding: '1rem', borderRadius: 'var(--radius-full)' }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-danger)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                </div>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>Autorización Requerida</h2>
                {label && (
                    <p style={{ color: 'var(--accent-danger)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', background: 'var(--accent-danger-bg)', padding: '0.3rem 0.75rem', borderRadius: 'var(--radius-sm)', display: 'inline-block' }}>
                        {label}
                    </p>
                )}
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', marginTop: '0.75rem' }}>
                    Solicitud enviada al administrador. Ingresa el <strong>PIN de 6 dígitos</strong> para continuar.
                </p>
                <form onSubmit={onSubmit}>
                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="text"
                            maxLength={6}
                            placeholder="••••••"
                            className="form-input"
                            style={{ textAlign: 'center', fontSize: '2rem', letterSpacing: '0.5em', fontWeight: 700 }}
                            value={codeInput}
                            onChange={(e) => onCodeChange(e.target.value)}
                            required
                            autoFocus
                        />
                        {error && <div style={{ marginTop: '0.5rem', color: 'var(--accent-danger)', fontSize: '0.85rem' }}>{error}</div>}
                    </div>
                    <div className="modal-actions" style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <button type="button" className="btn" style={{ flex: 1 }} onClick={onCancel} disabled={isVerifying}>Cancelar</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isVerifying || codeInput.length !== 6}>
                            {isVerifying ? 'Verificando...' : 'Confirmar PIN'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};
