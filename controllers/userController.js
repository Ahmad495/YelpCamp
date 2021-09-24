const User = require('../models/user');


module.exports.createUserForm = (req, res) => {
    res.render('users/register')
}

module.exports.createNewUser = async (req, res, next) => {
    const { email, username, password } = req.body.user;
    const user = new User({ email, username });
    try {
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'User Registered');
            res.redirect('/campgrounds');
        })
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/register');
    }
}

module.exports.loginUserForm = (req, res) => {
    res.render('users/login');
}


module.exports.loginUser = (req, res) => {
    req.flash('success', 'You Have Logged In!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', 'You have been logout');
    res.redirect('/campgrounds');
}