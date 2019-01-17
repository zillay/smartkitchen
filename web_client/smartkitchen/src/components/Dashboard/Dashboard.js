import React, { Component } from 'react';
import './Dashboard.css';
import {Route} from 'react-router-dom';

import Navbar from '../Navbar/Navbar';
import ItemCard from '../ItemCard/ItemCard';
import EditItem from '../EditItem/EditItem';

import getUserData from '../../services/getUserData';

import {timeDelta} from '../../utils';

const Dashboard = (props) => {
    const _main = props._main;
    const isLoginFormSubmitted = _main.state.appControls.isLoginFormSubmitted;
    const onRefreshBtnClick = (e) => {
        e.preventDefault();
        _main.showLoaderForLoginForm();
        if (!isLoginFormSubmitted) {
            getUserData(
                _main.state.user.email, 
                _main.state.user.password, 
                _main.updateUserData
            );
        }
    };

    let ItemCards = [];
    if (_main.state.items !== null) {
        for (const key in _main.state.items) {
            if (!_main.state.items.hasOwnProperty(key)) {
                continue;
            }

            const item = _main.state.items[key];
            const current_weight = item.current_weight;
            const max_weight = item.max_weight;
            let currentPercentage = 'N/A';

            if (current_weight !== null && max_weight !== null &&
                    max_weight !== 0) {
                currentPercentage = 
                    parseInt(
                        ((item.current_weight / item.max_weight) * 100), 10
                    ).toString() + '%';
            }
            
            const last_updated = new Date(item.last_updated);
            const last_updated_utc = new Date(last_updated.getTime() + 
                (last_updated.getTimezoneOffset() * 60000));
            const nowTime = new Date();
            const nowUtc = new Date(nowTime.getTime() + 
                (nowTime.getTimezoneOffset() * 60000));
            const timeDiffObject = timeDelta(last_updated_utc, nowUtc);
            // console.log('last_updated: ' + last_updated)
            // console.log('last_updated_utc: ' + last_updated_utc)
            // console.log('nowTime: ' + nowTime)
            // console.log('nowUtc: ' + nowUtc)
            // console.log(timeDiffObject)
            let updatedDurationString = '';

            if (timeDiffObject.s >= 0) {
                if (timeDiffObject.s > 5) {
                    updatedDurationString = 
                        (timeDiffObject.s - (timeDiffObject.s % 5))
                        .toString() + ' seconds';
                } else {
                    updatedDurationString = '5 seconds';
                }
            }
            if (timeDiffObject.m !== 0) {
                updatedDurationString = 
                    (timeDiffObject.m).toString() + 
                    (timeDiffObject.m > 1 
                        ? ' minutes'
                        : ' minute');
            }
            if (timeDiffObject.h !== 0) {
                updatedDurationString = 
                    (timeDiffObject.h).toString() + 
                    (timeDiffObject.h > 1 
                        ? ' hours'
                        : ' hour');
            }
            if (timeDiffObject.d !== 0) {
                updatedDurationString = 
                    (timeDiffObject.d).toString() + 
                    (timeDiffObject.d > 1 
                        ? ' days'
                        : ' day');
            }
            if (timeDiffObject.w !== 0) {
                updatedDurationString = 
                    (timeDiffObject.w).toString() + 
                    (timeDiffObject.w > 1 
                        ? ' weeks'
                        : ' week');
            }

            const minPercentage = 
                item.min_weight !== null 
                && item.min_weight !== 0
                && item.max_weight !== null 
                && item.max_weight !== 0
                ? parseFloat((item.min_weight 
                    / item.max_weight) * 100).toFixed(1)
                : 0;

            ItemCards.push(
                <ItemCard 
                    key={key}
                    slotNumber={key}
                    itemName={item.name}
                    currentPercentage={currentPercentage}
                    minPercentage={minPercentage}
                    currentWeight={parseFloat(item.current_weight).toFixed(1)}
                    maxWeight={parseFloat(item.max_weight).toFixed(1)}
                    minWeight={parseFloat(item.min_weight).toFixed(1)}
                    updatedDuration={updatedDurationString}
                    isLow={item.current_weight < item.min_weight ? true: false}
                    _main={_main}
                />
            )
        }
    }

    return (
        <div className="Dashboard">
            <Navbar _main={_main} />
            <p className="welcome-text">
                Welcome, <b>{_main.state.user.name}</b> :-)
            </p>
            
            {ItemCards}

            <Route 
                path="/dashboard/item/edit/:slotNumber"
                render={({match}) => {
                    return (
                        <EditItem 
                            match={match}
                            _main={_main}
                        />
                    );
                }}
            />

            <br />
            <hr style={{
                width: 'calc(100% - 62px)', 
                margin: 'auto', 
                border: 'none', 
                borderTop: '2px dotted #aaa'
            }} />
            <br />
            
            <button className="refresh-btn"
                disabled={isLoginFormSubmitted}
                onClick={onRefreshBtnClick}
            >
                {isLoginFormSubmitted 
                    ? <div className="loader in-btn"></div> 
                    : "Refresh"
                }
            </button>
        </div>
    );
}

export default Dashboard;
