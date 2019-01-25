import axios from 'axios';

import {ENDPOINTS} from '../globals';

const updateItemName = (email, password, slot_number, item_new_name, callback) => {
    const queryString = 
        '?email=' + encodeURIComponent(email) + 
        '&password=' + encodeURIComponent(password) +
        '&slot_number=' + encodeURIComponent(slot_number) + 
        '&item_new_name=' + encodeURIComponent(item_new_name);
    
    axios.post(ENDPOINTS.editItemName + queryString)
    .then((response) => {
        console.log(response)
        callback(response.data);
    }).catch((error) => {
        console.log(error)
        callback(error);
    });
}

export default updateItemName;