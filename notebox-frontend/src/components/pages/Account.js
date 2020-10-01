import React, { Component } from "react";
import ResetPasswordForm from "../ResetPasswordForm";
import { Button } from "react-bootstrap";
import RequestHelper from "../helpers/RequestHelper";
import Auth from "../../Auth";

/**
 * Account page component
 */
class Account extends Component {
    showAlert = (variant, header, text) => {
        this.props.showAlert(variant, header, text);
    };

    render() {
        return (
            <React.Fragment>
                <ResetPasswordForm showAlert={this.showAlert} />
                <br />
                <Button className="btn btn-danger" onClick={this.removeAccount}>
                    Delete account
                </Button>
            </React.Fragment>
        );
    }

    removeAccount = () => {
        RequestHelper.deleteAccountRequest().then((response) => {
            if (response.status === 200) {
                Auth.logout(() => window.location.reload());
            }
        });
    };
}

export default Account;
