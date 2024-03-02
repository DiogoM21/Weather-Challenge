import { mdiHome, mdiThemeLightDark, mdiLoginVariant, mdiAccountPlus, mdiAccount, mdiLogout } from '@mdi/js';

export default [
    {
        icon: mdiHome,
        label: 'Home',
        route: 'home',
    },
    {
        icon: mdiHome,
        label: 'Test',
        route: 'test',
    },
    {
        icon: mdiThemeLightDark,
        hover: 'Tema Claro / Escuro',
        isToggleTheme: true,
    },
    {
        icon: mdiLoginVariant,
        label: 'Login',
        route: 'login',
        isAuth: false,
    },
    {
        icon: mdiAccountPlus,
        label: 'Registar',
        to: 'register',
        isAuth: false,
    },
    {
        icon: mdiAccount,
        label: 'Perfil',
        route: 'profile',
        isAuth: true,
    },
    {
        icon: mdiLogout,
        hover: 'Sair',
        isLogout: true,
        isAuth: true,
    },
];
