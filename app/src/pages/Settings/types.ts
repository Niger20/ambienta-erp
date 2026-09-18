export interface ThemeOption {
    id: string;
    name: string;
    desc: string;
    colors: {
        bg: string;
        card: string;
        accent: string;
        text: string;
    };
}

export const themeOptions: ThemeOption[] = [
    {
        id: 'dark',
        name: 'Oscuro Clásico',
        desc: 'El tema por defecto, azul oscuro con detalles en azul brillante.',
        colors: { bg: '#0f172a', card: '#1e293b', accent: '#3b82f6', text: '#f8fafc' }
    },
    {
        id: 'esmeralda',
        name: 'Esmeralda Premium',
        desc: 'Verde esmeralda profundo con acentos jade de lujo.',
        colors: { bg: '#062e24', card: '#0b3c30', accent: '#10b981', text: '#ecfdf5' }
    },
    {
        id: 'sunset',
        name: 'Atardecer Warm',
        desc: 'Tonalidad cálida atardecer con violeta y acento naranja brillante.',
        colors: { bg: '#1a0f1d', card: '#29162e', accent: '#f97316', text: '#fff7ed' }
    },
    {
        id: 'oceano',
        name: 'Océano Profundo',
        desc: 'Azul abisal con contrastes turquesa y cian de alta intensidad.',
        colors: { bg: '#031926', card: '#082c3d', accent: '#06b6d4', text: '#f0f9ff' }
    },
    {
        id: 'cyberpunk',
        name: 'Cyberpunk Neón',
        desc: 'Estética futurista violeta con resplandores púrpura neón.',
        colors: { bg: '#0d021a', card: '#1c0536', accent: '#a855f7', text: '#f7f0ff' }
    },
    {
        id: 'cafe',
        name: 'Café Arábica',
        desc: 'Tonos tierra cálidos, café tostado y notas doradas.',
        colors: { bg: '#1c130e', card: '#2b1d16', accent: '#d97706', text: '#fef3c7' }
    },
    {
        id: 'negro',
        name: 'Negro Absoluto',
        desc: 'Negro puro optimizado para pantallas OLED con acentos en blanco.',
        colors: { bg: '#000000', card: '#0d0d0d', accent: '#ffffff', text: '#ffffff' }
    },
    {
        id: 'azul-amarillo',
        name: 'Azul & Oro',
        desc: 'Marino profundo con detalles dorados de alto contraste visual.',
        colors: { bg: '#020817', card: '#0b1329', accent: '#f59e0b', text: '#ffffff' }
    },
    {
        id: 'rosas',
        name: 'Rosa Retro',
        desc: 'Estética neón rosa y magenta para un diseño atrevido y vibrante.',
        colors: { bg: '#1b0a14', card: '#2e1022', accent: '#ec4899', text: '#fdf2f8' }
    },
    {
        id: 'claro',
        name: 'Modo Claro',
        desc: 'Interfaz limpia y luminosa con bordes definidos y acento azul.',
        colors: { bg: '#f8fafc', card: '#ffffff', accent: '#3b82f6', text: '#0f172a' }
    }
];
