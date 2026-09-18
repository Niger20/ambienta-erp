import { Link } from 'react-router-dom';
import { useVerifyEmail } from './useVerifyEmail';

const VerifyEmail = () => {
    const { status, message } = useVerifyEmail();

    const iconColor = status === 'success' ? 'var(--accent-success)' : status === 'error' ? 'var(--accent-danger)' : 'var(--text-secondary)';

    return (
        <div className="auth-page-bg">
            <div className="auth-container" style={{ width: '100%' }}>
                <div className="card" style={{
                    padding: '2.5rem 2rem',
                    boxShadow: 'var(--shadow-elevated)',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                    <div style={{ fontSize: '2.5rem', color: iconColor }}>
                        {status === 'loading' && '⏳'}
                        {status === 'success' && '✓'}
                        {status === 'error' && '✕'}
                    </div>
                    <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                        {status === 'loading' ? 'Verificando correo' : status === 'success' ? 'Correo verificado' : 'No se pudo verificar'}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{message}</p>

                    {status !== 'loading' && (
                        <Link to="/login" className="btn btn-primary" style={{ marginTop: '0.5rem', textDecoration: 'none' }}>
                            Ir a iniciar sesión
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
