interface DivisaPagoPanelProps {
    divisaPago: 'NIO' | 'USD';
    setDivisaPago: (v: 'NIO' | 'USD') => void;
    setMontoRecibidoUSD: (v: string) => void;
    setShowCambioInfo: (v: boolean) => void;
    showCambioInfo: boolean;
    montoRecibidoNIO: string;
    setMontoRecibidoNIO: (v: string) => void;
    montoRecibidoNIONum: number;
    cambioNIO: number;
    tasaCambio: number;
    totalEnUSD: number;
    montoRecibidoUSD: string;
    montoRecibidoUSDNum: number;
    equivalenteEnCordobas: number;
    cambioEnCordobas: number;
}

export const DivisaPagoPanel = ({
    divisaPago, setDivisaPago, setMontoRecibidoUSD, setShowCambioInfo, showCambioInfo,
    montoRecibidoNIO, setMontoRecibidoNIO, montoRecibidoNIONum, cambioNIO,
    tasaCambio, totalEnUSD, montoRecibidoUSD, montoRecibidoUSDNum, equivalenteEnCordobas, cambioEnCordobas,
}: DivisaPagoPanelProps) => {
    return (
        <div style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Divisa del pago</label>
            <div className="pos-divisa-group">
                <button
                    type="button"
                    className={`pos-divisa-pill${divisaPago === 'NIO' ? ' pos-divisa-pill--nio' : ''}`}
                    onClick={() => { setDivisaPago('NIO'); setMontoRecibidoUSD(''); setShowCambioInfo(false); }}
                >
                    Córdobas (C$)
                </button>
                <button
                    type="button"
                    className={`pos-divisa-pill${divisaPago === 'USD' ? ' pos-divisa-pill--usd' : ''}`}
                    onClick={() => { setDivisaPago('USD'); setShowCambioInfo(true); }}
                >
                    Dólares ($)
                </button>
            </div>

            {/* Córdobas payment details */}
            {divisaPago === 'NIO' && (
                <div style={{ backgroundColor: 'var(--accent-primary-bg)', border: '1px solid var(--accent-primary-border)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
                    <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>Monto recibido en C$</label>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '1rem' }}>C$</span>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="0.00"
                            value={montoRecibidoNIO}
                            onChange={e => setMontoRecibidoNIO(e.target.value)}
                            min="0"
                            step="any"
                            style={{ paddingLeft: '2.5rem', fontWeight: 600, fontSize: '1.05rem', fontVariantNumeric: 'tabular-nums' }}
                        />
                    </div>
                    {montoRecibidoNIONum > 0 && (
                        <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', borderRadius: '8px', backgroundColor: cambioNIO >= 0 ? 'var(--accent-success-bg)' : 'var(--accent-danger-bg)', border: `1px solid ${cambioNIO >= 0 ? 'var(--accent-success-border)' : 'var(--accent-danger-border)'}` }}>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{cambioNIO >= 0 ? 'Cambio:' : 'Falta:'}</span>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: cambioNIO >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)', fontVariantNumeric: 'tabular-nums' }}>
                                C$ {Math.abs(cambioNIO).toFixed(2)}
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Dollar payment details */}
            {divisaPago === 'USD' && showCambioInfo && (
                <div style={{ backgroundColor: 'var(--accent-success-bg)', border: '1px solid var(--accent-success-border)', borderRadius: 'var(--radius-lg)', padding: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        Tasa: <strong style={{ color: 'var(--text-primary)' }}>C$ {tasaCambio.toFixed(4)}</strong> / $1 USD
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem', marginBottom: '0.75rem', backgroundColor: 'rgba(16,185,129,0.08)' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>Total en USD:</span>
                        <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-success)', fontVariantNumeric: 'tabular-nums' }}>$ {totalEnUSD.toFixed(2)}</span>
                    </div>
                    <label className="form-label" style={{ fontSize: '0.8rem', marginBottom: '0.35rem' }}>Monto recibido en USD</label>
                    <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--accent-success)', fontSize: '1rem' }}>$</span>
                        <input
                            type="number"
                            className="form-input"
                            placeholder="0.00"
                            value={montoRecibidoUSD}
                            onChange={e => setMontoRecibidoUSD(e.target.value)}
                            min="0"
                            step="any"
                            style={{ paddingLeft: '1.75rem', fontWeight: 600, fontSize: '1.05rem', fontVariantNumeric: 'tabular-nums' }}
                        />
                    </div>
                    {montoRecibidoUSDNum > 0 && (
                        <div style={{ marginTop: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.3rem', color: 'var(--text-secondary)' }}>
                                <span>Equivalente en C$:</span>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>C$ {equivalenteEnCordobas.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.8rem', borderRadius: '8px', backgroundColor: cambioEnCordobas >= 0 ? 'var(--accent-success-bg)' : 'var(--accent-danger-bg)', border: `1px solid ${cambioEnCordobas >= 0 ? 'var(--accent-success-border)' : 'var(--accent-danger-border)'}` }}>
                                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{cambioEnCordobas >= 0 ? 'Cambio:' : 'Falta:'}</span>
                                <span style={{ fontWeight: 700, fontSize: '1.1rem', color: cambioEnCordobas >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)', fontVariantNumeric: 'tabular-nums' }}>
                                    C$ {Math.abs(cambioEnCordobas).toFixed(2)}
                                </span>
                            </div>
                            {cambioEnCordobas > 0 && (
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textAlign: 'right', marginTop: '0.3rem' }}>
                                    ≈ $ {(cambioEnCordobas / tasaCambio).toFixed(2)} USD
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
