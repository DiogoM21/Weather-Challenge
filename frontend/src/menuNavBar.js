import { mdiHome, mdiThemeLightDark, mdiLoginVariant, mdiAccountPlus, mdiAccount, mdiLogout } from '@mdi/js';

export default [
    {
        icon: mdiHome,
        label: 'Home',
        to: '/',
    },
    {
        icon: mdiThemeLightDark,
        hover: 'Claro / Escuro',
        isToggleLightDark: true,
    },
    {
        icon: mdiLoginVariant,
        label: 'Login',
        to: '/login',
        isAuthenticated: false,
    },
    {
        icon: mdiAccountPlus,
        label: 'Registar',
        to: '/register',
        isAuthenticated: false,
    },
    {
        icon: mdiAccount,
        label: 'Perfil',
        to: '/profile',
        isAuthenticated: true,
    },
    {
        icon: mdiLogout,
        hover: 'Sair',
        isLogout: true,
    },
];
