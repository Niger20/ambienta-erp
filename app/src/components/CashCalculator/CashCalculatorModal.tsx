import { IconBanknote, IconCalculator, IconCheck, IconCoins, IconDollar, IconTrash, IconX } from './icons';
import { BANKNOTES_NIO, COINS_NIO } from './useCashCalculator';
import type { CashCalculatorModalProps } from './useCashCalculator';

const cx = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

/** Presentacional puro: todo el estado y los cálculos viven en useCashCalculator. */
const CashCalculatorModal = ({
    isOpen, onClose, onApply, tasaCambio, countsNio, countUsd,
    onNioChange, onNioStep, onCountUsdChange, onClear, totals,
}: CashCalculatorModalProps) => {
    if (!isOpen) return null;

    const { totalNioFromBills, totalNioFromCoins, totalNioFromUsd, grandTotalNio, totalItemsCount } = totals;

    return (
        <div className="cashcalc-backdrop">
            <div className="cashcalc-modal">
                {/* Header */}
                <div className="cashcalc-header">
                    <div className="cashcalc-header-left">
                        <div className="cashcalc-header-icon">
                            <IconCalculator size={28} />
                        </div>
                        <div>
                            <h3 className="cashcalc-title">Desglose de Billetes y Monedas</h3>
                            <p className="cashcalc-subtitle">
                                Conteo de efectivo por denominación para cierre de caja • Tasa Oficial USD: <strong style={{ color: 'var(--accent-success)', fontSize: '1rem' }}>C$ {tasaCambio.toFixed(2)}</strong>
                            </p>
                        </div>
                    </div>

                    <div className="cashcalc-stats">
                        <div className="cashcalc-stat-badge cashcalc-stat-badge--bills">
                            <IconBanknote size={20} />
                            <span>Billetes: <strong className="tabular">C$ {totalNioFromBills.toLocaleString('es-NI')}</strong></span>
                        </div>

                        <div className="cashcalc-stat-badge cashcalc-stat-badge--coins">
                            <IconCoins size={20} />
                            <span>Monedas: <strong className="tabular">C$ {totalNioFromCoins.toLocaleString('es-NI')}</strong></span>
                        </div>

                        <button onClick={onClose} className="cashcalc-close-btn" title="Cerrar modal">
                            <IconX size={22} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="cashcalc-body">

                    {/* Billetes */}
                    <div>
                        <div className="cashcalc-section-header">
                            <div style={{ color: 'var(--accent-primary)', display: 'flex', alignItems: 'center' }}>
                                <IconBanknote size={24} />
                            </div>
                            <h4 className="cashcalc-section-title">Billetes en Córdobas (NIO)</h4>
                        </div>

                        <div className="cashcalc-grid">
                            {BANKNOTES_NIO.map(denom => {
                                const qty = countsNio[denom] || 0;
                                const subtotal = denom * qty;
                                const isActive = qty > 0;
                                const isHighValue = denom >= 200;

                                return (
                                    <div key={denom} className={cx('cashcalc-bill-card', isActive && 'cashcalc-bill-card--active')}>
                                        <div className="cashcalc-bill-top">
                                            <span className={cx('cashcalc-bill-badge', isHighValue && 'cashcalc-bill-badge--high')}>
                                                <IconBanknote size={19} />
                                                <span>C$ {denom}</span>
                                            </span>

                                            <div className={cx('cashcalc-bill-subtotal tabular', isActive && 'cashcalc-bill-subtotal--active')}>
                                                C$ {subtotal.toLocaleString('es-NI')}
                                            </div>
                                        </div>

                                        <div className="cashcalc-bill-controls">
                                            <div className="cashcalc-steppers">
                                                <button type="button" className="cashcalc-stepper-btn" onClick={() => onNioStep(denom, -1)} title="Restar 1">-</button>

                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={qty || ''}
                                                    onChange={e => onNioChange(denom, parseInt(e.target.value, 10))}
                                                    placeholder="0"
                                                    className={cx('cashcalc-qty-input tabular', isActive && 'cashcalc-qty-input--active')}
                                                />

                                                <button type="button" className="cashcalc-stepper-btn cashcalc-stepper-btn--plus" onClick={() => onNioStep(denom, 1)} title="Sumar 1">+</button>
                                            </div>

                                            <div className="cashcalc-presets">
                                                <button type="button" className="cashcalc-preset-btn" onClick={() => onNioStep(denom, 5)}>+5</button>
                                                <button type="button" className="cashcalc-preset-btn" onClick={() => onNioStep(denom, 10)}>+10</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Monedas */}
                    <div>
                        <div className="cashcalc-section-header">
                            <div style={{ color: 'var(--accent-warning)', display: 'flex', alignItems: 'center' }}>
                                <IconCoins size={24} />
                            </div>
                            <h4 className="cashcalc-section-title">Monedas en Córdobas (NIO)</h4>
                        </div>

                        <div className="cashcalc-grid">
                            {COINS_NIO.map(denom => {
                                const qty = countsNio[denom] || 0;
                                const subtotal = denom * qty;
                                const isActive = qty > 0;

                                return (
                                    <div key={denom} className={cx('cashcalc-coin-card', isActive && 'cashcalc-coin-card--active')}>
                                        <div className="cashcalc-coin-left">
                                            <span className="cashcalc-coin-badge">C$ {denom}</span>

                                            <div>
                                                <div className="cashcalc-coin-label">Moneda</div>
                                                <div className={cx('cashcalc-coin-subtotal tabular', isActive && 'cashcalc-coin-subtotal--active')}>
                                                    C$ {subtotal.toLocaleString('es-NI')}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="cashcalc-coin-controls">
                                            <button type="button" className="cashcalc-stepper-btn" onClick={() => onNioStep(denom, -1)}>-</button>

                                            <input
                                                type="number"
                                                min="0"
                                                value={qty || ''}
                                                onChange={e => onNioChange(denom, parseInt(e.target.value, 10))}
                                                placeholder="0"
                                                className={cx('cashcalc-qty-input cashcalc-qty-input--coin tabular', isActive && 'cashcalc-qty-input--active')}
                                            />

                                            <button type="button" className="cashcalc-stepper-btn cashcalc-stepper-btn--coin-plus" onClick={() => onNioStep(denom, 1)}>+</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dólares */}
                    <div className={cx('cashcalc-usd-section', countUsd > 0 && 'cashcalc-usd-section--active')}>
                        <div className="cashcalc-usd-left">
                            <div className="cashcalc-usd-icon">
                                <IconDollar size={28} />
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                                    Conteo en Dólares Estadounidenses (USD)
                                </h4>
                                <p className="cashcalc-subtitle">
                                    Convertido automáticamente a C$ según la tasa oficial de <strong>C$ {tasaCambio.toFixed(2)}</strong>
                                </p>
                            </div>
                        </div>

                        <div className="cashcalc-usd-right">
                            <div className="cashcalc-usd-input-wrap">
                                <span className="cashcalc-usd-currency-sign">$</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="any"
                                    value={countUsd || ''}
                                    onChange={e => onCountUsdChange(parseFloat(e.target.value))}
                                    placeholder="0.00"
                                    className="cashcalc-usd-input tabular"
                                />
                            </div>

                            <div>
                                <div className="cashcalc-usd-total-label">Total en NIO</div>
                                <div className="cashcalc-usd-total-value tabular">
                                    C$ {totalNioFromUsd.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="cashcalc-footer">
                    <div>
                        <div className="cashcalc-footer-label">Gran Total Físico Contado ({totalItemsCount} ítems)</div>
                        <div className="cashcalc-footer-total tabular">
                            C$ {grandTotalNio.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>

                    <div className="cashcalc-footer-actions">
                        <button type="button" onClick={onClear} className="cashcalc-clear-btn">
                            <IconTrash />
                            <span>Limpiar Todo</span>
                        </button>

                        {onApply && (
                            <button type="button" className="btn btn-primary cashcalc-apply-btn" onClick={onApply}>
                                <IconCheck size={24} />
                                <span>Aplicar C$ {grandTotalNio.toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} al Cierre</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CashCalculatorModal;
