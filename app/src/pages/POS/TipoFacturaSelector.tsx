interface TipoFacturaSelectorProps {
    tipoFactura: 'FISCAL' | 'NO_FISCAL' | null;
    setTipoFactura: (v: 'FISCAL' | 'NO_FISCAL' | null) => void;
}

export const TipoFacturaSelector = ({ tipoFactura, setTipoFactura }: TipoFacturaSelectorProps) => {
    return (
        <div className="form-group" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label className="form-label" style={{ margin: 0, fontWeight: 600, fontSize: '0.82rem' }}>Consecutivo / Factura</label>
                {tipoFactura === 'FISCAL' && <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 700, backgroundColor: 'var(--accent-primary-bg)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Serie F (Fiscal)</span>}
                {tipoFactura === 'NO_FISCAL' && <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700, backgroundColor: 'rgba(2, 132, 199, 0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Serie S (No Fiscal)</span>}
                {tipoFactura === null && <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, backgroundColor: 'var(--bg-secondary)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Sin Consecutivo</span>}
            </div>
            <div className="pos-method-group" role="group" aria-label="Tipo de factura" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {[
                    { value: 'FISCAL', label: 'Fiscal (F)' },
                    { value: 'NO_FISCAL', label: 'No Fiscal (S)' },
                    { value: 'SIN_CONSECUTIVO', label: 'Sin Consecutivo' },
                ].map(opt => {
                    const isSelected = (opt.value === 'SIN_CONSECUTIVO' && tipoFactura === null) || tipoFactura === opt.value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            className={`pos-method-pill${isSelected ? ' pos-method-pill--active' : ''}`}
                            style={{
                                fontSize: '0.76rem',
                                padding: '0.45rem 0.4rem',
                                fontWeight: 600,
                                ...(isSelected && opt.value === 'NO_FISCAL' ? { backgroundColor: '#0284c7', borderColor: '#0284c7', color: '#ffffff' } : {}),
                                ...(isSelected && opt.value === 'SIN_CONSECUTIVO' ? { backgroundColor: '#64748b', borderColor: '#64748b', color: '#ffffff' } : {})
                            }}
                            onClick={() => setTipoFactura(opt.value === 'SIN_CONSECUTIVO' ? null : (opt.value as any))}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
