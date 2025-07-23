import { useAuth } from "@/shared/context/AuthContext";
import { useLocale } from "@/shared/context/LocaleContext";
import { useMenu } from "@/shared/context/MenuContext";
import { getMenuIconByConfig } from "@/shared/helper/iconHelper";
import { Locale } from "@/shared/model/Locale";
import {
  MenuPermissionView,
  reports,
} from "@/shared/services/menu/service-menu";
import {
  useLayoutStore,
  useSidebarDrawerStore,
} from "@/shared/shared/store/layoutStore";
import { Button, Card, Menu, MenuProps, Popover, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useCallback, useEffect, useState } from "react";
import { FaAppStore } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const localize = useLocale();
  const meta = useAuth();
  const [selectedRootMenu, setSelectedRootMenu] = useState<number>(0);
  const [menuCode, setCurrentMenuCode] = useState<string>("");
  const [basePath, setBasePath] = useState<string>("");
  const [currentPageRootMenu, setCurrentPageRootMenu] =
    useState<MenuPermissionView>();

  const setCollapsed = useLayoutStore((state) => state.setCollapsed);
  const collapsed = useLayoutStore((state) => state.collapsed);

  const [open, setOpen] = useState<boolean>(false);
  const { rootMenus, menus } = useMenu();

  const isLocalMenu = (menu: MenuPermissionView) => {
    if (menu.parentId === currentPageRootMenu?.menuId) {
      return !menu?.url?.includes("admin/day-close");
    }
    return false;
  };

  useEffect(() => {
    const activeRootMenuCode = menus
      ?.filter((x) => x.parentId === null && x.menuType === "M")
      .find((x) => window.location.pathname.startsWith(x.url))?.menuCode;

    if (menus) {
      let currentMenu = menus.filter((x) =>
        x.url.includes(location.pathname)
      )[0];
      if (!currentMenu)
        currentMenu = menus.filter((x: MenuPermissionView) =>
          location.pathname.includes(x.url)
        )[0];

      if (currentMenu && currentMenu.menuType == "R") {
        if (location.pathname.startsWith("/rpt/member"))
          setCurrentMenuCode("901");
        if (location.pathname.startsWith("/rpt/teller"))
          setCurrentMenuCode("902");
        if (location.pathname.startsWith("/rpt/deposit"))
          setCurrentMenuCode("903");
        if (location.pathname.startsWith("/rpt/loan"))
          setCurrentMenuCode("904");
        if (location.pathname.startsWith("/rpt/share"))
          setCurrentMenuCode("905");
        if (location.pathname.startsWith("/rpt/collection"))
          setCurrentMenuCode("906");
        if (location.pathname.startsWith("/rpt/account"))
          setCurrentMenuCode("907");
        if (location.pathname.startsWith("/rpt/interest"))
          setCurrentMenuCode("908");
        if (location.pathname.startsWith("/rpt/mis")) setCurrentMenuCode("909");
        if (location.pathname.startsWith("/rpt/regulator"))
          setCurrentMenuCode("910");
        if (location.pathname.startsWith("/rpt/other"))
          setCurrentMenuCode("911");
        if (location.pathname.startsWith("/rpt/custom"))
          setCurrentMenuCode("912");
      } else setCurrentMenuCode(currentMenu?.menuCode);

      const activeRootMenu = menus.find(
        (x: MenuPermissionView) => x.menuCode === activeRootMenuCode
      );

      if (activeRootMenu) {
        setSelectedRootMenu(activeRootMenu.menuId);
        setCurrentPageRootMenu(activeRootMenu);
        setBasePath(activeRootMenu.url);
      }
    }
  }, [menus]);

  const getLocalizedMenu = useCallback(
    (menuName: string, menuCode: string, menuType?: string) => {
      const splitted = menuName.split(" ");
      if (!splitted[1])
        return `${menuCode} | ${localize(menuName as keyof Locale)}`;

      return `${menuCode} | ${localize(splitted[1] as keyof Locale)}`;
    },
    [localize]
  );

  const reportMenus = () => {
    let reportMenu: MenuPermissionView = {
      allowEdit: false,
      branchId: 0,
      config: "",
      formUrl: "",
      menuCode: "",
      menuId: 0,
      menuName: "",
      menuType: "R",
      permissionId: 0,
      url: "",
      userId: 0,
      userName: "",
      parentId: 9,
    };

    var reportItems: MenuPermissionView[] = [];
    const items = menus?.filter((x) => x.parentId == 9);
    if (items?.find((x) => reports.member.includes(x.menuCode)))
      reportItems.push({
        ...reportMenu,
        menuCode: "901",
        menuName: "MemberReport",
        url: "/rpt/member",
      });
    if (items?.find((x) => reports.teller.includes(x.menuCode)))
      reportItems.push({
        ...reportMenu,
        menuCode: "902",
        menuName: "TellerReport",
        url: "/rpt/teller",
      });
    if (items?.find((x) => reports.deposit.includes(x.menuCode)))
      reportItems.push({
        ...reportMenu,
        menuCode: "903",
        menuName: "DepositReport",
        url: "/rpt/deposit",
      });
    if (items?.find((x) => reports.loan.includes(x.menuCode)))
      reportItems.push({
        ...reportMenu,
        menuCode: "904",
        menuName: "LoanReport",
        url: "/rpt/loan",
      });
    if (items?.find((x) => reports.share.includes(x.menuCode)))
      reportItems.push({
        ...reportMenu,
        menuCode: "905",
        menuName: "ShareReport",
        url: "/rpt/share",
      });
    if (items?.find((x) => reports.collection.includes(x.menuCode)))
      reportItems.push({
        ...reportMenu,
        menuCode: "906",
        menuName: "CollectionReport",
        url: "/rpt/collection",
      });
    if (items?.find((x) => reports.account.includes(x.menuCode)))
      reportItems.push({
        ...reportMenu,
        menuCode: "907",
        menuName: "AccountReport",
        url: "/rpt/account",
      });
    if (items?.find((x) => reports.interest.includes(x.menuCode)))
      reportItems.push({
        ...reportMenu,
        menuCode: "908",
        menuName: "InterestReport",
        url: "/rpt/interest",
      });
    if (items?.find((x) => reports.mis.includes(x.menuCode)))
      reportItems.push({
        ...reportMenu,
        menuCode: "909",
        menuName: "MISReport",
        url: "/rpt/mis",
      });
    if (items?.find((x) => reports.regulator.includes(x.menuCode)))
      reportItems.push({
        ...reportMenu,
        menuCode: "910",
        menuName: "RegulatorReport",
        url: "/rpt/regulator",
      });
    if (items?.find((x) => reports.other.includes(x.menuCode)))
      reportItems.push({
        ...reportMenu,
        menuCode: "911",
        menuName: "OtherReport",
        url: "/rpt/other",
      });
    if (items?.find((x) => reports?.custom?.includes(x.menuCode)))
      reportItems.push({
        ...reportMenu,
        menuCode: "912",
        menuName: "CustomReport",
        url: "/rpt/custom",
      });

    return reportItems;
  };

  const menuItems: MenuProps["items"] =
    selectedRootMenu == 9
      ? reportMenus()
          .sort((a, b) => Number(a.menuCode) - Number(b.menuCode))
          .map((c) => {
            return {
              key: c.menuCode,
              onClick: () => {
                setCurrentMenuCode(c.menuCode);
                // setVisible(false);
              },
              label: (
                <div className="menu">
                  {isLocalMenu(c) ? (
                    <Link
                      // onClick={() => setCollapsed(true)}
                      to={c.url.replace(basePath, "")}
                    >
                      {getLocalizedMenu(c.menuName, c.menuCode)}
                    </Link>
                  ) : (
                    <a href={c.url}>
                      {getLocalizedMenu(c.menuName, c.menuCode)}
                    </a>
                  )}
                </div>
              ),
            };
          })
      : menus
          ?.filter((m) => m.parentId == selectedRootMenu)
          ?.sort((a, b) => Number(a.menuCode) - Number(b.menuCode))
          ?.map((c) => {
            return {
              key: c.menuCode,
              onClick: () => {
                setCurrentMenuCode(c.menuCode);

                // setVisible(false);
              },
              label: (
                <div className="menu">
                  {isLocalMenu(c) ? (
                    <Link
                      // onClick={() => setCollapsed(true)}
                      to={c.url.replace(basePath, "")}
                    >
                      {getLocalizedMenu(c.menuName, c.menuCode)}
                    </Link>
                  ) : (
                    <a href={c.url}>
                      {getLocalizedMenu(c.menuName, c.menuCode)}
                    </a>
                  )}
                </div>
              ),
            };
          });

  return (
    <div style={{ padding: ".5rem" }}>
      <Sider
        style={{
          height: "100%",
          background: "inherit",
        }}
        collapsed={collapsed}
        width={270}
        trigger={null}
        collapsedWidth="0"
        breakpoint="lg"
        onBreakpoint={(broken) => {
          if (broken) setCollapsed(broken);
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography.Text>{meta.nickName}</Typography.Text>
          <Typography.Text style={{ display: "inline", fontSize: "14px" }}>
            {"TranDate"}:
            <strong>
              {meta.todayBS
                .split("/")
                .map((x) => x)
                .join("/")}
            </strong>
          </Typography.Text>
        </div>
        <Popover
          title={"Apps"}
          placement="bottomRight"
          trigger="click"
          open={open}
          onOpenChange={(x: boolean) => setOpen(x)}
          content={
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "10px",
              }}
            >
              {rootMenus?.map((x) => (
                <Card
                  hoverable
                  key={x.menuId}
                  onClick={() => {
                    // setMenuCollapsed(
                    //   selectedRootMenu === x.menuId
                    //     ? !menuCollapsed
                    //     : selectedRootMenu === x.menuId
                    // );

                    setSelectedRootMenu(+x.menuId);
                    // setShowReports(x.menuCode === "900");
                    setOpen(false);
                  }}
                  bodyStyle={{
                    padding: ".5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "none",
                    }}
                  >
                    <img
                      src={getMenuIconByConfig(x.menuCode)}
                      width={"40px"}
                      height={"40px"}
                    />
                    <Typography.Text key={x.menuCode}>
                      {x.menuName.split(" ")[1] as any}
                    </Typography.Text>
                  </div>
                </Card>
              ))}
            </div>
          }
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Button icon={<FaAppStore />} onClick={() => setOpen(!open)} />
            {selectedRootMenu && selectedRootMenu !== 999 ? (
              <Typography.Title level={5} style={{ marginTop: "0.5em" }}>
                {rootMenus?.find((x) => x.menuId == selectedRootMenu)?.menuName}
              </Typography.Title>
            ) : (
              <Typography.Title level={5} style={{ marginTop: "0.5em" }}>
                Apps
              </Typography.Title>
            )}
          </div>
        </Popover>
        <Menu
          style={{
            flexGrow: 1,
            borderRadius: "1rem",
            maxHeight: "80vh",
            overflow: "auto",
            zIndex: 99,
            background: "inherit",
          }}
          className="sidebar-menu"
          selectedKeys={[menuCode]}
          items={menuItems}
        ></Menu>
      </Sider>
    </div>
  );
};

export default Sidebar;
