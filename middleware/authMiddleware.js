function isLogin(req, res, next) {

    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    next();
}

module.exports = { isLogin };