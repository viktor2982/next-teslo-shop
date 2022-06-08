import { createContext } from 'react';

export interface UIContextProps {
    isMenuOpen: boolean;

    // Methods
    toggleSideMenu: () => void;
}

export const UIContext = createContext({} as UIContextProps);