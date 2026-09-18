import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';

export function useSessionsData() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchSessions = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/sesiones?limit=0');
            setSessions(getArrayData(res.data, 'sesiones'));
        } catch (error) {
            console.error("Error fetching sessions:", error);
            setSessions([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    return { sessions, isLoading, fetchSessions };
}
