import React, { useState } from "react";
import Button from "../../components/Button/Button";
import Logo from "../../components/Logo/Logo";
import TextBox from "../../components/TextBox/TextBox";

function Login() {
  // State for storing input values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState(
    "Korisnicko ime i lozinka netacni!"
  );

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Handle successful login
        console.log("Login successful");
        setErrorText("");
        setError(false);
      } else {
        // Handle login error
        setErrorText("Neispravni podaci za prijavu");
        setError(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="border-black border-2 w-[30rem] rounded-[60px] p-16 flex flex-col items-center">
      <Logo width={90} />
      <form onSubmit={handleSubmit}>
        <TextBox
          placeholder="korisnicko ime"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextBox
          placeholder="lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Conditionally render an empty space if there is no error */}
        {error ? (
          <p
            style={{
              color: "red",
              paddingLeft: "24px",
              fontSize: "14px",
              fontWeight: "lighter",
              alignSelf: "start",
            }}
          >
            {errorText}
          </p>
        ) : (
          <div style={{ height: "20px" }}></div> // Adjust the height as needed
        )}
        <Button width={230} text="Prijavi se" />
      </form>
    </div>
  );
}

export default Login;
