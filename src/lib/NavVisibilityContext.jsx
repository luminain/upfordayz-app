import { createContext, useContext } from 'react';

export const NavVisibilityContext = createContext({ hideNav: false, setHideNav: () => {} });
export const useNavVisibility = () => useContext(NavVisibilityContext);