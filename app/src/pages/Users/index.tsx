import { IconPlus, IconEdit, IconTrash } from './icons';
import { useUsersCrud } from './useUsersCrud';
import { UserModal } from './UserModal';

const Users = () => {
    const {
        currentUser,
        usuarios,
        isLoading,
        showModal,
        setShowModal,
        isEditing,
        form,
        setForm,
        handleOpenCreate,
        handleOpenEdit,
        handleSave,
        handleDelete,
    } = useUsersCrud();

    return (
        <div className="page-container">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 0, marginBottom: '1.5rem', border: 'none' }}>
                <div>
                    <h2 className="card-title" style={{ fontSize: '1.5rem' }}>Gestión de Usuarios</h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Administración de accesos y roles (Solo Administradores).</p>
                </div>
                <button className="btn btn-primary" onClick={handleOpenCreate} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconPlus />
                    <span>Nuevo Usuario</span>
                </button>
            </div>

            <div className="card" style={{ padding: '1.5rem' }}>
                {isLoading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Cargando usuarios...</div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '1rem 0', fontWeight: 500 }}>ID</th>
                                <th style={{ padding: '1rem 0', fontWeight: 500 }}>Usuario</th>
                                <th style={{ padding: '1rem 0', fontWeight: 500 }}>Rol</th>
                                <th style={{ padding: '1rem 0', fontWeight: 500, textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((u) => {
                                const uid = u.usuarioid || u.id;
                                if (!uid) return null;
                                const isCurrent = Number(currentUser?.id) === uid || currentUser?.nombreusuario === u.nombreusuario;
                                return (
                                    <tr key={uid} style={{
                                        borderBottom: '1px solid var(--border-color)',
                                        backgroundColor: isCurrent ? 'rgba(59, 130, 246, 0.04)' : undefined
                                    }}>
                                        <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }} className="tabular">#{uid}</td>
                                        <td style={{ padding: '1rem 0', fontWeight: 600, color: 'var(--text-primary)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span>{u.nombreusuario}</span>
                                                {isCurrent && (
                                                    <span style={{
                                                        fontSize: '0.72rem',
                                                        padding: '0.15rem 0.5rem',
                                                        borderRadius: '9999px',
                                                        backgroundColor: 'rgba(59, 130, 246, 0.15)',
                                                        color: 'var(--accent-primary)',
                                                        fontWeight: 700,
                                                        border: '1px solid rgba(59, 130, 246, 0.3)'
                                                    }}>
                                                        (Tú)
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 0' }}>
                                            <span style={{
                                                padding: '0.25rem 0.65rem',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                letterSpacing: '0.025em',
                                                border: u.rol === 'administrador' ? '1px solid rgba(99, 102, 241, 0.25)' :
                                                    u.rol === 'empleado' ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid var(--border-color)',
                                                backgroundColor: u.rol === 'administrador' ? 'rgba(99, 102, 241, 0.08)' :
                                                    u.rol === 'empleado' ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-hover)',
                                                color: u.rol === 'administrador' ? 'var(--accent-primary)' :
                                                    u.rol === 'empleado' ? 'var(--accent-success)' : 'var(--text-secondary)'
                                            }}>
                                                {u.rol?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 0', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button
                                                    className="btn"
                                                    onClick={() => handleOpenEdit(u)}
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
                                                    title="Editar usuario"
                                                >
                                                    <IconEdit />
                                                    <span>Editar</span>
                                                </button>
                                                {!isCurrent && (
                                                    <button
                                                        className="btn"
                                                        onClick={() => handleDelete(uid)}
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
                                                        title="Eliminar usuario"
                                                    >
                                                        <IconTrash />
                                                        <span>Eliminar</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {usuarios.length === 0 && (
                                <tr>
                                    <td colSpan={4} style={{ padding: '2rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>No hay usuarios registrados.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <UserModal
                show={showModal}
                isEditing={isEditing}
                form={form}
                onChange={setForm}
                onSubmit={handleSave}
                onClose={() => setShowModal(false)}
                isEditingOwnUser={form.id === Number(currentUser?.id)}
            />
        </div>
    );
};

export default Users;
