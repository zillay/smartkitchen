import axios from 'axios';

import {ENDPOINTS} from '../globals'

const updateItemMinPercentage = (email, password, slot_number, min_weight_percent, callback) => {
    const queryString = 
        '?email=' + encodeURIComponent(email) + 
        '&password=' + encodeURIComponent(password) +
        '&slot_number=' + encodeURIComponent(slot_number) + 
        '&min_weight_percent=' + encodeURIComponent(min_weight_percent);
    console.log(queryString);
    
    axios.post(ENDPOINTS.editItemMinWeight + queryString)
    .then((response) => {
        console.log(response)
        callback(response.data);
    }).catch((error) => {
        console.log(error)
        callback(error);
    });
}

export default updateItemMinPercentage;