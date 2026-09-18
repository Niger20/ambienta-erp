import { useCustomerDisplayData } from './useCustomerDisplayData';

const CustomerDisplay = () => {
    const { data, lastAddedId, connected } = useCustomerDisplayData();

    const currentDate = new Date().toLocaleDateString('es-HN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="cd-container">
            {/* Header */}
            <header className="cd-header">
                <div className="cd-header-left">
                    <h1 className="cd-logo">Ambienta POS</h1>
                    <p className="cd-date">{currentDate}</p>
                </div>
                <div className="cd-header-right">
                    <div className={`cd-status ${connected ? 'cd-status-ok' : ''}`}>
                        <span className="cd-status-dot"></span>
                        {connected ? 'Conectado' : 'Esperando conexión...'}
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="cd-main">
                {data.lineas.length === 0 ? (
                    <div className="cd-welcome">
                        <div className="cd-welcome-icon">🛒</div>
                        <h2>¡Bienvenido!</h2>
                        <p>Los productos escaneados aparecerán aquí</p>
                    </div>
                ) : (
                    <div className="cd-layout">
                        {/* Product list */}
                        <div className="cd-products">
                            <div className="cd-products-header">
                                <span>Producto</span>
                                <span style={{ textAlign: 'center' }}>Cant.</span>
                                <span style={{ textAlign: 'right' }}>Precio</span>
                                <span style={{ textAlign: 'right' }}>Subtotal</span>
                            </div>
                            <div className="cd-products-list">
                                {data.lineas.map((linea) => (
                                    <div
                                        key={linea.producto.id}
                                        className={`cd-product-row ${lastAddedId === linea.producto.id ? 'cd-row-highlight' : ''}`}
                                    >
                                        <div className="cd-product-name">
                                            <span className="cd-product-title">{linea.producto.nombre}</span>
                                            {linea.producto.categorianombre && (
                                                <span className="cd-product-cat">{linea.producto.categorianombre}</span>
                                            )}
                                        </div>
                                        <div className="cd-product-qty">{Number(linea.cantidad) || 0}</div>
                                        <div className="cd-product-price">C$ {linea.producto.precioventa.toFixed(2)}</div>
                                        <div className="cd-product-subtotal">
                                            C$ {(linea.producto.precioventa * (Number(linea.cantidad) || 0)).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Total panel */}
                        <div className="cd-total-panel">
                            <div className="cd-total-items">
                                <span className="cd-total-items-number">{data.totalItems}</span>
                                <span className="cd-total-items-label">artículos</span>
                            </div>
                            <div className="cd-total-breakdown">
                                <div className="cd-total-row">
                                    <span>Subtotal</span>
                                    <span>C$ {data.subtotal.toFixed(2)}</span>
                                </div>
                                {data.descuentoTotal > 0 && (
                                    <div className="cd-total-row cd-total-discount">
                                        <span>Descuento</span>
                                        <span>- C$ {data.descuentoTotal.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="cd-grand-total">
                                <span>TOTAL</span>
                                <span className="cd-grand-total-amount">C$ {data.total.toFixed(2)}</span>
                            </div>
                            {data.montoRecibido != null && data.montoRecibido > 0 && (
                                <div style={{ marginTop: '1rem', padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--accent-success-bg-light)', border: '1px solid var(--accent-success-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                                        <span style={{ color: 'var(--text-secondary)' }}>💵 Recibido:</span>
                                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>C$ {data.montoRecibido.toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem' }}>
                                        <span style={{ fontWeight: 700, color: (data.cambio ?? 0) >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                                            {(data.cambio ?? 0) >= 0 ? '💰 Su Cambio:' : '⚠️ Falta:'}
                                        </span>
                                        <span style={{ fontWeight: 800, fontSize: '1.5rem', color: (data.cambio ?? 0) >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                                            C$ {Math.abs(data.cambio ?? 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="cd-footer">
                <p>¡Gracias por su preferencia!</p>
            </footer>
        </div>
    );
};

export default CustomerDisplay;
