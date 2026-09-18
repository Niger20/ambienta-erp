import { useState } from 'react';
import api from '../../api/axios';
import {
    buildReporteCierreConMetodos,
    exportReporteCierrePDF,
    exportReporteCierreExcel,
} from '../../utils/reporteCierreUtils';

export function useSessionReports() {
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [downloadingExcelId, setDownloadingExcelId] = useState<number | null>(null);

    const handleDownloadSessionPDF = async (sessionId: number) => {
        setDownloadingId(sessionId);
        try {
            const res = await api.get(`/sesiones/${sessionId}/reporte-cierre`);
            const detailed = await buildReporteCierreConMetodos(sessionId, res.data);
            exportReporteCierrePDF(detailed);
        } catch (err) {
            console.error("Error al exportar PDF de sesión:", err);
            alert("No se pudo generar el PDF del reporte de cierre.");
        } finally {
            setDownloadingId(null);
        }
    };

    const handleDownloadSessionExcel = async (sessionId: number) => {
        setDownloadingExcelId(sessionId);
        try {
            const res = await api.get(`/sesiones/${sessionId}/reporte-cierre`);
            const detailed = await buildReporteCierreConMetodos(sessionId, res.data);
            exportReporteCierreExcel(detailed);
        } catch (err) {
            console.error("Error al exportar Excel de sesión:", err);
            alert("No se pudo generar el archivo Excel del reporte de cierre.");
        } finally {
            setDownloadingExcelId(null);
        }
    };

    return { downloadingId, downloadingExcelId, handleDownloadSessionPDF, handleDownloadSessionExcel };
}
