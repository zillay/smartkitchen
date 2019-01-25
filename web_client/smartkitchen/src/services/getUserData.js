import axios from 'axios';

import {ENDPOINTS} from '../globals';

const getUserData = (email, password, callback) => {
    const queryString = 
        '?email=' + encodeURIComponent(email) + 
        '&password=' + encodeURIComponent(password);
    
    axios.post(ENDPOINTS.userInfo + queryString)
    .then((response) => {
        // console.log(response)
        callback(response.data, password);
    }).catch((error) => {
        // console.log(error)
        callback(error);
    });
}

export default getUserData;