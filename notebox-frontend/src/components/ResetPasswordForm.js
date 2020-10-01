import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap'
import styled from 'styled-components'
import Axios from 'axios';
import { BACKEND_URL } from './helpers/RequestHelper';
import { AlertVariant } from './AppAlert';

const Title = styled.h1`
    text-align: center;
`

/**
 * Reset password form component
 */
class ResetPasswordForm extends Component {

    handleSubmit = async (event) => {
        event.preventDefault();

        const data = new FormData(event.target);
        const oldPassword = data.get('old-password');
        const newPassword = data.get('new-password');
        const headers = { 'IF_MATCH': 'false' }

        if (data && oldPassword && newPassword) {
            const response = await Axios.post(BACKEND_URL + "/register", data, { headers: headers },)
                .then(response => response.json());
        } else {
            this.props.showAlert(AlertVariant.DANGER, 'Bad email or password', 'The email address and password are not valid');
        }
    }

    render() {
        return (
            <React.Fragment>
                <Title>Reset password</Title>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="old-password">
                        <Form.Label>Old password</Form.Label>
                        <Form.Control type="password" placeholder="Old password" />
                    </Form.Group>

                    <Form.Group controlId="new-password">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" placeholder="New password" />
                    </Form.Group>

                    <Button variant="primary" type="submit">Submit</Button>
                </Form>
            </React.Fragment>
        );
    }

}

export default ResetPasswordForm;