import { useEffect } from "react";
import { useTitle } from "@/shared/shared/store/store";

const PageTitleWrapper = ({
  title,
  subTitle,
  children,
}: {
  title: string;
  subTitle?: string;
  children: React.ReactNode;
}) => {
  const setTitle = useTitle((state) => state.setTitle);
  useEffect(() => {
    setTitle(title, subTitle ?? "");
    document.title = `${title} | Premium CBS`;
  }, [title, subTitle]);
  return <>{children}</>;
};

export default PageTitleWrapper;
