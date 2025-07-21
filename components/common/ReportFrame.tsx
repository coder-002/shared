import React, { useEffect } from "react";
import { getBearerToken } from "@/shared/services/authService.ts";

interface Props {
  url: string;
  onLoaded: () => void;
  fullHeight?: boolean;
}

export const ReportFrame = (props: Props) => {
  useEffect(() => {
    const el = document.getElementById("reportFrame") as any;
    if (el) {
      el.parentNode.removeChild(el);
    }

    if (!props.url) return;

    const newEl = document.createElement("iframe");
    if (props.url.toString().includes("?")) {
      newEl.setAttribute("src", props.url + "&token=" + getBearerToken());
    } else {
      newEl.setAttribute("src", props.url + "?token=" + getBearerToken());
    }
    newEl.setAttribute("width", "100%");
    newEl.setAttribute("height", "700px");
    newEl.style.display = "none";
    newEl.style.border = "1px solid #ccc";
    newEl.setAttribute("id", "reportFrame");
    newEl.onload = () => {
      props.onLoaded();
      newEl.style.display = "block";
    };

    const parent = document.getElementById("report-frame") as any;
    parent.appendChild(newEl);
  }, [props.url]);

  return (
    <div
      id="report-frame"
      style={{ height: props.fullHeight ? "100%" : "70vh" }}
    ></div>
  );
};
