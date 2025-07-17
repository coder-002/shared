import { ConfigProvider } from "antd";
import React, { useState } from "react";
import { useDarkMode, useThemeStore } from "@/shared/shared/store/layoutStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../context/AuthContext";
import { brandThemes, getThemeConfig } from "../theme/test-theme";
import { MenuProvider } from "../context/MenuContext";
import { LocaleProvider } from "../context/LocaleContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
  const brand = useThemeStore((state) => state.brand);

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <AuthProvider>
          <MenuProvider>
            <ConfigProvider theme={getThemeConfig(brand)}>
              {children}
            </ConfigProvider>
          </MenuProvider>
        </AuthProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
};

export default Providers;
