import React, { Component } from 'react';
import './Main.css';
import { Route, Link, Switch, Redirect } from 'react-router-dom';

// components
import Dashboard from '../Dashboard/Dashboard';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import StatusNotification from '../StatusNotification/StatusNotification';
import UserProfile from '../UserProfile/UserProfile';
import About from '../About/About';

// services
import getUserData from '../../services/getUserData';
import { makeMinPercentage } from '../../utils';

let INITIAL_STATE = {
    appControls: {
        isSideMenuShown: false,
        isLoginFormSubmitted: false,
        isSignupFormSubmitted: false,
        isStatusNotificationShown: false,
        isItemEditFormSubmitted: false,
        isItemEditMaxFormSubmitted: false,
        isUserEditNameFormActive: false,
        isUserEditNameFormSubmitted: false,
        isUserEditPasswordFormActive: false,
        isUserEditPasswordFormSubmitted: false,
        isUserProfileEditable: false,
    },
    user: {
        name: null,
        email: null,
        password: null,
        device_puid: null,
        isLoggedIn: false,
    },
    items: null,
    statusNotificationMsg: null,
    statusNotificationType: null,
    itemEdit: {
        itemSlotNumber: null,
        itemNewName: null,
        itemNewMinPercentage: null,
    },
    userEdit: {
        userNewName: null,
        userNewPassword: null,
    }
};

// TODOs
// reset max service

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = JSON.parse(JSON.stringify(INITIAL_STATE));
        
        if (this.isUserInfoAvailable()) {
            const prevState = JSON.parse(localStorage.getItem('state'));
            this.state.user = prevState.user;
            this.state.items = prevState.items;
            getUserData(
                this.state.user.email, 
                this.state.user.password,
                this.updateUserData
            );
        }
    }

    isUserInfoAvailable = () => {
        let state = localStorage.getItem('state');
        if (state === null) {
            return false;
        }
        return true;
    }

    writeStateToLocalStorage = () => {
        if (this.state.user.isLoggedIn) {
            localStorage.setItem('state', JSON.stringify(this.state));
        }
    }

    showLoaderForLoginForm = () => {
        let newState = this.state;
        newState.appControls.isLoginFormSubmitted = true;
        this.setState(newState);
    }
    hideLoaderForLoginForm = () => {
        let newState = this.state;
        newState.appControls.isLoginFormSubmitted = false;
        this.setState(newState);
    }
    
    showLoaderForSignupForm = () => {
        let newState = this.state;
        newState.appControls.isSignupFormSubmitted = true;
        this.setState(newState);
    }
    hideLoaderForSignupForm = () => {
        let newState = this.state;
        newState.appControls.isSignupFormSubmitted = false;
        this.setState(newState);
    }
    
    showLoaderForItemEditForm = () => {
        let newState = this.state;
        newState.appControls.isItemEditFormSubmitted = true;
        this.setState(newState);
    }
    hideLoaderForItemEditForm = () => {
        let newState = this.state;
        newState.appControls.isItemEditFormSubmitted = false;
        this.setState(newState);
    }
    
    showLoaderForItemEditMaxForm = () => {
        let newState = this.state;
        newState.appControls.isItemEditMaxFormSubmitted = true;
        this.setState(newState);
    }
    hideLoaderForItemEditMaxForm = () => {
        let newState = this.state;
        newState.appControls.isItemEditMaxFormSubmitted = false;
        this.setState(newState);
    }
    
    showLoaderForUserEditNameForm = () => {
        let newState = this.state;
        newState.appControls.isUserEditNameFormSubmitted = true;
        this.setState(newState);
    }
    hideLoaderForUserEditNameForm = () => {
        let newState = this.state;
        newState.appControls.isUserEditNameFormSubmitted = false;
        this.setState(newState);
    }
    
    showLoaderForUserEditPasswordForm = () => {
        let newState = this.state;
        newState.appControls.isUserEditPasswordFormSubmitted = true;
        this.setState(newState);
    }
    hideLoaderForUserEditPasswordForm = () => {
        let newState = this.state;
        newState.appControls.isUserEditPasswordFormSubmitted = false;
        this.setState(newState);
    }

    updateItemNewNameInState = (itemNewName) => {
        let newState = this.state;
        newState.itemEdit.itemNewName = itemNewName;
        this.setState(newState);
    }
    updateItemNewMinPercentageInState = (itemNewMinPercentage) => {
        let newState = this.state;
        newState.itemEdit.itemNewMinPercentage = itemNewMinPercentage;
        this.setState(newState);
    }
    updateitemSlotNumberInState = (itemSlotNumber) => {
        let newState = this.state;
        newState.itemEdit.itemSlotNumber = itemSlotNumber;
        this.setState(newState);
    }
    clearItemEditInState = () => {
        let newState = this.state;
        if (newState.itemEdit.itemSlotNumber !== null) {
            newState.itemEdit.itemSlotNumber = null;
            newState.itemEdit.itemNewMinPercentage = null;
            newState.itemEdit.itemNewName = null;
            this.setState(newState);
        }
    }

    hideStatusNotification = () => {
        let newState = this.state;
        newState.appControls.isStatusNotificationShown = false;
        this.setState(newState, () => {
            setTimeout(() => {
                let newState = this.state;
                newState.appControls.isStatusNotificationShown = false;
                newState.statusNotificationMsg = null;
                newState.statusNotificationType = null;
                this.setState(newState)
            }, 100);
        })
    }

    showStatusNotification = (msg, statusType) => {
        let newState = this.state;

        newState.appControls.isStatusNotificationShown = true;
        newState.statusNotificationMsg = msg;
        newState.statusNotificationType = statusType;

        this.setState(newState)
    }

    toggleSideMenu = (evt) => {
        let newState = this.state;
        
        newState.appControls.isSideMenuShown = 
        !this.state.appControls.isSideMenuShown;
        
        this.setState(newState);
    }

    updateUserData = (data, _password=null) => {
        console.log('updateUserData');
        console.log(data);

        if (data instanceof Error) {
            console.log('ERRORED');
            this.showStatusNotification(data.toString(), 'error');
            this.hideLoaderForLoginForm();
            return;
        }

        if (!data.status.is_ok) {
            this.showStatusNotification(
                data.status.code + ': ' + data.status.msg,
                'error'
            );
            this.hideLoaderForLoginForm();
            return;
        }

        let newState = this.state;
        newState.user.name = data.data.name;
        newState.user.email = data.data.email;
        newState.user.password = _password;
        newState.user.device_puid = data.data.device_puid;
        newState.items = data.data.items;
        newState.user.isLoggedIn = true;
        if (newState.itemEdit.itemSlotNumber !== null) {
            newState.itemEdit.itemNewName = 
                newState.items[newState.itemEdit.itemSlotNumber].name;
            newState.itemEdit.itemNewMinPercentage = 
                makeMinPercentage(this, newState.itemEdit.itemSlotNumber);
        }
        this.setState(newState, () => {
            if (this.state.statusNotificationType === 'error') {
                // this.hideStatusNotification();
            }
            this.hideLoaderForLoginForm();
        });
        
    }

    handleSignup = (data) => {
        console.log('handleSignup');
        console.log(data);

        if (data instanceof Error) {
            console.log('ERRORED');
            this.showStatusNotification(data.toString(), 'error');
            this.hideLoaderForSignupForm();
            return;
        }

        if (!data.status.is_ok) {
            this.showStatusNotification(
                data.status.code + ': ' + data.status.msg,
                'error'
            );
            this.hideLoaderForSignupForm();
            return;
        }

        this.showStatusNotification(data.status.msg, 'success');
        this.hideLoaderForSignupForm();
    }

    handleItemNameUpdate = (data) => {
        console.log('handleItemNameUpdate');
        console.log(data);

        if (data instanceof Error) {
            console.log('ERRORED');
            this.showStatusNotification(data.toString(), 'error');
            this.hideLoaderForItemEditForm();
            return;
        }

        if (!data.status.is_ok) {
            this.showStatusNotification(
                data.status.code + ': ' + data.status.msg,
                'error'
            );
            this.hideLoaderForItemEditForm();
            return;
        }

        this.showStatusNotification('Saved', 'success');
        getUserData(
            this.state.user.email, this.state.user.password, 
            this.updateUserData
        );
        this.hideLoaderForItemEditForm();
    }

    handleItemMinPercentageUpdate = (data) => {
        console.log('handleItemMinPercentageUpdate');
        console.log(data);

        if (data instanceof Error) {
            console.log('ERRORED');
            this.showStatusNotification(data.toString(), 'error');
            this.hideLoaderForItemEditForm();
            return;
        }

        if (!data.status.is_ok) {
            this.showStatusNotification(
                data.status.code + ': ' + data.status.msg,
                'error'
            );
            this.hideLoaderForItemEditForm();
            return;
        }

        this.showStatusNotification('Saved', 'success');
        getUserData(
            this.state.user.email, this.state.user.password, 
            this.updateUserData
        );
        this.hideLoaderForItemEditForm();
    }
    
    handleItemMaxUpdate = (data) => {
        console.log('handleItemMaxUpdate');
        console.log(data);

        if (data instanceof Error) {
            console.log('ERRORED');
            this.showStatusNotification(data.toString(), 'error');
            this.hideLoaderForItemEditMaxForm();
            return;
        }

        if (!data.status.is_ok) {
            this.showStatusNotification(
                data.status.code + ': ' + data.status.msg,
                'error'
            );
            this.hideLoaderForItemEditMaxForm();
            return;
        }

        this.showStatusNotification('Saved', 'success');
        getUserData(
            this.state.user.email, this.state.user.password, 
            this.updateUserData
        );
        this.hideLoaderForItemEditMaxForm();
    }

    handleUserNameUpdate = (data) => {
        console.log('handleUserNameUpdate');
        console.log(data);

        if (data instanceof Error) {
            console.log('ERRORED');
            this.showStatusNotification(data.toString(), 'error');
            this.hideLoaderForUserEditNameForm();
            return;
        }

        if (!data.status.is_ok) {
            this.showStatusNotification(
                data.status.code + ': ' + data.status.msg,
                'error'
            );
            this.hideLoaderForUserEditNameForm();
            return;
        }

        this.showStatusNotification('Saved', 'success');
        getUserData(
            this.state.user.email, this.state.user.password, 
            this.updateUserData
        );
        this.hideLoaderForUserEditNameForm();
    }
    
    handleUserPasswordUpdate = (data) => {
        console.log('handleUserPasswordUpdate');
        console.log(data);

        if (data instanceof Error) {
            console.log('ERRORED');
            this.showStatusNotification(data.toString(), 'error');
            this.hideLoaderForUserEditPasswordForm();
            return;
        }

        if (!data.status.is_ok) {
            this.showStatusNotification(
                data.status.code + ': ' + data.status.msg,
                'error'
            );
            this.hideLoaderForUserEditPasswordForm();
            return;
        }

        let newState = this.state;
        newState.user.password = this.state.userEdit.userNewPassword;
        this.setState(newState, () => {
            this.showStatusNotification('Saved', 'success');
            getUserData(
                this.state.user.email, this.state.user.password, 
                this.updateUserData
            );
            this.hideLoaderForUserEditPasswordForm();
        });
    }

    logoutUser = (e) => {
        e.preventDefault();
        localStorage.clear();
        this.setState(INITIAL_STATE);
    }

    componentDidUpdate() {
        console.log('Main_CompDidUpdate');
        this.writeStateToLocalStorage();
    }

    render() {
        return (
            <div className="Main">
                <Route exact path="/" 
                    render={() => (this.state.user.isLoggedIn 
                        ? <Redirect to="/dashboard" />
                        : <Redirect to="/login" />
                    )} 
                />
                <Route exact path="/login" 
                    render={() => (!this.state.user.isLoggedIn 
                        ? <Login _main={this} />
                        : <Redirect to="/" />
                    )} 
                />
                <Route exact path="/logout" 
                    render={() => {
                        return <Redirect to="/" />;
                    }} 
                />
                <Route exact path="/signup" 
                    render={() => (!this.state.user.isLoggedIn 
                        ? <Signup _main={this} />
                        : <Redirect to="/" />
                    )} 
                />
                <Route path="/dashboard" 
                    render={() => (this.state.user.isLoggedIn 
                        ? <Dashboard _main={this} />
                        : <Redirect to="/" />
                    )} 
                />
                <Route exact path="/myprofile" 
                    render={() => (this.state.user.isLoggedIn 
                        ? <UserProfile _main={this} />
                        : <Redirect to="/" />
                    )} 
                />
                <Route exact path="/about" 
                    render={() => (this.state.user.isLoggedIn 
                        ? <About _main={this} />
                        : <Redirect to="/" />
                    )} 
                />
                <StatusNotification _main={this} />
            </div>
        );
    }
}

export default Main;
