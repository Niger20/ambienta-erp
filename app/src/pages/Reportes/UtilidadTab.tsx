export const UtilidadTab = ({ utilidadData }: { utilidadData: any }) => (
    <div className="card">
        <h3 style={{ marginBottom: '1.5rem', fontWeight: 600, fontSize: '1.1rem' }}>Estado de Resultados</h3>
        {!utilidadData ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>Sin datos para este rango</div>
        ) : (
            <div className="responsive-grid">
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>Ingresos Totales (Ventas)</div>
                    <div className="tabular" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-success)' }}>
                        C$ {Number(utilidadData.ingresos || utilidadData.ingresosTotales || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>Costo de Ventas</div>
                    <div className="tabular" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-danger)' }}>
                        C$ {Number(utilidadData.costoVentas || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>Gastos Operativos</div>
                    <div className="tabular" style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--accent-warning)' }}>
                        C$ {Number(utilidadData.gastos || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-dark)', borderRadius: 'var(--radius-lg)', border: '2px solid var(--accent-primary)', boxShadow: '0 0 12px var(--accent-primary-bg)' }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.04em' }}>Utilidad Neta</div>
                    <div className="tabular" style={{ fontSize: '1.8rem', fontWeight: 700, color: Number(utilidadData.utilidadNeta || 0) >= 0 ? 'var(--accent-primary)' : 'var(--accent-danger)' }}>
                        C$ {Number(utilidadData.utilidadNeta || utilidadData.utilidadBruta || 0).toLocaleString('es-NI', { minimumFractionDigits: 2 })}
                    </div>
                </div>
            </div>
        )}
    </div>
);
