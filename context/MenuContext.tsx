import React, { ReactNode, useMemo, useContext } from "react";
import {
  getCurrentRootMenu,
  Menu,
  MenuPermissionView,
  useGetAllMenus,
  useGetPermittedMenus,
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
  const userMeta = useAuth();

  const {
    data: allMenus,
    isLoading: loadingAllMenus,
    isSuccess: successAllMenus,
  } = useGetAllMenus();

  const {
    data: permittedMenus,
    isLoading: loadingPermittedMenus,
    isSuccess: successPermittedMenus,
  } = useGetPermittedMenus();

  const loading = loadingAllMenus || loadingPermittedMenus;

  const contextValue: MenuContextValue = useMemo(() => {
    if (successAllMenus && successPermittedMenus && userMeta) {
      const rootMenus = permittedMenus?.filter((m) => !m.parentId) || [];
      const currentRootMenu = getCurrentRootMenu(rootMenus);

      const currentChildMenus =
        currentRootMenu &&
        permittedMenus
          ?.filter((m) => m.parentId === currentRootMenu.menuId)
          .sort((a, b) =>
            a.menuType < b.menuType ? 1 : b.menuType < a.menuType ? -1 : 0
          );

      return {
        allMenus,
        menus: permittedMenus,
        rootMenus,
        currentRootMenu,
        currentChildMenus,
        menuLoaded: true,
      };
    }
    return {};
  }, [
    allMenus,
    permittedMenus,
    userMeta,
    successAllMenus,
    successPermittedMenus,
  ]);

  return (
    <MenuContext.Provider value={contextValue}>
      {loading ? <Loader /> : children}
    </MenuContext.Provider>
  );
};
