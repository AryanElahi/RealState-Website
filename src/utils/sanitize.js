// Removes the password hash before a user record leaves the server.
const omitPassword = (user) => {
    if (!user) return user;
    const { password, ...rest } = user;
    return rest;
};

module.exports = { omitPassword };
