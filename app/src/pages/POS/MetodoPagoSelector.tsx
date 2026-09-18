interface MetodoPagoSelectorProps {
    metodoPago: string;
    setMetodoPago: (v: string) => void;
    setNumeroTransferencia: (v: string) => void;
    hasProductoAgotado: boolean;
}

export const MetodoPagoSelector = ({ metodoPago, setMetodoPago, setNumeroTransferencia, hasProductoAgotado }: MetodoPagoSelectorProps) => {
    return (
        <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Método de pago</label>
            {hasProductoAgotado && (
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '0 0 0.4rem' }}>
                    Hay un producto agotado en el carrito: la venta debe registrarse como Cotización.
                </p>
            )}
            <div className="pos-method-group" role="group" aria-label="Método de pago">
                {[
                    { value: 'efectivo', label: 'Efectivo' },
                    { value: 'tarjeta', label: 'Tarjeta' },
                    { value: 'bac', label: 'BAC' },
                    { value: 'lafise', label: 'Lafise' },
                    { value: 'mixto', label: 'Mixto' },
                    { value: 'credito', label: 'Crédito' },
                    { value: 'cotizacion', label: 'Cotización' },
                ].map(opt => {
                    const disabled = hasProductoAgotado && opt.value !== 'cotizacion';
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            disabled={disabled}
                            className={`pos-method-pill${metodoPago === opt.value ? ' pos-method-pill--active' : ''}${opt.value === 'credito' ? ' pos-method-pill--credit' : ''}${opt.value === 'cotizacion' ? ' pos-method-pill--cotizacion' : ''}${opt.value === 'mixto' ? ' pos-method-pill--mixto' : ''}`}
                            style={disabled ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
                            onClick={() => {
                                if (disabled) return;
                                setMetodoPago(opt.value);
                                if (!['bac', 'lafise'].includes(opt.value)) setNumeroTransferencia('');
                            }}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
