import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

export const AlertVariant = {
    SUCCESS: 'success',
    DANGER: 'danger',
    WARNING: 'warning',
    INFO: 'info',
}

/**
 * Application Alert component
 * This component is used throughout the whole application to expose any kind of alerts
 */
class AppAlert extends Component {
    render() { 
        return (
            <Alert show={this.props.show} onClose={() => this.props.closeAlert()} variant={this.props.alertVariant} dismissible>
                <Alert.Heading>{this.props.alertHeader}</Alert.Heading>
                <p>
                    {this.props.alertText}
                </p>
            </Alert>
        );
    }
}
 
export default AppAlert;