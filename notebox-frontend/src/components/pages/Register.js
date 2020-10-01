import React, { Component } from 'react'
import { UniversalTitle } from './Layout'
import { Form, Button } from 'react-bootstrap'
import { BACKEND_URL } from '../helpers/RequestHelper'
import { AlertVariant } from '../AppAlert'
import Axios from 'axios'
import { ValidateEmail } from '../helpers/OtherHelpers'

/**
 * Register page component
 */
class Register extends Component {

    render() {
        return (
            <React.Fragment>
                <UniversalTitle>Create new account</UniversalTitle>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="registerFormEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control name='email' type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group controlId="registerFormPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control name="password" type="password" placeholder="Password" />
                    </Form.Group>
                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
            </React.Fragment>
        );
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const email = data.get('email');
        const password = data.get('password');
        const headers = { 'IF_MATCH': 'false' }

        var bodyFormData = new FormData();
        bodyFormData.append('email', email);
        bodyFormData.append('password', password);

        if(!data) {
            this.props.showAlert(AlertVariant.DANGER, 'Something went wrong', '');
        } else if(!email) {
            this.props.showAlert(AlertVariant.DANGER, 'Invalid email address', 'Please insert valid email address');
        } else if(!password) {
            this.props.showAlert(AlertVariant.DANGER, 'Invalid password', 'Please insert valid password');
        } else if (!ValidateEmail(email)) {
            this.props.showAlert(AlertVariant.DANGER, 'Invalid email address', 'Please insert valid email address');
        } else {
            await Axios.post(BACKEND_URL + "/register", bodyFormData, { headers: headers },)
                .then(response => {
                    if(response.status === 200) {
                        this.props.closeAlert();
                        this.props.showAlert(AlertVariant.SUCCESS, "Account created successfully for email address: ", email);
                        this.props.history.push("/login");
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.props.showAlert(AlertVariant.DANGER, error.response.data.error.message, error.response.data.error.details);
                });
        }
    }
}

export default Register;