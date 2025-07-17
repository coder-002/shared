import { Typography } from "antd";

const Footer = ({
  footerPosition,
}: {
  footerPosition?: "left" | "right" | "center";
}) => {
  return (
    <div
      style={{
        zIndex: 1,
        height: "15px",
        padding: "5px",
        paddingTop: "0px",
        paddingBottom: "15px",
        display: "flex",
        justifyContent: footerPosition ?? "center",
        alignItems: "center",
      }}
    >
      <small>
        <Typography.Text>
          <strong>
            Powered by:
            <a href={"https://premiumtech.com.np/premiumcbs"}>Premium CBS</a>
          </strong>
        </Typography.Text>
      </small>
    </div>
  );
};

export default Footer;
