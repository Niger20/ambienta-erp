import { themeOptions } from './types';
import { useThemeSettings } from './useThemeSettings';
import { useCompanyParams } from './useCompanyParams';
import { useProfile } from './useProfile';

const Settings = () => {
    const { currentTheme, handleThemeChange } = useThemeSettings();
    const { tasaCambio, setTasaCambio, savingParams, handleSaveParams } = useCompanyParams();
    const {
        isLoading: profileLoading,
        form: profileForm, setForm: setProfileForm,
        saving: savingProfile, handleSaveProfile,
        passwordForm, setPasswordForm,
        changingPassword, handleChangePassword,
        correoVerificado, resending, handleResendVerification,
    } = useProfile();

    return (
        <div className="page-container">
            <div>
                <h2 className="card-title" style={{ fontSize: '1.5rem' }}>Ajustes del Sistema</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Personaliza la apariencia general de la aplicación y los parámetros operativos.
                </p>
            </div>

            <div className="responsive-grid" style={{ gap: '1.5rem' }}>
                {/* ── MI PERFIL ── */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Mi Perfil</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Consulta y actualiza tu información personal.
                        </p>
                    </div>

                    {profileLoading ? (
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Cargando perfil...</div>
                    ) : (
                        <>
                            {!correoVerificado && profileForm.correo && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem',
                                    padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-md)',
                                    backgroundColor: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)',
                                    fontSize: '0.8rem', color: 'var(--accent-warning)',
                                }}>
                                    <span>Tu correo aún no está verificado.</span>
                                    <button
                                        type="button"
                                        className="btn"
                                        onClick={handleResendVerification}
                                        disabled={resending}
                                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', flexShrink: 0 }}
                                    >
                                        {resending ? 'Enviando...' : 'Reenviar'}
                                    </button>
                                </div>
                            )}

                            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Nombre</label>
                                    <input type="text" className="form-input" value={profileForm.nombre}
                                        onChange={e => setProfileForm(prev => ({ ...prev, nombre: e.target.value }))} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Apellido</label>
                                    <input type="text" className="form-input" value={profileForm.apellido}
                                        onChange={e => setProfileForm(prev => ({ ...prev, apellido: e.target.value }))} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Correo electrónico</label>
                                    <input type="email" className="form-input" value={profileForm.correo}
                                        onChange={e => setProfileForm(prev => ({ ...prev, correo: e.target.value }))} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Teléfono</label>
                                    <input type="text" className="form-input" value={profileForm.telefono}
                                        onChange={e => setProfileForm(prev => ({ ...prev, telefono: e.target.value }))} />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">URL de foto de perfil</label>
                                    <input type="text" className="form-input" placeholder="https://..." value={profileForm.fotoperfil}
                                        onChange={e => setProfileForm(prev => ({ ...prev, fotoperfil: e.target.value }))} />
                                    {profileForm.fotoperfil && (
                                        <img
                                            src={profileForm.fotoperfil}
                                            alt="Vista previa"
                                            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', marginTop: '0.5rem', border: '1px solid var(--border-color)' }}
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    )}
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={savingProfile}
                                    style={{ fontWeight: 600, fontSize: '0.875rem', width: '100%', height: '44px' }}>
                                    {savingProfile ? 'Guardando...' : 'Guardar Perfil'}
                                </button>
                            </form>

                            <details>
                                <summary style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                                    Cambiar contraseña
                                </summary>
                                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Contraseña actual</label>
                                        <input type="password" className="form-input" value={passwordForm.contrasenaActual}
                                            onChange={e => setPasswordForm(prev => ({ ...prev, contrasenaActual: e.target.value }))} required />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Contraseña nueva</label>
                                        <input type="password" className="form-input" value={passwordForm.contrasenaNueva}
                                            onChange={e => setPasswordForm(prev => ({ ...prev, contrasenaNueva: e.target.value }))} required />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Confirmar contraseña nueva</label>
                                        <input type="password" className="form-input" value={passwordForm.confirmarNueva}
                                            onChange={e => setPasswordForm(prev => ({ ...prev, confirmarNueva: e.target.value }))} required />
                                    </div>
                                    <button type="submit" className="btn" disabled={changingPassword}
                                        style={{ fontWeight: 600, fontSize: '0.875rem', width: '100%', height: '44px' }}>
                                        {changingPassword ? 'Actualizando...' : 'Cambiar Contraseña'}
                                    </button>
                                </form>
                            </details>
                        </>
                    )}
                </div>

                {/* ── SECCIÓN DE TEMAS ── */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Temas Visuales</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Cambia la paleta de colores global de la aplicación.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {themeOptions.map((option) => {
                            const isActive = currentTheme === option.id;
                            return (
                                <div
                                    key={option.id}
                                    onClick={() => handleThemeChange(option.id)}
                                    className="card-interactive"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '1rem 1.25rem',
                                        borderRadius: 'var(--radius-md)',
                                        border: isActive ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                                        backgroundColor: isActive ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-dark)',
                                        transition: 'all 200ms var(--ease-out)'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '50%',
                                            overflow: 'hidden',
                                            border: '1px solid var(--border-color)',
                                            flexShrink: 0
                                        }}>
                                            <div style={{ backgroundColor: option.colors.bg }} />
                                            <div style={{ backgroundColor: option.colors.card }} />
                                            <div style={{ backgroundColor: option.colors.accent }} />
                                            <div style={{ backgroundColor: option.colors.text }} />
                                        </div>

                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                                {option.name} {isActive && <span style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>✓ Activo</span>}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                                                {option.desc}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── SECCIÓN DE PARÁMETROS ── */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Parámetros de Configuración</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Modifica las variables operacionales clave para el cálculo de facturas y entregas.
                        </p>
                    </div>

                    <form onSubmit={handleSaveParams} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ fontWeight: 500 }}>Tasa de Cambio Oficial (NIO / USD) *</label>
                            <input
                                type="number"
                                step="0.0001"
                                min="0.0001"
                                className="form-input"
                                value={tasaCambio}
                                onChange={e => setTasaCambio(e.target.value)}
                                style={{ width: '100%', height: '40px' }}
                                required
                            />
                        </div>


                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={savingParams}
                            style={{ gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem', width: '100%', height: '44px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                            {savingParams ? 'Guardando Cambios...' : 'Guardar Parámetros'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
