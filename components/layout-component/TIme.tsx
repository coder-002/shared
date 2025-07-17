import { Typography } from "antd";
import React, { useState, useEffect } from "react";

interface LoginTime {
  loginTime: string;
}

const Time = ({ loginTime }: LoginTime) => {
  const storedTime = new Date(loginTime).getTime();
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      setElapsedTime(currentTime - storedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [storedTime]);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;

    return `${String(hours).padStart(2, "0")}:${String(
      remainingMinutes
    ).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  return (
    <Typography.Title level={5} style={{ marginTop: "0" }}>
      <small>Logged in time:</small> {formatTime(elapsedTime)}
    </Typography.Title>
  );
};

export default Time;
