import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import auth from '../Auth'

/**
 * Protected route component
 * 
 * This component represents a wrapper over the Route class.
 * It enables page navigation authentication
 * Any unauthenticated user will be redirected to the login page
 */
export const ProtectedRoute = ({ component: Component, ...rest }) => {
    return (
        <Route {...rest} render={
            props => {
                if (auth.isAuthenticated()) {
                    return <Component {...props} showAlert={(a,b,c) => rest.showAlert(a,b,c)} />
                } 
                else {
                    return <Redirect to={
                        {
                            pathname: "/login",
                            state: {
                                from: props.location
                            }
                        }
                    } />
                }
            }
        } />
    )
}