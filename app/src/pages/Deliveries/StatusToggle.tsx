interface StatusToggleProps {
    active: boolean;
    onToggle: () => void;
}

/** Switch visual para alternar filtro Activos/Inactivos — usado en varias tabs de esta página. */
export const StatusToggle = ({ active, onToggle }: StatusToggleProps) => (
    <div
        onClick={onToggle}
        style={{
            display: 'inline-flex', alignItems: 'center', cursor: 'pointer', width: '40px', height: '24px',
            backgroundColor: active ? 'var(--accent-success)' : 'var(--accent-danger)',
            borderRadius: '12px', position: 'relative', transition: 'background-color 0.25s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
        title="Clic para alternar filtro (Activos / Inactivos)"
    >
        <div style={{
            width: '18px', height: '18px', backgroundColor: 'white', borderRadius: '50%', position: 'absolute', top: '3px', left: '3px',
            transform: active ? 'translateX(16px)' : 'translateX(0)',
            transition: 'transform 0.25s cubic-bezier(0.23, 1, 0.32, 1)', boxShadow: 'var(--shadow-sm)'
        }} />
    </div>
);
