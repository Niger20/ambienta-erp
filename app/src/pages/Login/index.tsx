import { Link } from 'react-router-dom';
import { useLogin } from './useLogin';
import { IconEye, IconEyeOff } from './icons';

const Login = () => {
    const {
        username, setUsername,
        password, setPassword,
        showPassword, setShowPassword,
        error, loading, handleLogin,
    } = useLogin();

    return (
        <div className="auth-page-bg">
            <div className="auth-container" style={{ width: '100%' }}>
                {/* Brand mark above card */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        letterSpacing: '-0.04em',
                        color: 'var(--text-primary)',
                        lineHeight: 1,
                    }}>
                        Ambienta POS
                    </div>
                    <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.4rem',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                    }}>
                        Sistema de Gestión
                    </div>
                </div>

                <div className="card" style={{
                    padding: '2rem',
                    boxShadow: 'var(--shadow-elevated)',
                    border: '1px solid var(--border-color)',
                }}>
                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {error && (
                            <div style={{
                                padding: '0.75rem 1rem',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--accent-danger)',
                                fontSize: '0.875rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" htmlFor="username">
                                Usuario
                            </label>
                            <input
                                id="username"
                                type="text"
                                className="form-input"
                                placeholder="Ingresa tu usuario"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoFocus
                                autoComplete="username"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" htmlFor="password">
                                Contraseña
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    style={{ paddingRight: '2.75rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '0.75rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        padding: '0.25rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                                >
                                    {showPassword ? <IconEyeOff /> : <IconEye />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '0.85rem',
                                marginTop: '0.5rem',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                            }}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="10" />
                                    </svg>
                                    Iniciando sesión...
                                </span>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </form>
                </div>

                <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    ¿No tienes cuenta?{' '}
                    <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
                        Regístrate
                    </Link>
                </div>

                {/* Footer */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '0.75rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    opacity: 0.5,
                }}>
                    Sistema interno · Ambienta POS
                </div>
            </div>
        </div>
    );
};

export default Login;
