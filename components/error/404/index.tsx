import "./404.css";

import { useLocale } from "@/shared/context/LocaleContext.tsx";
import { dashboardUrl } from "@/shared/services/ajaxService";
import { useNavigate } from "react-router-dom";

export const FourZeroFour = ({ message }: { message?: string }) => {
  const localize = useLocale();
  const navigate = useNavigate();
  const errorImage = new URL("./error404.png", import.meta.url).href;
  return (
    <div className="container">
      <div className="image-section">
        <img src={errorImage} alt="404 Not Found" />
      </div>
      <div className="text-section">
        <h1>Error {404}</h1>
        <div className="subtitle">
          {message ? message : localize("OopsPageLookingForDoesntExist")}
        </div>
        <br />
        <div className="buttons">
          <a className="button" href={dashboardUrl}>
            {localize("GotoDashboard")}
          </a>
          <a className="button" href={"#"} onClick={() => navigate(-1)}>
            {localize("Back")}
          </a>
        </div>
      </div>
    </div>
  );
};
