const HOSTNAME = 'http://128.199.111.126';

const ENDPOINTS = {
    newUser: HOSTNAME + '/user/new',
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