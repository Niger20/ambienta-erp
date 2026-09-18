import { LineChartSVG } from './LineChartSVG';

interface GraficosTabProps {
    salesTimeline: any[];
    stockTimeline: any[];
}

export const GraficosTab = ({ salesTimeline, stockTimeline }: GraficosTabProps) => {
    if (salesTimeline.length === 0) {
        return (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                Cargando datos históricos para graficar...
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <LineChartSVG
                    data={salesTimeline}
                    xKey="dateStr"
                    yKey="total"
                    title="Evolución de Ventas Diarias (C$)"
                    strokeColor="var(--accent-success)"
                    areaColor="rgba(16, 185, 129, 0.4)"
                />
                <LineChartSVG
                    data={stockTimeline}
                    xKey="dateStr"
                    yKey="stock"
                    title="Evolución del Stock Total de Inventario (Unidades)"
                    strokeColor="var(--accent-primary)"
                    areaColor="rgba(59, 130, 246, 0.4)"
                />
            </div>
            <div className="card" style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <h5 style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    💡 Análisis de Tendencia
                </h5>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                    Los gráficos muestran el comportamiento diario de las ventas comparado contra los niveles globales de existencias físicas en el local. Un declive en el stock acompañado de picos en las ventas indica una rotación sana, mientras que un nivel plano de existencias con bajas ventas aconseja revisar los precios o realizar ofertas.
                </p>
            </div>
        </div>
    );
};
