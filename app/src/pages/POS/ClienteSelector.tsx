import { IconUser } from './icons';
import type { Cliente } from './types';

interface ClienteSelectorProps {
    clienteSeleccionado: Cliente | undefined;
    clienteIdSeleccionado: number | null;
    setClienteIdSeleccionado: (id: number | null) => void;
    busquedaCliente: string;
    setBusquedaCliente: (v: string) => void;
    showClientesDropdown: boolean;
    setShowClientesDropdown: (v: boolean) => void;
    clientFocusedIndex: number;
    setClientFocusedIndex: React.Dispatch<React.SetStateAction<number>>;
    clientesFiltrados: Cliente[];
    setShowModalCliente: (v: boolean) => void;
    scannerInputRef: React.RefObject<HTMLInputElement | null>;
}

export const ClienteSelector = ({
    clienteSeleccionado, clienteIdSeleccionado, setClienteIdSeleccionado,
    busquedaCliente, setBusquedaCliente, showClientesDropdown, setShowClientesDropdown,
    clientFocusedIndex, setClientFocusedIndex, clientesFiltrados, setShowModalCliente, scannerInputRef,
}: ClienteSelectorProps) => {
    return (
        <div style={{ position: 'relative' }}>
            <div
                className="form-input"
                style={{ height: '3.5rem', display: 'flex', alignItems: 'center', cursor: 'text', padding: '0', overflow: 'visible', border: '2px solid var(--border-color)', borderRadius: '12px' }}
                onClick={(e) => { e.stopPropagation(); setShowClientesDropdown(true); }}
            >
                <span style={{ paddingLeft: '1rem', color: 'var(--text-secondary)', display: 'flex' }}><IconUser /></span>
                <label htmlFor="pos-client-input" className="sr-only">Buscar Cliente</label>
                <input
                    id="pos-client-input"
                    type="text"
                    placeholder={clienteSeleccionado ? clienteSeleccionado.nombre : "Consumidor final"}
                    value={busquedaCliente}
                    onChange={(e) => {
                        setBusquedaCliente(e.target.value);
                        setShowClientesDropdown(true);
                        if (clienteIdSeleccionado) setClienteIdSeleccionado(null);
                    }}
                    onKeyDown={(e) => {
                        if (showClientesDropdown) {
                            const optionsCount = 2 + clientesFiltrados.length;
                            if (e.key === 'ArrowDown') {
                                e.preventDefault();
                                setClientFocusedIndex(prev => (prev + 1) % optionsCount);
                                return;
                            }
                            if (e.key === 'ArrowUp') {
                                e.preventDefault();
                                setClientFocusedIndex(prev => (prev - 1 + optionsCount) % optionsCount);
                                return;
                            }
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                if (clientFocusedIndex === 0) {
                                    setShowModalCliente(true);
                                    setShowClientesDropdown(false);
                                } else if (clientFocusedIndex === 1) {
                                    setClienteIdSeleccionado(null);
                                    setBusquedaCliente('');
                                    setShowClientesDropdown(false);
                                    scannerInputRef.current?.focus();
                                } else if (clientFocusedIndex >= 2 && clientFocusedIndex < optionsCount) {
                                    const client = clientesFiltrados[clientFocusedIndex - 2];
                                    setClienteIdSeleccionado(client.id);
                                    setBusquedaCliente('');
                                    setShowClientesDropdown(false);
                                    scannerInputRef.current?.focus();
                                }
                                return;
                            }
                            if (e.key === 'Escape') {
                                e.preventDefault();
                                setShowClientesDropdown(false);
                                setClientFocusedIndex(-1);
                                scannerInputRef.current?.focus();
                                return;
                            }
                        }
                    }}
                    className="form-input"
                    style={{ border: 'none', height: '100%', outline: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}
                    maxLength={100}
                    role="combobox"
                    aria-expanded={showClientesDropdown}
                    aria-autocomplete="list"
                    aria-haspopup="listbox"
                    aria-controls="pos-client-listbox"
                />
                {clienteIdSeleccionado && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setClienteIdSeleccionado(null); setBusquedaCliente(''); }}
                        style={{ padding: '0 1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Client dropdown */}
            {showClientesDropdown && (
                <div
                    id="pos-client-listbox"
                    role="listbox"
                    aria-label="Opciones de clientes"
                    style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '0.5rem',
                        backgroundColor: 'var(--bg-dark)', borderRadius: '12px', border: '1px solid var(--border-color)',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', zIndex: 50, maxHeight: '250px', overflowY: 'auto'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        role="option" aria-selected={clientFocusedIndex === 0}
                        style={{ padding: '0.85rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: clientFocusedIndex === 0 ? 'var(--bg-hover)' : 'transparent' }}
                        onClick={() => { setShowModalCliente(true); setShowClientesDropdown(false); }}
                        className="nav-link"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-success)', flexShrink: 0 }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        <strong style={{ color: 'var(--accent-success)' }}>Nuevo cliente</strong>
                    </div>
                    <div
                        role="option" aria-selected={clientFocusedIndex === 1}
                        style={{ padding: '0.85rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: clientFocusedIndex === 1 ? 'var(--bg-hover)' : 'transparent' }}
                        onClick={() => { setClienteIdSeleccionado(null); setBusquedaCliente(''); setShowClientesDropdown(false); scannerInputRef.current?.focus(); }}
                        className="nav-link"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--accent-primary)', flexShrink: 0 }}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        <strong style={{ color: 'var(--accent-primary)' }}>Consumidor final</strong>
                    </div>
                    {clientesFiltrados.map((c, idx) => (
                        <div
                            key={c.id}
                            role="option" aria-selected={(idx + 2) === clientFocusedIndex}
                            style={{ padding: '0.85rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)', backgroundColor: (idx + 2) === clientFocusedIndex ? 'var(--bg-hover)' : 'transparent' }}
                            onClick={() => { setClienteIdSeleccionado(c.id); setBusquedaCliente(''); setShowClientesDropdown(false); scannerInputRef.current?.focus(); }}
                            className="nav-link"
                        >
                            <div style={{ fontWeight: 500 }}>{c.nombre}</div>
                            {c.cedula && c.cedula.toUpperCase() !== 'NA' && c.cedula.trim() !== '' && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>ID: {c.cedula}</div>}
                        </div>
                    ))}
                    {clientesFiltrados.length === 0 && (
                        <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Sin resultados</div>
                    )}
                </div>
            )}
        </div>
    );
};
