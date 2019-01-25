import axios from 'axios';

import {ENDPOINTS} from '../globals';

const updateItemMaxPercentage = (email, password, slot_number, callback) => {
    const queryString = 
        '?email=' + encodeURIComponent(email) + 
        '&password=' + encodeURIComponent(password) +
        '&slot_number=' + encodeURIComponent(slot_number);
    
    axios.post(ENDPOINTS.editItemMaxWeight + queryString)
    .then((response) => {
        console.log(response)
        callback(response.data);
    }).catch((error) => {
        console.log(error)
        callback(error);
    });
}

export default updateItemMaxPercentage;