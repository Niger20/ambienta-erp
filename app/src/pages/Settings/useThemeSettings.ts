import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { themeOptions } from './types';

export function useThemeSettings() {
    const [currentTheme, setCurrentTheme] = useState('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('app-theme') || 'dark';
        setCurrentTheme(savedTheme);
    }, []);

    const handleThemeChange = (themeId: string) => {
        setCurrentTheme(themeId);
        document.documentElement.setAttribute('data-theme', themeId);
        localStorage.setItem('app-theme', themeId);

        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
        });
        Toast.fire({
            icon: 'success',
            title: `Tema "${themeOptions.find(t => t.id === themeId)?.name}" aplicado`
        });
    };

    return { currentTheme, handleThemeChange };
}
