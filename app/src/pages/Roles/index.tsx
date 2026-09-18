import { useAuth } from '../../context/AuthContext';
import { IconPlus, IconEdit, IconTrash, IconLock } from './icons';
import { useRolesData } from './useRolesData';
import { useRolesCrud } from './useRolesCrud';
import { RoleModal } from './RoleModal';

const Roles = () => {
    const { hasPermission } = useAuth();
    const { roles, permisos, isLoading, refetch } = useRolesData();
    const {
        showModal, setShowModal,
        isEditing,
        form, setForm,
        handleOpenCreate,
        handleOpenEdit,
        handleSave,
        handleDelete,
    } = useRolesCrud(refetch);

    const permisoByCodigo = permisos.reduce<Record<string, number>>((acc, p) => {
        acc[p.codigo] = p.id;
        return acc;
    }, {});

    const canCrear = hasPermission('roles.crear');
    const canEditar = hasPermission('roles.editar') || hasPermission('roles.asignar_permisos');
    const canEliminar = hasPermission('roles.eliminar');

    const editingRol = roles.find((r) => r.id === form.id);

    return (
        <div className="page-container">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0, marginBottom: '1.5rem', border: 'none' }}>
                <div>
                    <h2 className="card-title" style={{ fontSize: '1.5rem' }}>Roles y Permisos</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Define qué puede ver y hacer cada tipo de usuario.</p>
                </div>
                {canCrear && (
                    <button className="btn btn-primary" onClick={handleOpenCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                        <IconPlus />
                        <span>Nuevo Rol</span>
                    </button>
                )}
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
                {isLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando roles...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '1rem 0', fontWeight: 500 }}>Rol</th>
                                <th style={{ padding: '1rem 0', fontWeight: 500 }}>Descripción</th>
                                <th style={{ padding: '1rem 0', fontWeight: 500 }}>Permisos</th>
                                <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((rol) => (
                                <tr key={rol.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--text-primary)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span>{rol.nombre}</span>
                                            {rol.essistema && (
                                                <span title="Rol de sistema" style={{ color: 'var(--text-secondary)' }}><IconLock /></span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{rol.descripcion || '—'}</td>
                                    <td style={{ padding: '1rem 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                        {rol.permisos.length} permiso{rol.permisos.length !== 1 ? 's' : ''}
                                    </td>
                                    <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            {canEditar && (
                                                <button
                                                    className="btn"
                                                    onClick={() => handleOpenEdit(rol, permisoByCodigo)}
                                                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', borderRadius: 'var(--radius-md)', fontWeight: 500 }}
                                                    title="Editar rol"
                                                >
                                                    <IconEdit />
                                                    <span>Editar</span>
                                                </button>
                                            )}
                                            {canEliminar && !rol.essistema && (
                                                <button
                                                    className="btn"
                                                    onClick={() => handleDelete(rol)}
                                                    style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem', backgroundColor: 'var(--accent-danger-bg)', color: 'var(--accent-danger)', border: '1px solid var(--accent-danger)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', borderRadius: 'var(--radius-md)', fontWeight: 600 }}
                                                    title="Eliminar rol"
                                                >
                                                    <IconTrash />
                                                    <span>Eliminar</span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {roles.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay roles registrados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <RoleModal
                show={showModal}
                isEditing={isEditing}
                isSystemRole={!!editingRol?.essistema}
                form={form}
                permisos={permisos}
                onChange={setForm}
                onSubmit={handleSave}
                onClose={() => setShowModal(false)}
            />
        </div>
    );
};

export default Roles;
