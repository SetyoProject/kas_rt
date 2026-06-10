const users = [
    {
        id: 1,
        username: 'admin',
        password: '123',
        role: 'admin'
    },
    {
        id: 2,
        username: 'bendahara',
        password: '123',
        role: 'bendahara'
    }
];

const getNextUserId = () => {
    return users.length > 0
        ? Math.max(...users.map(u => u.id)) + 1
        : 1;
};

module.exports = {
    users,
    getNextUserId
};