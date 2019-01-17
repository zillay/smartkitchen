import React, { Component } from 'react';
import './ItemCard.css';

import {Link} from 'react-router-dom';

const ItemCard = (props) => {

    return (
    <div className="ItemCard">
        <div className={"item-card-ctr" + (props.isLow ? " is-low" : "")}>
            <span className="name">
                {props.itemName}
            </span>

            <span className="current-percentage">
                {props.currentPercentage} {props.isLow ? <b style={{color: 'crimson'}}> (Low)</b> : null}
            </span>

            <span className="slot-number">
                Slot: <b>{props.slotNumber}</b>
            </span>

            <span className="updated-duration">
                {props.updatedDuration} ago
            </span>
            <span className="weights left">
                Now: <i>{props.currentPercentage}</i> <br /><b>{props.currentWeight}g</b>
            </span>

            <span className="weights center">
                Full: <i>100%</i> <br /><b>{props.maxWeight}g</b>
            </span>

            <span className="weights right">
                Low: <i>{props.minPercentage + '%'} </i> <br /><b>{props.minWeight}g</b>
            </span>

            <Link className="edit-btn" 
                to={"/dashboard/item/edit/" + props.slotNumber}
            >
                EDIT
            </Link>
        </div>
    </div>
    )
}

export default ItemCard;
