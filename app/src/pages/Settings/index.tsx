import Swal from 'sweetalert2';
import { themeOptions } from './types';
import { useThemeSettings } from './useThemeSettings';
import { useCompanyParams } from './useCompanyParams';

const triggerConfirmAlert = () => {
    Swal.fire({
        title: '¿Confirmar Acción de Prueba?',
        text: 'Esta es una alerta de prueba del sistema. Observa cómo hereda y respeta la paleta del tema seleccionado.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Cancelar'
    });
};

const Settings = () => {
    const { currentTheme, handleThemeChange } = useThemeSettings();
    const { tasaCambio, setTasaCambio, savingParams, handleSaveParams } = useCompanyParams();

    return (
        <div className="page-container">
            <div>
                <h2 className="card-title" style={{ fontSize: '1.5rem' }}>Ajustes del Sistema</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    Personaliza la apariencia general de la aplicación, los parámetros operativos y las alertas.
                </p>
            </div>

            <div className="responsive-grid" style={{ gap: '1.5rem' }}>
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

                {/* ── SECCIÓN DE ALERTAS ── */}
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'flex-start' }}>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Prueba de Alertas</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                            Comprueba cómo lucen las alertas del sistema adaptadas automáticamente al tema visual activo.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: 'auto', marginBottom: 'auto' }}>
                        <button
                            className="btn btn-primary"
                            onClick={triggerConfirmAlert}
                            style={{ gap: '0.5rem', fontWeight: 600, fontSize: '0.875rem', width: '100%', height: '44px' }}
                        >
                            ⚠️ Disparar Alerta de Prueba
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
