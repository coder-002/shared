export interface BrandTheme {
  colorPrimary: string;
  backgroundColor: string;
  textColor: string;
  headingColor: string;
  labelColor: string;
  borderColor: string;
  disabledColor: string;
  linkColor: string;
  linkHoverColor: string;
  borderRadius: number;
  boxShadow: string;
}

export const brandThemes: Record<string, BrandTheme> = {
  default: {
    colorPrimary: "#003060",
    backgroundColor: "#ffffff",
    textColor: "#363641",
    headingColor: "#002244",
    labelColor: "#003060",
    borderColor: "#d9d9d9",
    disabledColor: "#bfbfbf",
    linkColor: "#003060",
    linkHoverColor: "#0050b3",
    borderRadius: 6,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
  },
  dark: {
    colorPrimary: "#69b1ff",
    backgroundColor: "#1e1e2f",
    textColor: "#f0f0f0",
    headingColor: "#cdd9ed",
    labelColor: "#a0a4b8",
    borderColor: "#3a3a4a",
    disabledColor: "#555c68",
    linkColor: "#69b1ff",
    linkHoverColor: "#91caff",
    borderRadius: 6,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.45)",
  },
  brandA: {
    colorPrimary: "#ff6600",
    backgroundColor: "#fff5e6",
    textColor: "#663300",
    headingColor: "#993d00",
    labelColor: "#cc5200",
    borderColor: "#ffcc99",
    disabledColor: "#e6ccb3",
    linkColor: "#cc5200",
    linkHoverColor: "#ff751a",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(255, 102, 0, 0.2)",
  },
  brandGreen: {
    colorPrimary: "#2e7d32",
    backgroundColor: "#f1fdf2",
    textColor: "#1b5e20",
    headingColor: "#1b5e20",
    labelColor: "#388e3c",
    borderColor: "#a5d6a7",
    disabledColor: "#c8e6c9",
    linkColor: "#388e3c",
    linkHoverColor: "#66bb6a",
    borderRadius: 8,
    boxShadow: "0 4px 12px rgba(46, 125, 50, 0.2)",
  },
};

import { theme, ThemeConfig } from "antd";

export const getThemeConfig = (brandKey: string = "default"): ThemeConfig => {
  const brand: BrandTheme = brandThemes[brandKey] || brandThemes.default;

  const token: ThemeConfig["token"] = {
    colorPrimary: brand.colorPrimary,
    colorBgBase: brand.backgroundColor,
    colorTextBase: brand.textColor,
    colorTextHeading: brand.headingColor,
    colorTextLabel: brand.labelColor,
    colorBorder: brand.borderColor,
    colorTextDisabled: brand.disabledColor,
    colorLink: brand.linkColor,
    colorLinkHover: brand.linkHoverColor,
    borderRadius: brand.borderRadius,
    boxShadowSecondary: brand.boxShadow,
  };

  const components: ThemeConfig["components"] = {
    ...{
      fontSize: 14,
      fontSizeHeading1: 32,
      fontSizeHeading2: 24,
      fontSizeHeading3: 20,
      fontSizeHeading4: 16,
      fontSizeHeading5: 14,
      lineHeightHeading1: 1.2,
      lineHeightHeading2: 1.2,
      lineHeightHeading3: 1.2,
      lineHeightHeading4: 1.2,
      lineHeightHeading5: 1.2,
    },

    Typography: {
      colorText: brand.textColor,
    },
    Button: {
      colorPrimaryHover: brand.colorPrimary,
      colorPrimaryActive: brand.colorPrimary,
    },
    Menu: {
      colorItemBgSelected: brand.colorPrimary + "20", // Slight transparency
    },
    Form: {
      labelColor: brand.labelColor,
    },
    Input: {
      colorText: brand.textColor,
      colorBorder: brand.borderColor,
      colorBgContainer: brand.backgroundColor,
    },
    Table: {
      colorText: brand.textColor,
      headerBg: brand.colorPrimary + "10",
      headerColor: brand.headingColor,
      fontSize: 14,
    },
    Card: {
      colorText: brand.textColor,
      boxShadow: brand.boxShadow,
    },
    Tabs: {
      colorText: brand.textColor,
      itemSelectedColor: brand.colorPrimary,
    },
    Modal: {
      titleColor: brand.headingColor,
    },
    Select: {
      colorText: brand.textColor,
      fontSize: 14,
    },
    Alert: {
      colorText: brand.textColor,
      colorBgContainer: brand.backgroundColor,
    },
  };

  return {
    token,
    algorithm: theme.defaultAlgorithm,
    components,
  };
};
