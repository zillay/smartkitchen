import React, { Component } from 'react';
import './Login.css';

import {Link} from 'react-router-dom';

import getUserData from '../../services/getUserData';

let _email = '';
let _password = '';

const Login = (props) => {
    const _main = props._main;
    const isLoginFormSubmitted = _main.state.appControls.isLoginFormSubmitted;

    const onFormSubmit = (e) => {
        e.preventDefault();
        _main.showLoaderForLoginForm();
        if (!isLoginFormSubmitted) {
            getUserData(_email, _password, _main.updateUserData);
        }
    };

    return (
        <div className="Login">
            {/* <div className="card"> */}
                <h5 className="logo-heading">SmartKitchen</h5>
                <br/>
                <h4 className="form-heading">Login</h4>
                <form className="form" onSubmit={onFormSubmit}
                >
                    <label>
                        <span>Email</span>
                        <input type="email" autoComplete="off"
                            placeholder="e.g. youremail@xyz.com" required 
                            onChange={(e) => {_email = e.target.value}}
                            onFocus={(e) => {_email = e.target.value}}
                        />
                    </label>
                    <label>
                        <span>Password</span>
                        <input type="password" autoComplete="off"
                            placeholder="Enter Password Here ..." required 
                            onChange={(e) => {_password = e.target.value}}
                            onFocus={(e) => {_password = e.target.value}}
                        />
                    </label>
                    <br />
                    <button 
                        type="submit"
                        disabled={isLoginFormSubmitted}
                    >
                        &emsp;
                        {isLoginFormSubmitted 
                            ? <div className="loader in-btn"></div> 
                            : "Login"
                        }
                        &emsp;
                    </button>
                </form>
                <br />
                <Link className="ref-link" to="/signup">
                    Haven't signed up yet? <b>
                        Go to Signup <span className="arrow-right"></span>
                    </b>
                </Link>
            {/* </div> */}
        </div>
    )
}

export default Login;
