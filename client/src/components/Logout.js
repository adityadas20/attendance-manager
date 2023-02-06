import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { UserContext } from "../App";

function Logout() {
    const { state, dispatch } = useContext(UserContext);
    const navigate = useNavigate();

    let logoutUser = async () => {
        try {
            await axios.get('http://localhost:3000/logout',
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                });
            dispatch({ type: 'USER', payload: false })
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        logoutUser();
    });
    return (
        <div>
            hello
        </div>
    )
}

export default Logout
