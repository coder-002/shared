import { Layout } from "antd";
import Footer from "@/shared/components/layout-component/Footer";
import Header from "@/shared/components/layout-component/Header";
import Providers from "@/shared/provider/Providers";
import Sidebar from "@/shared/components/layout-component/Sidebar";
import { ReactNode } from "react";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Providers>
      <Layout style={{ height: "100vh" }}>
        <Header />
        <Layout>
          <Sidebar />
          <Layout>
            <Layout.Content
              style={{
                padding: 24,
                margin: 0,
                marginBottom: "12px",
                marginRight: "12px",
                minHeight: 280,
                zIndex: 1,
                overflowY: "scroll",
                scrollbarWidth: "none",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                borderRadius: "8px",
              }}
            >
              {children}
            </Layout.Content>
          </Layout>
        </Layout>
        <Footer />
      </Layout>
    </Providers>
  );
};

export default DefaultLayout;
