import React, { Component } from 'react';
import './StatusNotification.css';

import {Link} from 'react-router-dom';

const StatusNotification = (props) => {
    const _main = props._main;
    const shown = 
        _main.state.appControls.isStatusNotificationShown 
        ? "shown " : "";
    const msg = _main.state.statusNotificationMsg;
    const statusType = _main.state.statusNotificationType;
    const hideStatusNotification = _main.hideStatusNotification;

    return (
        <div className={"StatusNotification " + shown + statusType}>
            <span className="msg">
                {msg}
            </span>
            <button 
                className="cross-icon" 
                onClick={hideStatusNotification}
            >
                <span className="cross-bar"></span>
                <span className="cross-bar"></span>
            </button>
        </div>
    )
}

export default StatusNotification;
