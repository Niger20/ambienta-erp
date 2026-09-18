interface DescuentoFacturaControlProps {
    tipoDescuentoFactura: 'FIXED' | 'PERCENT';
    setTipoDescuentoFactura: (v: 'FIXED' | 'PERCENT') => void;
    descuentoFactura: string;
    setDescuentoFactura: (v: string) => void;
    montoDescuentoFactura: number;
}

export const DescuentoFacturaControl = ({
    tipoDescuentoFactura, setTipoDescuentoFactura, descuentoFactura, setDescuentoFactura, montoDescuentoFactura,
}: DescuentoFacturaControlProps) => {
    return (
        <div style={{ margin: '0.5rem 0', padding: '0.6rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Descuento Factura</span>
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                    <button
                        type="button"
                        onClick={() => setTipoDescuentoFactura('FIXED')}
                        style={{
                            border: 'none',
                            backgroundColor: tipoDescuentoFactura === 'FIXED' ? 'var(--accent-primary)' : 'transparent',
                            color: tipoDescuentoFactura === 'FIXED' ? '#fff' : 'var(--text-secondary)',
                            borderRadius: '4px',
                            padding: '0.15rem 0.4rem',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        C$
                    </button>
                    <button
                        type="button"
                        onClick={() => setTipoDescuentoFactura('PERCENT')}
                        style={{
                            border: 'none',
                            backgroundColor: tipoDescuentoFactura === 'PERCENT' ? 'var(--accent-primary)' : 'transparent',
                            color: tipoDescuentoFactura === 'PERCENT' ? '#fff' : 'var(--text-secondary)',
                            borderRadius: '4px',
                            padding: '0.15rem 0.4rem',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                        }}
                    >
                        %
                    </button>
                </div>
            </div>
            <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {tipoDescuentoFactura === 'FIXED' ? 'C$' : '%'}
                </span>
                <input
                    type="number"
                    className="form-input"
                    style={{ paddingLeft: '1.8rem', height: '2.1rem', fontSize: '0.85rem', fontVariantNumeric: 'tabular-nums' }}
                    placeholder={tipoDescuentoFactura === 'FIXED' ? '0.00' : '0%'}
                    min={0}
                    max={tipoDescuentoFactura === 'PERCENT' ? 100 : undefined}
                    step="any"
                    value={descuentoFactura}
                    onChange={e => setDescuentoFactura(e.target.value)}
                />
            </div>
            {montoDescuentoFactura > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--accent-danger)', marginTop: '0.35rem' }}>
                    <span>Ahorro factura:</span>
                    <strong>− C$ {montoDescuentoFactura.toFixed(2)}</strong>
                </div>
            )}
        </div>
    );
};
