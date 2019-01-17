import React, { Component } from 'react';
import './EditItem.css';
import {Link} from 'react-router-dom';

import updateItemName from '../../services/updateItemName';
import updateItemMinPercentage from '../../services/updateItemMinPercentage';
import updateItemMaxWeight from '../../services/updateItemMaxWeight';
import { makeMinPercentage } from '../../utils';

const EditItem = (props) => {
    const _main = props._main;
    const match = props.match;
    const isItemEditFormSubmitted = 
        _main.state.appControls.isItemEditFormSubmitted;
    const isItemEditMaxFormSubmitted = 
        _main.state.appControls.isItemEditMaxFormSubmitted;
    const minPercentage = makeMinPercentage(_main, match.params.slotNumber);

    if (_main.state.itemEdit.itemSlotNumber 
            !== match.params.slotNumber) {
        let newState = _main.state;

        newState.itemEdit.itemSlotNumber = 
            match.params.slotNumber;
        
        newState.itemEdit.itemNewName = 
            _main.state.items[match.params.slotNumber].name;
        
        newState.itemEdit.itemNewMinPercentage = 
            parseInt(minPercentage, 10);
        
        _main.setState(newState);
    }

    console.log(props.match.params.slotNumber)
    console.log(_main)
    
    const onEditItemNameChange = (e) => {
        let newState = _main.state;
        newState.itemEdit.itemNewName = e.target.value;
        _main.setState(newState);
    };
    
    const onEditMinPercentageChange = (e) => {
        const newVal = parseInt(e.target.value, 10);
        if (newVal > -1 && newVal < 100) {
            let newState = _main.state;
            newState.itemEdit.itemNewMinPercentage = newVal;
            _main.setState(newState);
        }
    };
   
    const onItemEditFormSubmit = (e) => {
        e.preventDefault();
        _main.showLoaderForItemEditForm();
        if (!isItemEditFormSubmitted) {
            updateItemName(
                _main.state.user.email, 
                _main.state.user.password, 
                _main.state.itemEdit.itemSlotNumber, 
                _main.state.itemEdit.itemNewName,
                _main.handleItemNameUpdate
            );
            updateItemMinPercentage(
                _main.state.user.email, 
                _main.state.user.password, 
                _main.state.itemEdit.itemSlotNumber, 
                _main.state.itemEdit.itemNewMinPercentage,
                _main.handleItemNameUpdate
            );
        }
    };
    
    const onItemEditMaxFormSubmit = (e) => {
        e.preventDefault();
        _main.showLoaderForItemEditMaxForm();
        if (!isItemEditMaxFormSubmitted) {
            updateItemMaxWeight(
                _main.state.user.email, 
                _main.state.user.password, 
                _main.state.itemEdit.itemSlotNumber, 
                _main.handleItemMaxUpdate
            );
        }
    };

    return (
        <div className="EditItem">
            <Link className="overlay shown" to="/dashboard"
                onClick={_main.clearItemEditInState}
            ></Link>
            <div className="edit-item-ctr">
                <form className="form" onSubmit={onItemEditFormSubmit}>
                    <h3>
                        Edit Item - Slot {_main.state.itemEdit.itemSlotNumber}
                    </h3>
                    <label>
                        <span>Item Name</span>
                        <input type="text" autoComplete="off" required 
                            value={_main.state.itemEdit.itemNewName} 
                            onChange={onEditItemNameChange}
                            onFocus={onEditItemNameChange}
                        />
                    </label>
                    <label>
                        <span>Low Limit (0 - 99%)</span>
                        <input type="number" autoComplete="off" required 
                            value={_main.state.itemEdit.itemNewMinPercentage} 
                            onChange={onEditMinPercentageChange}
                            onFocus={onEditMinPercentageChange}
                        />
                    </label>
                    <br />
                    <button 
                        type="submit"
                        disabled={isItemEditFormSubmitted}
                    >
                        &emsp;
                        {isItemEditFormSubmitted 
                            ? <div className="loader in-btn"></div> 
                            : "Save"
                        }
                        &emsp;
                    </button>
                </form>
                <br />
                <form className="form" onSubmit={onItemEditMaxFormSubmit}>
                    <button 
                        className="secondary"
                        type="submit"
                        disabled={isItemEditMaxFormSubmitted}
                    >
                        &emsp;
                        {isItemEditMaxFormSubmitted 
                            ? <div className="loader in-btn"></div> 
                            : "SET AS FULL"
                        }
                        &emsp;
                    </button>
                </form>
                <Link className="close" to="/dashboard" 
                    onClick={_main.clearItemEditInState}
                >
                    CLOSE
                </Link>
            </div>
        </div>
    )
}

export default EditItem;
