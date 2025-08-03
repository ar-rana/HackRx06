import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/TokenContext.jsx";

const Login = () => {
  const { token, setToken } = useAuthContext();
  const navigate = useNavigate();

  const [signUp, setSignUp] = useState(false);
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [warning, setWarning] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const login = async (e) => {
    e.preventDefault();
    if (!user || !pass) {
      setWarning("please fill all fields");
      return;
    }
    setWarning("");
    try {
      const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user,
          password: pass,
        }),
      });
      console.log("login: ", res);

      if (res.ok) {
        const data = await res.text();
        console.log("login: ", data);
        localStorage.setItem("token", data);
        setToken(data);
        // navigate("/chat");
      } else {
        setWarning("Invalid credentials");
      }
    } catch (e) {
      console.log("some error occured: ", e.message);
      console.log(e);
    }
  };

  const register = async (e) => {
    e.preventDefault();
    if (!user || !pass || !confirmPass) {
      setWarning("please fill all fields");
      return;
    }
    if (pass != confirmPass) {
      setWarning("password does not match");
      return;
    }
    setWarning("");
    try {
      const res = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user,
          password: pass,
        }),
      });

      const data = await res.text();
      if (res.ok) {
        alert(data);
        setSignUp(false);
      } else {
        setWarning(data);
      }
    } catch (e) {
      console.log("some error occured: ", e.message);
    }
  };

  const verify = async () => {
    try {
      const res = await fetch("http://localhost:8080/auth/verify", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (res.ok) {
        const user = await res.text()
        navigate("/chat", {state: {msg: user}});
      }
    } catch (e) {
      console.log("some error occured: ", e.message);
    }
  }

  const changeFormState = (e) => {
    e.preventDefault();
    setSignUp((prev) => !prev);
  };

  useEffect(() => {
    verify();
  }, [token]);

  return (
    <div className="bg-slate-700 h-full w-full">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          HackRx - 06
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              {signUp ? "Create your account" : "Sign In"}
            </h1>
            <form className="space-y-4 md:space-y-6" action="#">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={(e) => setUser(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="youemail@provider.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  {signUp ? "Enter Password" : "Password"}
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={(e) => setPass(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                />
              </div>
              {signUp ? (
                <>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                  </div>
                </>
              ) : (
                ""
              )}
              {signUp ? (
                <>
                  <button
                    type="submit"
                    onClick={(e) => register(e)}
                    className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={(e) => login(e)}
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Sign In
                  </button>
                </>
              )}
              {warning ? (
                <>
                  <p className="text-sm font-normal text-red-600 p-0 m-0">
                    {warning}
                  </p>
                </>
              ) : (
                ""
              )}
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                {signUp ? "Have an account. " : "Don’t have an account yet? "}
                <button
                  onClick={(e) => changeFormState(e)}
                  className="font-medium text-blue-600 hover:underline dark:text-primary-500"
                >
                  {signUp ? "Sign In" : "Sign up"}
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
