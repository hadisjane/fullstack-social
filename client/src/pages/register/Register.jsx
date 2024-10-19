import "./Register.css";
import { useRef, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@mui/material";

export default function Register() {
	const username = useRef()
	const email = useRef()
	const password = useRef()
	const passwordAgain = useRef()
	const [error, setError] = useState(false)
	const history = useNavigate()
	const { isFetching } = useContext(AuthContext)

	const handleClick = async (e) => {
		e.preventDefault()

		if (passwordAgain.current.value !== password.current.value) {
			setError(true)
		} else {
			const user = {
				username: username.current.value,
				email: email.current.value,
				password: password.current.value
			}

			try {
				await axios.post("/auth/register", user)
				history("/login")
			} catch (err) {
				setError(true)
			}
		}
	}

	return (
		<div className="register">
			<div className="registerWrapper">
				<div className="registerLeft">
					<h3 className="registerLogo">Fakebook</h3>
					<span className="registerDesc">
						Connect with friends and the world around you on Fakebook.
					</span>
				</div>
				<div className="registerRight">
					<form className="registerBox" onSubmit={handleClick}>
						<h4 className="registerBoxTitle">Sign Up</h4>
						<input type="text" placeholder="Username" ref={username} required className="registerInput" />
						<input type="email" placeholder="Email" ref={email} required className="registerInput" />
						<input type="password" placeholder="Password" ref={password} required className="registerInput" />
						<input type="password" placeholder="Password Again" ref={passwordAgain} required className="registerInput" />
						<span style={{ color: "red" }} className="registerError">{error && "Passwords don't match!"}</span>
						<button className="registerButton" disabled={isFetching} type="submit">
							{isFetching ? <CircularProgress color="inherit" size="20px" /> : "Sign Up"}
						</button>
						<Link to={"/login"} style={{ textAlign: "center" }}>
							<button className="registerRegisterButton">
								Log into Account
							</button>
						</Link>
					</form>
				</div>
			</div>
		</div>
	);
}

