const HOSTNAME = 'http://localhost:5000';

const ENDPOINTS = {
    newUser: HOSTNAME + '/user/new',
    deleteUser: HOSTNAME + '/user/delete',
    userInfo: HOSTNAME + '/user/info',
    editUserName: HOSTNAME + '/user/edit/name',
    editUserPassword: HOSTNAME + '/user/edit/password',
    editItemName: HOSTNAME + '/item/edit/name',
    editItemMaxWeight: HOSTNAME + '/item/edit/maxweight',
    editItemMinWeight: HOSTNAME + '/item/edit/minweight',
};

export {
    ENDPOINTS,
    HOSTNAME
};