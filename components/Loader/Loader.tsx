import myIcon from "../assets/myIcon.svg";
const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <img src={myIcon} alt="Loading..." />
    </div>
  );
};

export default Loader;
