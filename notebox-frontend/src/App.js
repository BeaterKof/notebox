import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import { BrowserRouter as Router, Route, Switch, BrowserRouter } from 'react-router-dom';
import Login from './components/pages/Login'
import Home from './components/pages/Home'
import Account from './components/pages/Account'
import Layout from './components/pages/Layout'
import NavigationBar from './components/NavigationBar'
import { ProtectedRoute } from './components/ProtectedRoute'
import AppAlert, { AlertVariant } from './components/AppAlert';
import Register from './components/pages/Register';

/**
 * Application component
 * 
 * This represents the main component of the application.
 * It contains all the routing and alerts configuration.
 */
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            items: [],
            isLoaded: false,
            showAlert: false,
            alertVariant: AlertVariant.WARNING,
            alertHeader: 'Something went wrong',
            alertText: 'Something went wrong',
        }
    }

    showAlert = (variant, header, text) => {
        this.setState({ showAlert: true, alertHeader: header, alertText: text, alertVariant: variant });
    }

    closeAlert = () => {
        this.setState({ showAlert: false, alertHeader: 'undefined', alertText: 'undefined', alertVariant: AlertVariant.WARNING });
    }

    loginContainer = () => (
        <Layout>
            <AppAlert show={this.state.showAlert} alertHeader={this.state.alertHeader}
                alertText={this.state.alertText} alertVariant={this.state.alertVariant} closeAlert={this.closeAlert} />
            <Route exact path="/login" render={(props) => (
                <Login {...props} showAlert={this.showAlert} closeAlert={this.closeAlert} />
            )}/>
        </Layout>
    )

    registerContainer = () => (
        <Layout>
            <AppAlert show={this.state.showAlert} alertHeader={this.state.alertHeader}
                alertText={this.state.alertText} alertVariant={this.state.alertVariant} closeAlert={this.closeAlert} />
            <Route exact path="/register" render={(props) => (
                <Register {...props} showAlert={this.showAlert} closeAlert={this.closeAlert}/>
            )}/>
        </Layout>
    )

    defaultContainer = () => (
        <React.Fragment>
            <NavigationBar />
            <Layout>
                <AppAlert show={this.state.showAlert} alertHeader={this.state.alertHeader}
                    alertText={this.state.alertText} alertVariant={this.state.alertVariant} closeAlert={this.closeAlert} />
                <ProtectedRoute exact path="/" component={Home} showAlert={this.showAlert} />
                <ProtectedRoute exact path="/account" component={Account} showAlert={this.showAlert} />
            </Layout>
        </React.Fragment>
    )

    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <Router>
                        <Switch>
                            <Route exact path="/login" component={this.loginContainer} />
                            <Route exact path="/register" component={this.registerContainer} />
                            <Route component={this.defaultContainer} />
                            <Route path="*" component={() => "404 Not found"} />
                        </Switch>
                    </Router>
                </BrowserRouter>
            </React.Fragment>
        );
    }
}

export default App;