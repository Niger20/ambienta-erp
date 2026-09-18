interface SuccessModalProps {
    show: boolean;
    whatsappMessage: string;
    whatsappLink: string;
    onClose: () => void;
    onCopy: () => void;
}

/** NOTA: no usa el Modal compartido — el original no cierra al hacer click en el backdrop. */
export const SuccessModal = ({ show, whatsappMessage, whatsappLink, onClose, onCopy }: SuccessModalProps) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content" style={{ textAlign: 'center', maxWidth: '400px' }}>
                <h2 style={{ color: 'var(--accent-success)', marginBottom: '0.5rem', fontSize: '1.4rem', fontWeight: 700, marginTop: '0.5rem' }}>Venta exitosa</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>La transacción se registró correctamente.</p>

                <div style={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', textAlign: 'left', marginBottom: '1.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                    <pre style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', whiteSpace: 'pre-wrap', color: 'var(--text-primary)' }}>
                        {whatsappMessage}
                    </pre>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ backgroundColor: '#25D366', color: 'white', border: 'none' }} onClick={onClose}>
                        Enviar por WhatsApp
                    </a>
                    <button className="btn" onClick={onCopy}>
                        Copiar texto
                    </button>
                    <button className="btn" style={{ marginTop: '0.25rem' }} onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
