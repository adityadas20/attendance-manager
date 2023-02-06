import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { UserContext } from "../App";

function Login() {
    const { state, dispatch } = useContext(UserContext);


    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3000/signin', {
                name: username, password
            }, { withCredentials: true });

            dispatch({ type: 'USER', payload: true })
            navigate('/about');
        } catch (e) {
            window.alert('invalid credentials');
        }
    }

    return (
        <div>
            <div className="pleasant">
                <div className="wrapper login">
                    <div className="container">
                        <div className="col-left">
                            <div className="login-text">
                                <h2>Welcome!</h2>
                                <p>New here?</p> <NavLink to="/signup" className="btn">Sign Up</NavLink>
                            </div>
                        </div>
                        <div className="col-right">
                            <div className="login-form">
                                <h2>Login</h2>
                                <form method="POST">
                                    <p> <label>Username<span>*</span></label> <input value={username} onChange={((e) => setUsername(e.target.value))} name="username" id="username" type="text" placeholder="Username" required /> </p>
                                    <p> <label>Password<span>*</span></label> <input value={password} onChange={((e) => setPassword(e.target.value))} name="password" id="password" type="password" placeholder="Password" required /> </p>
                                    <p> <input type="submit" value="Log In" onClick={(loginUser)} /> </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
