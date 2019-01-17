import React, { Component } from 'react';
import './Signup.css';

import {Link} from 'react-router-dom';

import signupUser from '../../services/signupUser';

let _name = '';
let _email = '';
let _password = '';
let _device_puid = '';

const Signup = (props) => {
    const _main = props._main;
    const isSignupFormSubmitted = _main.state.appControls.isSignupFormSubmitted;

    const onFormSubmit = (e) => {
        e.preventDefault();
        _main.showLoaderForSignupForm();
        if (!isSignupFormSubmitted) {
            signupUser(
                _name, _email, _password, _device_puid, _main.handleSignup
            );
        }
    };

    return (
        <div className="Signup">
            {/* <div className="card"> */}
                <h5 className="logo-heading">SmartKitchen</h5>
                <br />
                <h4 className="form-heading">Signup</h4>
                <form className="form" onSubmit={onFormSubmit}>
                    <label>
                        <span>Name</span>
                        <input type="text" autoComplete="off"
                            placeholder="Enter Your Name Here ..." required 
                            onChange={(e) => {_name = e.target.value}}
                            onFocus={(e) => {_name = e.target.value}}
                        />
                    </label>
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
                    <label>
                        <span>Device ID</span>
                        <input type="text" autoComplete="off"
                            placeholder="Enter Device ID Here ..." required 
                            onChange={(e) => {_device_puid = e.target.value}}
                            onFocus={(e) => {_device_puid = e.target.value}}
                        />
                    </label>
                    <br />
                    <button 
                        type="submit"
                        disabled={isSignupFormSubmitted}
                    >
                        &emsp;
                        {isSignupFormSubmitted 
                            ? <div className="loader in-btn"></div> 
                            : "Signup"
                        }
                        &emsp;
                    </button>
                </form>
                <br />
                <Link className="ref-link" to="/">
                    Already registered? <b>
                        Go to Login <span className="arrow-right"></span>
                    </b>
                </Link>
            {/* </div> */}
        </div>
    )
}

export default Signup;
