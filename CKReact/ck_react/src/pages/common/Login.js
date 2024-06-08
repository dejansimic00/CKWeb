import React, { useState, useContext } from "react";
import Button from "../../components/Button/Button";
import Logo from "../../components/Logo/Logo";
import TextBox from "../../components/TextBox/TextBox";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom"; // Import useHistory hook
import API_URLS from "../../utils/api";
import { useSessionStorage } from "../../hooks/useSessionStorage";
import { useLocalStorage } from "../../hooks/useLocalStorage";

function Login() {
  const { login } = useAuth();
  const { setItem, getItem } = useSessionStorage();
  const navigate = useNavigate();

  // State for storing input values
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState(
    "Korisničko ime i lozinka netacni!"
  );

  const handleSuccessfulLogin = async (response) => {
    // Handle successful login
    const responseData = await response.json(); // Parse JSON response
    setErrorText("");
    setError(false);
    const isAdmin = responseData.role === "ADMIN";
    // login({
    //   jmbg: responseData.jmbg,
    //   name: responseData.username,
    //   isAdmin: isAdmin,
    //   token: responseData.token
    // });

    setItem("jmbg", responseData.jmbg);
    setItem("name", responseData.username);
    setItem("isAdmin", isAdmin);
    setItem("token", responseData.token);
    setItem("id", responseData.id);
    setItem("username", username);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(API_URLS.LOGIN, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getItem("token")}`,

          "Content-Type": "application/json",
        },

        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        /** Handle successful login
        const responseData = await response.json(); // Parse JSON response
        setErrorText("");
        setError(false);
        const isAdmin = responseData.role === "ADMIN";
        login({
          jmbg: responseData.jmbg,
          name: username,
          isAdmin: isAdmin,
          token: responseData.token
        });

        setTimeout(() => {
          
        }, timeout);
        */
        handleSuccessfulLogin(response);
        setTimeout(() => {
          navigate("/dashboard"); // Redirect to dashboard after successful login
        }, 10);
      } else {
        setErrorText("Neispravni podaci za prijavu");
        setError(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center pt-24">
      <div className="border-black border-2 w-[30rem] rounded-[60px] p-16 flex flex-col items-center">
        <Logo width={90} />
        <form onSubmit={handleSubmit}>
          <TextBox
            placeholder="korisničko ime"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextBox
            placeholder="lozinka"
            value={password}
            type="password"
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
          <Button
            width={230}
            text="Prijavi se"
            to="/dashboard"
            onClick={handleSubmit}
          />
        </form>
      </div>
    </div>
  );
}

export default Login;
