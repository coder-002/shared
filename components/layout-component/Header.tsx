import {
  Avatar,
  Button,
  Collapse,
  CollapseProps,
  DatePicker,
  Dropdown,
  Form,
  Grid,
  Input,
  MenuProps,
  Modal,
  Typography,
} from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

import { useTitle } from "@/shared/shared/store/store";
import {
  useLayoutStore,
  useSidebarDrawerStore,
  useThemeStore,
} from "@/shared/shared/store/layoutStore";
import { useAuth } from "@/shared/context/AuthContext";
import Time from "@/shared/components/layout-component/TIme";
import { MdOutlineCalendarMonth, MdOutlineColorLens } from "react-icons/md";
import { IoMdNotificationsOutline } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import { useEffect, useState } from "react";
import { brandThemes } from "@/shared/theme/test-theme";
import { useLocale } from "@/shared/context/LocaleContext";
import { useLocaleStore } from "@/shared/shared/store/localeStore";
import { MainSearch } from "@/shared/layout/MainSearch";
import { useMenu } from "@/shared/context/MenuContext";
import { dateDiff, formatDate } from "@/shared/helper/date-helper/date-service";
import { DatePickerNp } from "../date-picker/DatePickerNp";

const Header = () => {
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const pageTitle = useTitle((state) => state.main);
  const [open, setOpen] = useState<boolean>(false);
  const localize = useLocale();
  const { menus } = useMenu();

  const collapsed = useLayoutStore((state) => state.collapsed);
  const setCollapsed = useLayoutStore((state) => state.setCollapsed);
  const setBrand = useThemeStore((state) => state.setBrand);
  const visible = useSidebarDrawerStore((state) => state.visible);
  const setVisible = useSidebarDrawerStore((state) => state.setVisible);

  const setLanguage = useLocaleStore((state) => state.setLanguage);
  const language = useLocaleStore((state) => state.language);
  const meta = useAuth();

  const [duration, setDuration] = useState<number>();
  const [durationAd, setDurationAd] = useState<number>();
  const [fromDateAd, setFromDateAd] = useState<Date>(new Date());
  const [toDateAd, setToDateAd] = useState<Date>(new Date());
  const [fromDateNp, setFromDateNp] = useState<Date>(new Date());
  const [toDateNp, setToDateNp] = useState<Date>(new Date());
  const [bsDateConverter, setBsDateConverter] = useState<Date>(new Date());
  const [adDateConverter, setAdDateConverter] = useState<Date>(new Date());

  const [form3] = Form.useForm();

  useEffect(() => {
    setDuration(dateDiff(fromDateAd, toDateAd));
  }, [toDateAd]);

  useEffect(() => {
    setDurationAd(dateDiff(fromDateNp, toDateNp));
  }, [toDateNp]);

  const handleCancel = () => {
    setOpen(false);
    setAdDateConverter(new Date());
    setBsDateConverter(new Date());
    setDurationAd(0);
    setDuration(0);
    setFromDateAd(new Date());
    setToDateAd(new Date());
    setFromDateNp(new Date());
    setToDateNp(new Date());
  };

  const themeItems: MenuProps["items"] = Object.keys(brandThemes).map(
    (brandKey, i) => {
      const brand = brandThemes[brandKey];
      return {
        key: i + 1,
        label: (
          <span onClick={() => setBrand(brandKey)}>
            <div
              style={{
                width: "20px",
                height: "20px",
                backgroundColor: brand.backgroundColor,
                borderRadius: "50%",
                border: "1px solid #ddd",
                marginTop: "5px",
              }}
            ></div>
          </span>
        ),
      };
    }
  );

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: localize("DateConvertor"),
      children: (
        <div style={{ display: "flex", gap: "20px" }}>
          <Form.Item label={localize("DateAD")}>
            <Input
              type="date"
              value={formatDate(bsDateConverter)}
              onChange={(e) => {
                setAdDateConverter(new Date(e.target.value));
                setBsDateConverter(new Date(e.target.value));
              }}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item label={localize("DateBS")}>
            <DatePickerNp
              dateAd={adDateConverter}
              onChange={(value) => {
                setBsDateConverter(new Date(value || ""));
                setAdDateConverter(new Date(value || ""));
              }}
            />
          </Form.Item>
        </div>
      ),
    },
    {
      key: "2",
      label: "Duration finder in BS",
      children: (
        <>
          <Form style={{ display: "flex", gap: "20px" }}>
            <Form.Item>
              <DatePickerNp
                dateAd={fromDateNp}
                onChange={(val) => {
                  setFromDateNp(new Date(val || ""));
                }}
              />
            </Form.Item>
            <Form.Item>
              <DatePickerNp
                dateAd={toDateNp}
                onChange={(val) => {
                  setToDateNp(new Date(val || ""));
                }}
              />
            </Form.Item>
          </Form>
          <Typography.Text>Days Count : {durationAd}</Typography.Text>
        </>
      ),
    },
    {
      key: "3",
      label: "Duration finder in AD",
      children: (
        <>
          <Form form={form3} style={{ display: "flex", gap: "20px" }}>
            <Form.Item name="fromDateAd">
              <DatePicker
                size={"large"}
                onChange={(value) => {
                  setFromDateAd(value.toDate());
                }}
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item name="toDateAd">
              <DatePicker
                size={"large"}
                onChange={(value) => {
                  setToDateAd(value.toDate());
                }}
                style={{ width: 200 }}
              />
            </Form.Item>
          </Form>
          <Typography.Text>Days Count : {duration}</Typography.Text>
        </>
      ),
    },
  ];

  const localeLanguages: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <span
          style={{
            alignSelf: "center",
            padding: "5px",
          }}
          onClick={() => {
            setLanguage("EN");
          }}
        >
          EN
        </span>
      ),
    },
    {
      key: "2",
      label: (
        <span
          style={{
            alignSelf: "center",
            padding: "5px",
          }}
          onClick={() => {
            setLanguage("NP");
          }}
        >
          NP
        </span>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          paddingInline: 40,
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <img
            src="https://cdn.premiumcbs.com/logo/premiumcbs.png"
            height={"70px"}
            style={{
              maxInlineSize: "100%",
              aspectRatio: "initial",
              background: "inherit",

              objectFit: "contain",
              padding: "2px",
              cursor: "pointer",
            }}
            alt="logo"
            onClick={() => (location.href = "/home")}
          />
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() =>
              screens.md ? setCollapsed(!collapsed) : setVisible(!visible)
            }
            style={{
              fontSize: "16px",
              transition: "left 0.2s",
            }}
          />
          {screens.lg && (
            <Typography.Text style={{ fontSize: "1rem", fontWeight: "bold" }}>
              <span style={{ fontSize: "small" }}>{meta.fullName}</span>
              <br />
              {pageTitle.toUpperCase()}
            </Typography.Text>
          )}
        </div>

        {screens.lg && (
          <div>
            <Typography.Title level={5} style={{ margin: "0" }}>
              {localize("User")}: {meta.userFullName}
            </Typography.Title>
            <Time loginTime={meta.loginTime} />
          </div>
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <MainSearch menus={menus} localize={localize} />

          <Button
            icon={
              <MdOutlineCalendarMonth
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  cursor: "pointer",
                }}
              />
            }
            type="text"
            onClick={() => setOpen(true)}
          />
          <Button
            icon={
              <IoMdNotificationsOutline
                style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  cursor: "pointer",
                }}
              />
            }
            type="text"
          />

          <Dropdown
            menu={{ items: localeLanguages }}
            placement="bottom"
            trigger={["click"]}
            arrow
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              {language === "NP" ? (
                <Typography.Text>NP</Typography.Text>
              ) : (
                <Typography.Text>EN</Typography.Text>
              )}
            </div>
          </Dropdown>

          <Dropdown
            menu={{ items: themeItems }}
            placement="bottom"
            trigger={["click"]}
            arrow
          >
            <Button
              icon={
                <MdOutlineColorLens
                  style={{
                    width: "1.5rem",
                    height: "1.5rem",
                    cursor: "pointer",
                  }}
                />
              }
              type="text"
            />
          </Dropdown>
          <Avatar
            shape="circle"
            icon={<BiUser />}
            size={"small"}
            // onClick={() => setShowUserProfileDrawer(true)}
          />
        </div>
      </div>

      <Modal
        open={open}
        footer={null}
        title="Date Service"
        onCancel={handleCancel}
      >
        <Collapse items={items} defaultActiveKey={["1"]} onChange={() => {}} />
      </Modal>
    </>
  );
};

export default Header;
