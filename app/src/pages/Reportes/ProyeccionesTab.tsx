import { chipStyle } from './types';

interface ProyeccionesTabProps {
    periodoProyeccion: 'semanal' | 'quincenal' | 'mensual';
    setPeriodoProyeccion: (v: 'semanal' | 'quincenal' | 'mensual') => void;
    rlmData: { label: string; totalSales: number }[];
    proyeccionResult: any;
}

export const ProyeccionesTab = ({ periodoProyeccion, setPeriodoProyeccion, rlmData, proyeccionResult }: ProyeccionesTabProps) => {
    const result = proyeccionResult;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header Configuration Card */}
            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <h3 style={{ fontWeight: 700, fontSize: '1.15rem', margin: 0 }}>Proyección Matemática de Ventas</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                            Modelo autorregresivo multivariable para pronosticar los ingresos de la tienda.
                        </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Período:</span>
                        <select
                            className="form-input"
                            style={{ width: 'auto', padding: '0.4rem 0.75rem', height: '36px', borderRadius: '8px', cursor: 'pointer' }}
                            value={periodoProyeccion}
                            onChange={e => setPeriodoProyeccion(e.target.value as any)}
                        >
                            <option value="semanal">Semanal</option>
                            <option value="quincenal">Quincenal (15 días)</option>
                            <option value="mensual">Mensual</option>
                        </select>
                    </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-dark)', padding: '1rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div>
                            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Modelo Utilizado: </span>
                            <code style={{ padding: '0.15rem 0.4rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '4px', color: 'var(--accent-primary)', fontSize: '0.85rem' }}>
                                {result.error ? 'Ninguno' : result.modelType}
                            </code>
                        </div>
                        {!result.error && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    Ajuste R²: <strong style={{ color: 'var(--text-primary)' }}>{((result.rSquared ?? 0) * 100).toFixed(1)}%</strong>
                                </span>
                                <span style={{ padding: '0.2rem 0.55rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.06)', color: result.confidenceColor, border: `1px solid ${result.confidenceColor}` }}>
                                    Confianza {result.confidenceLabel}
                                </span>
                            </div>
                        )}
                    </div>
                    {!result.error && (
                        <div style={{ marginTop: '0.75rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>Ecuación de Regresión Ajustada:</div>
                            <div style={{ fontSize: '1.05rem', fontFamily: 'monospace', color: 'var(--accent-success)', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '6px', display: 'inline-block' }}>
                                Ventas(t) = {(result.beta0 ?? 0).toFixed(2)} + ({(result.beta1 ?? 0).toFixed(2)} × t) {(result.beta2 ?? 0) >= 0 ? '+' : '-'} {Math.abs(result.beta2 ?? 0).toFixed(4)} × Ventas(t-1)
                            </div>
                            <div style={{ fontSize: '0.76rem', marginTop: '0.5rem' }}>
                                Donde: <br />
                                • <strong style={{ color: 'var(--text-primary)' }}>t</strong> representa el índice temporal del período. <br />
                                • <strong style={{ color: 'var(--text-primary)' }}>Ventas(t-1)</strong> representa el volumen de ventas del período anterior con amortiguación.
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {result.error ? (
                <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--accent-warning)' }}>
                    ⚠️ {result.error}
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        El sistema requiere acumular datos de ventas en más de {periodoProyeccion === 'semanal' ? '3 semanas' : periodoProyeccion === 'quincenal' ? '3 quincenas' : '3 meses'} distintas para estimar la tendencia matemática.
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {/* Histórico agrupado */}
                    <div className="card" style={{ flex: '1 1 350px' }}>
                        <h4 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '1rem' }}>Historial del Período Reciente</h4>
                        <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                <thead>
                                    <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Período (t)</th>
                                        <th style={{ padding: '0.5rem', textAlign: 'right' }}>Ventas Reales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rlmData.map((item, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                            <td style={{ padding: '0.6rem 0.5rem', color: 'var(--text-secondary)' }}>{item.label}</td>
                                            <td style={{ padding: '0.6rem 0.5rem', textAlign: 'right', fontWeight: 600 }} className="tabular">C$ {item.totalSales.toLocaleString('es-NI', { minimumFractionDigits: 2 })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Proyecciones futuras */}
                    <div className="card" style={{ flex: '1 1 350px', border: '1px solid var(--accent-primary-border)', backgroundColor: 'var(--accent-primary-bg-light)' }}>
                        <h4 style={{ fontWeight: 'bold', fontSize: '0.95rem', marginBottom: '1rem', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            🔮 Pronósticos Generados (Próximos Períodos)
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {result.proyecciones?.map((p: any, idx: number) => {
                                return (
                                    <div key={idx} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{p.label}</span>
                                            <span style={chipStyle('var(--accent-success)')}>Pronosticado</span>
                                        </div>
                                        <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-success)' }} className="tabular">
                                            C$ {p.predicted.toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
