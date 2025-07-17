import { useCallback, useMemo } from "react";
import { Select } from "antd";
import { LocalizeFn } from "../context/LocaleContext";
import { Locale } from "../model/Locale";
import { BiSearch } from "react-icons/bi";
import { MenuPermissionView } from "../services/menu/service-menu";

type Props = {
  menus?: MenuPermissionView[];
  localize: LocalizeFn;
};

export const MainSearch = ({ menus, localize }: Props) => {
  const getLocalizedMenu = useCallback(
    (menuName: string, menuCode: string, menuType?: string) => {
      const splitted = menuName.split(" ");

      if (menuType && menuType == "R")
        return `[R] ${menuCode} | ${localize(splitted[1] as keyof Locale)}`;
      else
        return `${localize(splitted[0] as keyof Locale)} | ${localize(
          splitted[1] as keyof Locale
        )}`;
    },
    [localize]
  );

  const childMenus = useMemo(() => menus?.filter((x) => x.parentId), [menus]);
  const selectMenu = useMemo(
    () =>
      childMenus
        ?.sort((a, b) => a.menuCode.localeCompare(b.menuCode))
        .map((x: MenuPermissionView) => (
          <Select.Option
            searchValue={(x.menuName as string).toLowerCase()}
            title={getLocalizedMenu(x.menuName, x.menuCode, x.menuType)}
            key={x.menuId}
            value={x.url}
          >
            {getLocalizedMenu(x.menuName, x.menuCode, x.menuType)}
          </Select.Option>
        )),
    [childMenus, getLocalizedMenu]
  );

  return (
    <Select
      id={"menu-search-select-element"}
      placeholder={localize("Search")}
      allowClear={true}
      showSearch={true}
      optionFilterProp="children"
      // showArrow={false}
      suffixIcon={<BiSearch />}
      autoClearSearchValue={true}
      style={{
        width: "250px",
      }}
      onChange={(val: string) => {
        var baseUrl = window.location.protocol + "//" + window.location.host;
        window.location.href = baseUrl + val;
      }}
      popupMatchSelectWidth={true}
    >
      {selectMenu}
    </Select>
  );
};
