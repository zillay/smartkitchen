import axios from 'axios';

import {ENDPOINTS} from '../globals'

const updateUserName = (email, password, user_new_name, callback) => {
    const queryString = 
        '?email=' + encodeURIComponent(email) + 
        '&password=' + encodeURIComponent(password) +
        '&user_new_name=' + encodeURIComponent(user_new_name);
    
    axios.post(ENDPOINTS.editUserName + queryString)
    .then((response) => {
        console.log(response)
        callback(response.data);
    }).catch((error) => {
        console.log(error)
        callback(error);
    });
}

export default updateUserName;