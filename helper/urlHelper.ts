export const isRunningOnLocalHost = (target?: string) => {
  const actualBaseUrl =
    target ??
    window.location.origin
      .replace("http://", "")
      .replace("https://", "")
      .split("/")[0];

  return (
    actualBaseUrl.startsWith("localhost") ||
    actualBaseUrl.startsWith("127.0.0.1") ||
    actualBaseUrl.startsWith("0.0.0.0")
  );
};
