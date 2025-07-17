import React from "react";
import toast from "react-hot-toast";

type TPendingErrorMessage = {
  addedOn: Date;
  message: string;
};

export const showSuccessMessage = (title?: string | React.ReactNode) => {
  const messageContent =
    typeof title === "string" || React.isValidElement(title)
      ? title
      : "Task completed.";
  toast.success(messageContent);
};

export const showErrorMessage = (title?: string | React.ReactNode) => {
  const messageContent =
    typeof title === "string" || React.isValidElement(title)
      ? title
      : "Task failed, please retry.";
  toast.error(messageContent);
};

export const showWarningMessage = (title: string | React.ReactNode) => {
  const messageContent =
    typeof title === "string" || React.isValidElement(title)
      ? title
      : "Warning!";
  toast(messageContent);
};

export const showLoadingMessage = (
  title?: string | React.ReactNode,
  key?: string
) => {
  const messageContent =
    typeof title === "string" || React.isValidElement(title)
      ? title
      : "Loading...";
  return key
    ? toast.loading(messageContent, { id: key })
    : toast.loading(messageContent);
};

export const showPendingErrorMessages = () => {
  const errors: TPendingErrorMessage[] = JSON.parse(
    localStorage.getItem("pending_error_messages") ?? "[]"
  );
  if (!errors) return;
  errors
    .filter(
      (x: any) =>
        new Date(x.addedOn).getTime() > new Date().getTime() - 2 * 60 * 1000
    )
    .forEach((error: any) => showErrorMessage(error.message));
  localStorage.removeItem("pending_error_messages");
};

export const addPendingErrorMessage = (message: string) => {
  // Must Add showPendingErrorMessages(); in top og your app component to show pending error messages on page load.
  const errors: TPendingErrorMessage[] = JSON.parse(
    localStorage.getItem("pending_error_messages") ?? "[]"
  );
  errors.push({
    addedOn: new Date(),
    message,
  });
  localStorage.setItem("pending_error_messages", JSON.stringify(errors));
};
