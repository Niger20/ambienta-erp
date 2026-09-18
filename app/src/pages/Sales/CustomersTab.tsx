import { IconEdit, IconTrash } from './icons';
import type { Cliente } from './types';

interface CustomersTabProps {
    isLoading: boolean;
    customerSearchQuery: string;
    setCustomerSearchQuery: (v: string) => void;
    customerStatusFilter: string;
    setCustomerStatusFilter: React.Dispatch<React.SetStateAction<string>>;
    filteredCustomers: Cliente[];
    openCreateCustomerModal: () => void;
    handleEditCustomer: (customer: Cliente) => void;
    handleDeleteCustomer: (id: number) => Promise<void>;
}

export const CustomersTab = ({
    isLoading, customerSearchQuery, setCustomerSearchQuery, customerStatusFilter, setCustomerStatusFilter,
    filteredCustomers, openCreateCustomerModal, handleEditCustomer, handleDeleteCustomer,
}: CustomersTabProps) => {
    return (
        <div className="tab-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div className="form-input" style={{ display: 'flex', alignItems: 'center', flex: '1 1 200px', maxWidth: '300px', padding: '0 10px', gap: '8px', height: '36px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    <input type="text" placeholder="Buscar por nombre o cédula..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-primary)', fontSize: '0.9rem', padding: 0 }} value={customerSearchQuery} onChange={(e) => setCustomerSearchQuery(e.target.value)} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                        onClick={() => setCustomerStatusFilter((prev: string) => prev === 'active' ? 'inactive' : 'active')}
                        className={`status-switch-toggle ${customerStatusFilter === 'active' ? 'status-switch-toggle--active' : 'status-switch-toggle--inactive'}`}
                        title="Clic para alternar filtro (Activos / Inactivos)"
                    >
                        <div className={`status-switch-handle ${customerStatusFilter === 'active' ? 'status-switch-handle--active' : 'status-switch-handle--inactive'}`} />
                    </div>
                    <button className="btn btn-primary" onClick={openCreateCustomerModal}>+ Registrar Cliente</button>
                </div>
            </div>

            {isLoading ? <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando clientes...</div>
                : (
                    <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                        <table style={{ minWidth: '750px', width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Nombre</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Cédula</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Teléfono</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Límite Crédito</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500 }}>Estado</th>
                                    <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map(customer => {
                                    const isInactivo = customer.estado === false;
                                    return (
                                        <tr key={customer.id} style={{ borderBottom: '1px solid var(--border-color)', opacity: isInactivo ? 0.55 : 1 }}>
                                            <td style={{ padding: '1rem 0', fontWeight: 500 }}>{customer.nombre}</td>
                                            <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{customer.cedula || '-'}</td>
                                            <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{customer.telefono || '-'}</td>
                                            <td style={{ padding: '1rem 0' }}>
                                                {customer.limitecredito ? (
                                                    <span style={{ color: 'var(--accent-success)', fontWeight: 500 }}>C$ {Number(customer.limitecredito).toLocaleString('es-NI', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
                                                ) : <span style={{ color: 'var(--text-secondary)' }}>Sin crédito</span>}
                                            </td>
                                            <td style={{ padding: '1rem 0' }}>
                                                {isInactivo
                                                    ? <span style={{ color: 'var(--accent-danger)', background: 'rgba(239,68,68,0.1)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>INACTIVO</span>
                                                    : <span style={{ color: 'var(--accent-success)', background: 'rgba(16,185,129,0.1)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 600 }}>ACTIVO</span>
                                                }
                                            </td>
                                            <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                                    <button
                                                        className="btn"
                                                        style={{
                                                            padding: '0.35rem 0.65rem',
                                                            fontSize: '0.78rem',
                                                            border: '1px solid var(--border-color)',
                                                            backgroundColor: 'var(--bg-secondary)',
                                                            color: 'var(--text-primary)',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem',
                                                            borderRadius: 'var(--radius-md)',
                                                            fontWeight: 500
                                                        }}
                                                        onClick={() => handleEditCustomer(customer)}
                                                        title="Editar cliente"
                                                    >
                                                        <IconEdit />
                                                        <span>Editar</span>
                                                    </button>
                                                    <button
                                                        className="btn"
                                                        style={{
                                                            padding: '0.35rem 0.65rem',
                                                            fontSize: '0.78rem',
                                                            backgroundColor: 'var(--accent-danger-bg)',
                                                            color: 'var(--accent-danger)',
                                                            border: '1px solid var(--accent-danger)',
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem',
                                                            borderRadius: 'var(--radius-md)',
                                                            fontWeight: 600
                                                        }}
                                                        onClick={() => handleDeleteCustomer(customer.id)}
                                                        title="Eliminar cliente"
                                                    >
                                                        <IconTrash />
                                                        <span>Eliminar</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filteredCustomers.length === 0 && <tr><td colSpan={6} style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No se encontraron clientes.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
        </div>
    );
};
