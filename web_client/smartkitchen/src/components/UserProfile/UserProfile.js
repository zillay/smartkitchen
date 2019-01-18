import React, { Component } from 'react';
import './UserProfile.css';

import Navbar from '../Navbar/Navbar';

import updateUserName from '../../services/updateUserName';
import updateUserPassword from '../../services/updateUserPassword';
import deleteUser from '../../services/deleteUser';

const UserProfile = (props) => {
    const _main = props._main;
    const display = 
        _main.state.appControls.isUserProfileEditable ? 'block' : 'none';
    const passInputType = 
        _main.state.appControls.isUserProfileEditable ? 'text' : 'password';
    const isUserEditNameFormSubmitted = 
        _main.state.appControls.isUserEditNameFormSubmitted;
    const isUserEditPasswordFormSubmitted = 
        _main.state.appControls.isUserEditPasswordFormSubmitted;
    const isUserProfileEditable = 
        !_main.state.appControls.isUserProfileEditable;
    const isUserDeleteFormSubmitted = 
        _main.state.appControls.isUserDeleteFormSubmitted;

    if (_main.state.userEdit.userNewName === null ) {
        let newState = _main.state;
        newState.userEdit.userNewName = _main.state.user.name;
        newState.userEdit.userNewPassword = _main.state.user.password;
        _main.setState(newState);
    }
    
    const toggleEditable = (e) => {
        let newState = _main.state;
        newState.appControls.isUserProfileEditable = 
            !newState.appControls.isUserProfileEditable;
        newState.userEdit.userNewName = _main.state.user.name;
        newState.userEdit.userNewPassword = _main.state.user.password;
        _main.setState(newState);
    }

    const onNameEdit = (e) => {
        let newState = _main.state;
        newState.userEdit.userNewName = e.target.value;
        _main.setState(newState);
    }
    
    const onPasswordEdit = (e) => {
        let newState = _main.state;
        newState.userEdit.userNewPassword = e.target.value;
        _main.setState(newState);
    }

    const onNameEditFormSubmit = (e) => {
        e.preventDefault();
        _main.showLoaderForUserEditNameForm();
        updateUserName(
            _main.state.user.email,
            _main.state.user.password,
            _main.state.userEdit.userNewName,
            _main.handleUserNameUpdate
        );
    }
        
    const onPasswordEditFormSubmit = (e) => {
        e.preventDefault();
        _main.showLoaderForUserDeleteForm();
        updateUserPassword(
            _main.state.user.email,
            _main.state.user.password,
            _main.state.userEdit.userNewPassword,
            _main.handleUserPasswordUpdate
        );
    }
   
    const onDeleteUser = (e) => {
        e.preventDefault();
        _main.showLoaderForUserDeleteForm();
        deleteUser(
            _main.state.user.email,
            _main.state.user.password,
            _main.handleUserDelete
        );
    }

    return (
    <div className="UserProfile">
        <Navbar _main={_main} />
        <div className="user-profile-ctr">
            <h3>
                {_main.state.user.name}'s Profile 
                <button className={
                    "edit-btn" +
                    (_main.state.appControls.isUserProfileEditable 
                    ? " active" : "")}
                    onClick={toggleEditable}
                >
                    {(_main.state.appControls.isUserProfileEditable 
                    ? "BACK" : "EDIT")}
                </button>
            </h3>
            <br />
            <form className="form" onSubmit={onNameEditFormSubmit}>
                <label>
                    <span>Name</span>
                    <input type="text" autoComplete="off"
                        disabled={isUserProfileEditable}
                        className={
                            _main.state.appControls.isUserProfileEditable 
                            ? "editable" : " non-editable"
                        }
                        value={_main.state.userEdit.userNewName}
                        placeholder="Enter Your Name Here ..." required 
                        onChange={onNameEdit}
                        onFocus={onNameEdit}
                    />
                </label>
                
                <button className="submit-btn"
                    style={{display: display}}
                    type="submit"
                    disabled={isUserEditNameFormSubmitted}
                >
                    &emsp;
                    {isUserEditNameFormSubmitted 
                        ? <div className="loader in-btn"></div> 
                        : "Save"
                    }
                    &emsp;
                </button>
            </form>
            
            <form className="form" onSubmit={onPasswordEditFormSubmit}>
                <label>
                    <span>Password</span>
                    <input type={passInputType} autoComplete="off"
                        disabled={isUserProfileEditable}
                        className={
                            _main.state.appControls.isUserProfileEditable 
                            ? "editable" : " non-editable"
                        }
                        value={_main.state.userEdit.userNewPassword}
                        placeholder="Enter Password Here ..." required 
                        onChange={onPasswordEdit}
                        onFocus={onPasswordEdit}
                        />
                </label>
                
                <button className="submit-btn"
                    style={{display: display}}
                    type="submit"
                    disabled={isUserEditPasswordFormSubmitted}
                >
                    &emsp;
                    {isUserEditPasswordFormSubmitted 
                        ? <div className="loader in-btn"></div> 
                        : "Save"
                    }
                    &emsp;
                </button>
            </form>
            
            <form className="form">
                <label>
                    <span>Email</span>
                    <input type="email" autoComplete="off"
                        className="non-editable"
                        disabled={true}
                        value={_main.state.user.email}
                        placeholder="e.g. youremail@xyz.com" required 
                    />
                </label>
                <label>
                    <span>Device ID</span>
                    <input type="text" autoComplete="off"
                        className="non-editable"
                        disabled={true}
                        value={_main.state.user.device_puid}
                        placeholder="Enter Device ID Here ..." required 
                    />
                </label>
            </form>
            <br />
            <hr />
            <br />
            <form className="form" onSubmit={onDeleteUser}>
                <button 
                    type="submit"
                    style={{background: 'crimson'}}
                    disabled={isUserDeleteFormSubmitted}
                >
                    &emsp;
                    {isUserDeleteFormSubmitted 
                        ? <div className="loader in-btn"></div> 
                        : "DELETE ACCOUNT"
                    }
                    &emsp;
                </button>
            </form>
        </div>
    </div>
    )
}

export default UserProfile;
