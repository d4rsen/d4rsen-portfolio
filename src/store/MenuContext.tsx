import React, { FC, ReactNode, createContext, useContext, useMemo, useState } from 'react';

interface MenuContextValue {
    open: boolean;
    setOpen: (open: boolean) => void;
    toggle: () => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

export const MenuProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const value = useMemo(() => ({ open, setOpen, toggle: () => setOpen((prev) => !prev) }), [open]);

    return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) throw new Error('useMenu must be used within MenuProvider');
    return context;
};
