import "./Login.css";
import { useContext, useRef } from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

export default function Login() {
	const email = useRef();
	const password = useRef();
	const { user, isFetching, error, dispatch } = useContext(AuthContext)

	const handleClick = (e) => {
		e.preventDefault();

		loginCall(
			{ email: email.current.value, password: password.current.value },
			dispatch
		);

		user ? console.log("success") : console.log("failed")
	}

	return (
		<div className="login">
			<div className="loginWrapper">
				<div className="loginLeft">
					<h3 className="loginLogo">Fakebook</h3>
					<span className="loginDesc">
						Connect with friends and the world around you on Fakebook.
					</span>
				</div>
				<div className="loginRight">
					<form className="loginBox" onSubmit={handleClick}>
						<h5 className="loginBoxTitle">LOG IN</h5>
						<input
							type="email"
							placeholder="Email"
							className="loginInput"
							required ref={email}
						/>
						<input
							type="password"
							placeholder="Password"
							className="loginInput"
							required
							minLength={6}
							ref={password}
						/>
						<button className="loginButton" disabled={isFetching}>
							{isFetching ? <CircularProgress color="inherit" size="20px" /> : "Log In"}
						</button>
						<span className="loginForgot">Forgot Password?</span>
						<Link style={{ textAlign: "center"}} to="/register">
							<button className="loginRegisterButton">
								Create a New Account
							</button>
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
}
