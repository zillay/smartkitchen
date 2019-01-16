DEVICE_PUIDS = [
    '523218ef-9e9c-4283-bbdf-d51a7783f7a3',
    '523218ef-9e9c-4283-bbdf-d51a7783f7a4',
    '523218ef-9e9c-4283-bbdf-d51a7783f7a5',
]

ERROR = {
    'general_error': {
        'is_ok': False,
        'code': 'E001',
        'msg': 'Something went wrong.'
    },
    'missing_args': {
        'is_ok': False,
        'code': 'E002',
        'msg': 'Missing arguments.'
    },
    'too_many_args': {
        'is_ok': False,
        'code': 'E003',
        'msg': 'Too many arguments.'
    },
    'empty_args': {
        'is_ok': False,
        'code': 'E004',
        'msg': 'Empty arguments.'
    },
    'bad_args': {
        'is_ok': False,
        'code': 'E005',
        'msg': 'Bad data passed in arguments.'
    },
    'user_exists': {
        'is_ok': False,
        'code': 'E006',
        'msg': 'User already exists.'
    },
    'user_not_verified': {
        'is_ok': False,
        'code': 'E007',
        'msg': 'User is not verified.'
    },
    'invalid_email': {
        'is_ok': False,
        'code': 'E008',
        'msg': 'Invalid email.'
    },
    'invalid_device_puid': {
        'is_ok': False,
        'code': 'E009',
        'msg': 'Invalid physical uid of device.'
    },
    'device_taken': {
        'is_ok': False,
        'code': 'E010',
        'msg': 'Device is already registered to another user.'
    },
    'blocked_email': {
        'is_ok': False,
        'code': 'E011',
        'msg': 'Email has been blocked by owner.'
    },
    'database_error': {
        'is_ok': False,
        'code': 'E012',
        'msg': 'Database error.'
    },
    'mailing_error': {
        'is_ok': False,
        'code': 'E013',
        'msg': 'Mailing error. Couldn\'t send email.'
    },
    'invalid_email_password': {
        'is_ok': False,
        'code': 'E014',
        'msg': 'Invalid email or password.'
    },
    'item_does_not_exist': {
        'is_ok': False,
        'code': 'E015',
        'msg': 'Item does not exist.'
    },
    'current_weight_does_not_exist': {
        'is_ok': False,
        'code': 'E016',
        'msg': ('Item does not have any current weight i.e. it is null.' +
                ' Max Weight can not be set without current weight.')
    },
    'max_weight_does_not_exist': {
        'is_ok': False,
        'code': 'E017',
        'msg': ('Item does not have any max weight i.e. it is null.' +
                ' Min Weight can not be set without max weight.')
    },
}

SUCCESS = {
    'task_completed': {
        'is_ok': True,
        'code': 'S001',
        'msg': 'Task Completed.'
    },
    'info_provided': {
        'is_ok': True,
        'code': 'S002',
        'msg': 'User and items info has been provided.'
    },
    'verification_email_sent': {
        'is_ok': True,
        'code': 'S003',
        'msg': 'Verification email sent. Verify the email from inbox.'
    },
    'user_deleted': {
        'is_ok': True,
        'code': 'S004',
        'msg': 'User has been deleted.'
    },
    'user_name_updated': {
        'is_ok': True,
        'code': 'S005',
        'msg': 'User\s name has been updated.'
    },
    'user_password_updated': {
        'is_ok': True,
        'code': 'S006',
        'msg': 'User\s password has been updated.'
    },
    'current_weight_updated': {
        'is_ok': True,
        'code': 'S007',
        'msg': 'Items current weights have been updated.'
    },
    'item_name_updated': {
        'is_ok': True,
        'code': 'S008',
        'msg': 'Item name has been updated.'
    },
    'max_weight_updated': {
        'is_ok': True,
        'code': 'S009',
        'msg': 'Item\'s max weight name has been updated.'
    },
    'min_weight_updated': {
        'is_ok': True,
        'code': 'S010',
        'msg': 'Item\'s min weight name has been updated.'
    },
}
