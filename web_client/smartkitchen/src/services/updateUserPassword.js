import axios from 'axios';

import {ENDPOINTS} from '../globals'

const updateUserPassword = (email, password, new_password, callback) => {
    const queryString = 
        '?email=' + encodeURIComponent(email) + 
        '&password=' + encodeURIComponent(password) +
        '&new_password=' + encodeURIComponent(new_password);
    
    axios.post(ENDPOINTS.editUserPassword + queryString)
    .then((response) => {
        console.log(response)
        callback(response.data);
    }).catch((error) => {
        console.log(error)
        callback(error);
    });
}

export default updateUserPassword;