import { useState, useMemo } from 'react';

type Periodo = 'semanal' | 'quincenal' | 'mensual';

export function useProyeccionRLM(allSales: any[]) {
    const [periodoProyeccion, setPeriodoProyeccion] = useState<Periodo>('semanal');

    /* ─── RLM Regression Projection computations ─── */
    const rlmData = useMemo(() => {
        const activeSales = allSales.filter(s => s.estado !== false);
        if (activeSales.length === 0) return [];

        const sortedSales = [...activeSales].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
        const firstSaleDate = new Date(sortedSales[0].fecha);
        const lastSaleDate = new Date();

        const periods: { start: Date; end: Date; label: string; totalSales: number }[] = [];
        let curr = new Date(firstSaleDate);

        if (periodoProyeccion === 'semanal') {
            while (curr <= lastSaleDate) {
                const start = new Date(curr);
                const end = new Date(curr);
                end.setDate(end.getDate() + 6);
                end.setHours(23, 59, 59, 999);
                periods.push({
                    start,
                    end,
                    label: `Semana ${periods.length + 1} (${start.toLocaleDateString('es-NI', { day: 'numeric', month: 'short' })})`,
                    totalSales: 0
                });
                curr.setDate(curr.getDate() + 7);
            }
        } else if (periodoProyeccion === 'quincenal') {
            while (curr <= lastSaleDate) {
                const start = new Date(curr);
                const end = new Date(curr);
                end.setDate(end.getDate() + 14);
                end.setHours(23, 59, 59, 999);
                periods.push({
                    start,
                    end,
                    label: `Quincena ${periods.length + 1} (${start.toLocaleDateString('es-NI', { day: 'numeric', month: 'short' })})`,
                    totalSales: 0
                });
                curr.setDate(curr.getDate() + 15);
            }
        } else {
            curr = new Date(firstSaleDate.getFullYear(), firstSaleDate.getMonth(), 1);
            while (curr <= lastSaleDate) {
                const start = new Date(curr);
                const end = new Date(curr.getFullYear(), curr.getMonth() + 1, 0, 23, 59, 59, 999);
                periods.push({
                    start,
                    end,
                    label: start.toLocaleDateString('es-NI', { month: 'long', year: 'numeric' }),
                    totalSales: 0
                });
                curr.setMonth(curr.getMonth() + 1);
            }
        }

        for (const sale of sortedSales) {
            const saleTime = new Date(sale.fecha).getTime();
            for (const p of periods) {
                if (saleTime >= p.start.getTime() && saleTime <= p.end.getTime()) {
                    p.totalSales += Number(sale.total || 0);
                    break;
                }
            }
        }

        return periods;
    }, [allSales, periodoProyeccion]);

    const proyeccionResult = useMemo(() => {
        if (rlmData.length < 3) {
            return { error: 'Se necesitan al menos 3 períodos históricos acumulados con ventas para calcular estimaciones.' };
        }

        const N = rlmData.length - 1;
        const maxHistorical = Math.max(...rlmData.map(d => d.totalSales), 1);

        let sumX = 0;
        let sumZ = 0;
        let sumY = 0;
        let sumXX = 0;
        let sumZZ = 0;
        let sumXZ = 0;
        let sumXY = 0;
        let sumZY = 0;

        for (let i = 1; i < rlmData.length; i++) {
            const t = i + 1;
            const y_lag = rlmData[i - 1].totalSales;
            const y = rlmData[i].totalSales;

            sumX += t;
            sumZ += y_lag;
            sumY += y;
            sumXX += t * t;
            sumZZ += y_lag * y_lag;
            sumXZ += t * y_lag;
            sumXY += t * y;
            sumZY += y_lag * y;
        }

        const m = [
            [N, sumX, sumZ],
            [sumX, sumXX, sumXZ],
            [sumZ, sumXZ, sumZZ]
        ];

        const b = [sumY, sumXY, sumZY];

        const D = m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
            m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
            m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

        let beta0 = 0;
        let beta1 = 0;
        let beta2 = 0;
        let modelType = 'Regresión Lineal Múltiple (RLM Autoregresiva Damped)';

        if (rlmData.length < 5 || Math.abs(D) < 1e-4) {
            let sT = 0, sY = 0, sTT = 0, sTY = 0;
            for (let i = 0; i < rlmData.length; i++) {
                const t = i + 1;
                const y = rlmData[i].totalSales;
                sT += t;
                sY += y;
                sTT += t * t;
                sTY += t * y;
            }
            const den = rlmData.length * sTT - sT * sT;
            if (Math.abs(den) > 1e-4) {
                beta1 = (rlmData.length * sTY - sT * sY) / den;
                beta0 = (sY - beta1 * sT) / rlmData.length;
                beta2 = 0;
            } else {
                beta0 = sY / rlmData.length;
                beta1 = 0;
                beta2 = 0;
            }
            modelType = rlmData.length < 5
                ? 'Lineal Simple (Recomendados +5 períodos para RLM completa)'
                : 'Lineal Simple (Autorregresión omitida por colinealidad)';
        } else {
            const D0 = b[0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
                m[0][1] * (b[1] * m[2][2] - m[1][2] * b[2]) +
                m[0][2] * (b[1] * m[2][1] - m[1][1] * b[2]);

            const D1 = m[0][0] * (b[1] * m[2][2] - m[1][2] * b[2]) -
                b[0] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
                m[0][2] * (m[1][0] * b[2] - b[1] * m[2][0]);

            const D2 = m[0][0] * (m[1][1] * b[2] - b[1] * m[2][1]) -
                m[0][1] * (m[1][0] * b[2] - b[1] * m[2][0]) +
                b[0] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

            beta0 = D0 / D;
            beta1 = D1 / D;
            beta2 = D2 / D;
        }

        // Calculate R^2 Goodness of Fit
        let ssTotal = 0;
        let ssRes = 0;
        const meanY = rlmData.reduce((acc, p) => acc + p.totalSales, 0) / rlmData.length;
        for (let i = 1; i < rlmData.length; i++) {
            const t = i + 1;
            const y_lag = rlmData[i - 1].totalSales;
            const y_actual = rlmData[i].totalSales;
            const y_fitted = beta0 + beta1 * t + beta2 * y_lag;
            ssRes += Math.pow(y_actual - y_fitted, 2);
            ssTotal += Math.pow(y_actual - meanY, 2);
        }
        const rSquared = ssTotal > 0 ? Math.max(0, Math.min(1, 1 - (ssRes / ssTotal))) : 0;

        let confidenceLabel = 'Baja (Alta Variabilidad)';
        let confidenceColor = 'var(--accent-danger)';
        if (rSquared >= 0.70) {
            confidenceLabel = 'Alta (Modelo Ajustado)';
            confidenceColor = 'var(--accent-success)';
        } else if (rSquared >= 0.40) {
            confidenceLabel = 'Moderada';
            confidenceColor = 'var(--accent-warning)';
        }

        // Generate forecasts with damping & capping
        const proyecciones: { label: string; predicted: number }[] = [];
        let lastSalesValue = rlmData[rlmData.length - 1].totalSales;
        for (let i = 1; i <= 3; i++) {
            const nextT = rlmData.length + i;
            const dampingFactor = Math.pow(0.85, i - 1);
            const predRaw = beta0 + beta1 * nextT + (beta2 * lastSalesValue * dampingFactor);
            // Cap between 0 and 2.5x max historical to eliminate unrealistic runaway projections
            const predBounded = Math.min(Math.max(0, predRaw), maxHistorical * 2.5);

            const label = periodoProyeccion === 'semanal'
                ? `Semana ${nextT} (Proyección)`
                : periodoProyeccion === 'quincenal'
                    ? `Quincena ${nextT} (Proyección)`
                    : `Mes ${nextT} (Proyección)`;

            proyecciones.push({
                label,
                predicted: predBounded
            });
            lastSalesValue = predBounded;
        }

        return {
            beta0,
            beta1,
            beta2,
            rSquared,
            confidenceLabel,
            confidenceColor,
            proyecciones,
            modelType
        };
    }, [rlmData, periodoProyeccion]);

    return { periodoProyeccion, setPeriodoProyeccion, rlmData, proyeccionResult };
}
