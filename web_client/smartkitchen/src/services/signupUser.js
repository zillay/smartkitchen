import axios from 'axios';

import {ENDPOINTS} from '../globals'

const signupUser = (name, email, password, device_puid, callback) => {
    const queryString = 
        '?name=' + encodeURIComponent(name) + 
        '&email=' + encodeURIComponent(email) + 
        '&password=' + encodeURIComponent(password) +
        '&device_puid=' + encodeURIComponent(device_puid);
    
    axios.post(ENDPOINTS.newUser + queryString)
    .then((response) => {
        console.log(response)
        callback(response.data);
    }).catch((error) => {
        console.log(error)
        callback(error);
    });
}

export default signupUser;