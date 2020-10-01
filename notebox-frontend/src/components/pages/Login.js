import React, { Component } from 'react'
import { UniversalTitle } from './Layout'
import { Form, Button } from 'react-bootstrap'
import { BACKEND_URL, BACKEND_AUTH_PATH } from '../helpers/RequestHelper'
import auth from '../../Auth'
import { AlertVariant } from '../AppAlert'
import { Link } from 'react-router-dom'
import { ValidateEmail } from '../helpers/OtherHelpers'

/**
 * Login page component
 */
class Login extends Component {

    render() {
        return (
            <React.Fragment>
                <UniversalTitle>Login</UniversalTitle>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control name='email' type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" placeholder="Password" />
                    </Form.Group>

                    <Button variant="primary" type="submit">Submit</Button>
                    <br />
                    <Link to="/register">No Account? Register here</Link>
                </Form>
            </React.Fragment>
        );
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const email = data.get('email');
        const password = data.get('password');

        if(!data) {
            this.props.showAlert(AlertVariant.DANGER, 'Something went wrong', '');
        } else if(!email) {
            this.props.showAlert(AlertVariant.DANGER, 'Invalid email address', 'Please insert valid email address');
        } else if(!password) {
            this.props.showAlert(AlertVariant.DANGER, 'Invalid password', 'Please insert valid password');
        } else if (!ValidateEmail(email)) {
            this.props.showAlert(AlertVariant.DANGER, 'Invalid email address', 'Please insert valid email address');
        } else {
            await fetch(BACKEND_URL + BACKEND_AUTH_PATH, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'username': email, 'password': password })
            }).then(response => {
                if(response.status !== 200) {
                    this.props.showAlert(AlertVariant.DANGER, "Something went wrong!" , "");
                }
                return response.json();
            }).then(response => {
                if (response.access_token) {
                    this.props.closeAlert();
                    auth.login(data.get('email'), response.access_token, () => {
                        this.props.history.push("/");
                    })
                } else {
                    this.props.showAlert(AlertVariant.DANGER, response.error.message , response.error.details);
                }
            }).catch(error => {
                this.props.showAlert(AlertVariant.DANGER, "Something went wrong!" , error.message);
            });
        }
    }
}

export default Login;