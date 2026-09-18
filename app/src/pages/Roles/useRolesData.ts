import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { getArrayData } from '../../utils/arrayUtils';
import type { Rol, Permiso } from './types';

export function useRolesData() {
    const [roles, setRoles] = useState<Rol[]>([]);
    const [permisos, setPermisos] = useState<Permiso[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAll = useCallback(async () => {
        setIsLoading(true);
        try {
            const [rolesRes, permisosRes] = await Promise.all([
                api.get('/roles'),
                api.get('/permisos'),
            ]);
            setRoles(getArrayData<Rol>(rolesRes.data));
            setPermisos(getArrayData<Permiso>(permisosRes.data));
        } catch (error) {
            console.error('Error fetching roles/permisos:', error);
            Swal.fire('Error', 'No se pudieron cargar los roles y permisos', 'error');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    return { roles, permisos, isLoading, refetch: fetchAll };
}
