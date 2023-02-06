import React, { useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { UserContext } from "../App";
import axios from 'axios';

function Navbar() {
    const { state, dispatch } = useContext(UserContext);

    const callNavbar = async () => {
        try {
            const res = await axios.get('http://localhost:3000/about',
                {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                });

            if (res.data) {
                dispatch({ type: 'USER', payload: true })
            }
            else {
                dispatch({ type: 'USER', payload: false })
            }

        }
        catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        callNavbar();
    });
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <NavLink className="navbar-brand" to="/about">Attendance Manager</NavLink>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">

                            {
                                (!state) ?
                                    <>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to="/login">Login</NavLink>
                                        </li>
                                        <li className="nav-item">
                                            <NavLink className="nav-link" to="/signup">SignUp</NavLink>
                                        </li>
                                    </>
                                    :
                                    <li className="nav-item">
                                        <NavLink className="nav-link" to="/logout">Logout</NavLink>
                                    </li>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar

/*
<li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Dropdown
                                </a>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="#">Action</a></li>
                                    <li><a className="dropdown-item" href="#">Another action</a></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                                </ul>
                            </li>
*/