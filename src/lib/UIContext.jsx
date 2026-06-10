import React, { createContext, useContext, useState } from 'react';

const UIContext = createContext({
  hideNav: false,
  setHideNav: () => {},
  actionBar: null,
  setActionBar: () => {},
});

export function UIProvider({ children }) {
  const [hideNav, setHideNav] = useState(false);
  const [actionBar, setActionBar] = useState(null);

  return (
    <UIContext.Provider value={{ hideNav, setHideNav, actionBar, setActionBar }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  return useContext(UIContext);
}
