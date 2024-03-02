import {
    mdiHome,
    mdiThemeLightDark,
    mdiLoginVariant,
    mdiAccountPlus,
    mdiAccount,
    mdiLogout,
    mdiTemperatureCelsius,
    mdiTranslateVariant,
} from '@mdi/js';

export default [
    {
        icon: mdiHome,
        label: 'Home',
        labelPT: 'Início',
        route: 'home',
    },
    {
        icon: mdiTemperatureCelsius,
        label: 'Page',
        labelPT: 'Página',
        route: 'page',
    },
    {
        icon: mdiThemeLightDark,
        hover: 'Light / Dark Theme',
        hoverPT: 'Tema Claro / Escuro',
        isToggleTheme: true,
    },
    {
        icon: mdiTranslateVariant,
        hover: 'Language EN / PT',
        hoverPT: 'Língua PT / EN',
        isToggleLang: true,
    },
    {
        icon: mdiLoginVariant,
        label: 'Login',
        labelPT: 'Entrar',
        route: 'login',
        isAuth: false,
    },
    {
        icon: mdiAccountPlus,
        label: 'Register',
        labelPT: 'Registar',
        to: 'register',
        isAuth: false,
    },
    {
        icon: mdiAccount,
        label: 'Profile',
        labelPT: 'Perfil',
        route: 'profile',
        isAuth: true,
    },
    {
        icon: mdiLogout,
        hover: 'Logout',
        hoverPT: 'Sair',
        isLogout: true,
        isAuth: true,
    },
];
