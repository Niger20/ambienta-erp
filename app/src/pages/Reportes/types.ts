export type Tab = 'utilidad' | 'utilidadProducto' | 'cxc' | 'cxp' | 'gastos' | 'graficos' | 'proyecciones';

export const chipStyle = (color: string, bg?: string) => ({
    display: 'inline-block',
    padding: '0.15rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 600,
    backgroundColor: bg || (color === 'var(--accent-success)' ? 'var(--accent-success-bg)' :
        color === 'var(--accent-danger)' ? 'var(--accent-danger-bg)' :
            color === 'var(--accent-warning)' ? 'var(--accent-warning-bg)' :
                color === 'var(--accent-primary)' ? 'var(--accent-primary-bg)' :
                    color.startsWith('var(') ? 'rgba(255, 255, 255, 0.08)' : `${color}18`),
    color,
});

/* ─── Timeline Builders for Gráficos ─── */
export const getDatesInRange = (startStr: string, endStr: string) => {
    const dates = [];
    let curr = new Date(startStr + 'T00:00:00');
    const last = new Date(endStr + 'T00:00:00');
    let count = 0;
    while (curr <= last && count < 180) {
        dates.push(curr.toISOString().split('T')[0]);
        curr.setDate(curr.getDate() + 1);
        count++;
    }
    return dates;
};
