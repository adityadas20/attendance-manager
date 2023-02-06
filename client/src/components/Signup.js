import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios';
import './Signup.css'

function Signup() {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "", password: "", cpassword: ""
    });
    const handleInputs = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setUser({ ...user, [name]: value });
    };
    const postData = async (e) => {
        e.preventDefault();
        try {
            const { name, password, cpassword } = user;
            await axios.post('http://localhost:3000/register', {
                name, password, cpassword
            });
            navigate('/login')
        } catch (err) {
            window.alert(err.response.data.error);
        }
    }

    return (
        <div class="pleasant">
            <div class="wrapper login">
                <div class="container">
                    <div class="col-left">
                        <div class="login-text">
                            <h2>Welcome!</h2>
                            <p>Already have an account?<br /></p> <NavLink to="/login" className="btn">Log In</NavLink>
                        </div>
                    </div>
                    <div class="col-right">
                        <div class="login-form">
                            <h2>Sign Up</h2>
                            <form method="POST">
                                <p> <label>Username<span>*</span></label> <input name="name" id="name" value={user.name} onChange={(e) => handleInputs(e)} type="text" placeholder="Username" required /> </p>
                                <p> <label>Password<span>*</span></label> <input name="password" id="password" value={user.password} onChange={(e) => handleInputs(e)} type="password" placeholder="Password" required /> </p>
                                <p> <label>Confirm Password<span>*</span></label> <input name="cpassword" id="cpassword" value={user.cpassword} onChange={(e) => handleInputs(e)} type="password" placeholder="Confirm your Password" required /> </p>
                                <p> <input type="submit" value="Sign In" onClick={postData} /> </p>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div >
    )
}

export default Signup
