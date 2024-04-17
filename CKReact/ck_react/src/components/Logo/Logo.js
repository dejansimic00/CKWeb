import logo from "../../assets/images/logo.png";

function Logo({ width }) {
  return (
    <div className="mb-10">
      <img src={logo} width={width} alt="Logo"></img>
    </div>
  );
}

export default Logo;
