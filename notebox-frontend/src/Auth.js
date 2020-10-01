/**
 * Class used to represent the authentication status of a user
 */
class Auth {
    constructor() {
        this.authenticated = false;
        this.tokenTimeout = null;
    }

    login(email, token, cb) {
        this.authenticated = true;
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('token', token);
        cb()
    }

    logout(cb) {
        this.authenticated = false;
        sessionStorage.removeItem('email');
        sessionStorage.removeItem('token');
        cb()
    }

    getToken() {
        return sessionStorage.getItem('token');
    }

    isAuthenticated() {
        const email = sessionStorage.getItem('email');
        const token = sessionStorage.getItem('token');
        return email && token;
    }
}

export default new Auth();