import React, {
  ReactNode,
  useMemo,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import {
  getCurrentRootMenu,
  getMenus,
  getPermittedMenus,
  Menu,
  MenuPermissionView,
} from "@/shared/services/menu/service-menu.ts";
import { useAuth } from "./AuthContext.tsx";
import Loader from "../components/Loader/Loader.tsx";

type Props = {
  children: ReactNode;
};

interface MenuContextValue {
  allMenus?: Menu[];
  menus?: MenuPermissionView[];
  rootMenus?: MenuPermissionView[];
  currentRootMenu?: MenuPermissionView;
  currentChildMenus?: MenuPermissionView[];
  menuLoaded?: boolean;
}

const MenuContext = React.createContext<MenuContextValue>({});
export const useMenu = () => useContext(MenuContext);

export const MenuProvider = ({ children }: Props) => {
  const [loading, setLoading] = useState(true);
  const userMeta = useAuth();
  const [data, setData] = useState<MenuContextValue>({});

  const init = useCallback(async () => {
    if (userMeta) {
      const [menus, allMenus] = await Promise.all([
        getPermittedMenus(),
        getMenus(),
      ]);
      if (menus && allMenus) {
        const rootMenus = menus.filter((m: any) => !m.ParentId);
        const currentRootMenu = getCurrentRootMenu(rootMenus);

        setData({
          allMenus,
          menus,
          rootMenus,
          currentRootMenu,
          currentChildMenus:
            currentRootMenu &&
            menus
              .filter((m: any) => m.ParentId === currentRootMenu.menuId)
              .sort((a, b) =>
                a.menuType < b.menuType ? 1 : b.menuType < a.menuType ? -1 : 0
              ),
          menuLoaded: true,
        });
        setLoading(false);
      }
    }
  }, [userMeta]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <MenuContext.Provider value={data}>
      {loading ? <Loader /> : children}
    </MenuContext.Provider>
  );
};
