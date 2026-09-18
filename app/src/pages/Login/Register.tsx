import { Link } from 'react-router-dom';
import { useRegister } from './useRegister';
import { IconEye, IconEyeOff } from './icons';

const Register = () => {
    const {
        nombre, setNombre,
        correo, setCorreo,
        username, setUsername,
        password, setPassword,
        confirmPassword, setConfirmPassword,
        showPassword, setShowPassword,
        error, success, loading,
        handleRegister,
    } = useRegister();

    return (
        <div className="auth-page-bg">
            <div className="auth-container" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        letterSpacing: '-0.04em',
                        color: 'var(--text-primary)',
                        lineHeight: 1,
                    }}>
                        Ambienta ERP
                    </div>
                    <div style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.4rem',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        fontWeight: 500,
                    }}>
                        Crear cuenta
                    </div>
                </div>

                <div className="card" style={{
                    padding: '2rem',
                    boxShadow: 'var(--shadow-elevated)',
                    border: '1px solid var(--border-color)',
                }}>
                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        {error && (
                            <div style={{
                                padding: '0.75rem 1rem',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--accent-danger)',
                                fontSize: '0.875rem',
                            }}>
                                {error}
                            </div>
                        )}

                        {success && (
                            <div style={{
                                padding: '0.75rem 1rem',
                                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.2)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--accent-success)',
                                fontSize: '0.875rem',
                            }}>
                                {success}
                            </div>
                        )}

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" htmlFor="nombre">Nombre completo</label>
                            <input
                                id="nombre" type="text" className="form-input"
                                placeholder="Tu nombre" value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required autoFocus
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" htmlFor="correo">Correo electrónico</label>
                            <input
                                id="correo" type="email" className="form-input"
                                placeholder="tu@correo.com" value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" htmlFor="username">Nombre de usuario</label>
                            <input
                                id="username" type="text" className="form-input"
                                placeholder="Elige un usuario" value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required autoComplete="username"
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" htmlFor="password">Contraseña</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="Mín. 8 caracteres, mayúscula, número y símbolo"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoComplete="new-password"
                                    style={{ paddingRight: '2.75rem' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: '0.75rem', top: '50%',
                                        transform: 'translateY(-50%)', background: 'none', border: 'none',
                                        color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                                >
                                    {showPassword ? <IconEyeOff /> : <IconEye />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" htmlFor="confirmPassword">Confirmar contraseña</label>
                            <input
                                id="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                className="form-input"
                                placeholder="Repite tu contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                            style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem', fontSize: '0.95rem', fontWeight: 600 }}
                        >
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>
                    </form>
                </div>

                <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: 600, textDecoration: 'none' }}>
                        Inicia sesión
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
