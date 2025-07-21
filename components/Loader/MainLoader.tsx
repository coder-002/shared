import myIcon from "../assets/myIcon.svg";

const MainLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <img src={myIcon} alt="Loading..." />
    </div>
  );
};

export default MainLoader;
