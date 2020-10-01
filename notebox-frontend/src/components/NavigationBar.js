import React, { Component } from 'react';
import { Nav, Navbar } from 'react-bootstrap'
import styled from 'styled-components'
import auth from '../Auth'
import { withRouter } from 'react-router-dom';

const Styles = styled.div`
    .navbar {
        background-color: #222;
        
    }

    .navbar-brand, .navbar-nav .nav-link {
        color: #bbb;

        &:hover {
            color: white;
        }
    }
`;

/**
 * Navigation bar component
 */
class NavigationBar extends Component {

    render() {
        return (
            <Styles>
                <Navbar expand="lg">
                    <Navbar.Brand href="/">Notebox</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Item><Nav.Link href="/">Home</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link href="/account">Account</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link onClick={e=>this.handleLogout(e)}>Logout</Nav.Link></Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Styles>
        );
    }

    handleLogout = (e) => {
        auth.logout(() => {
            this.props.history.push("/login")
        })
    }

}

export default withRouter(NavigationBar);