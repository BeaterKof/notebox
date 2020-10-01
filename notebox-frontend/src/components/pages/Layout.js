import React, { Component } from 'react';
import { Container } from 'react-bootstrap'
import styled from 'styled-components'

const UniversalContentSpacing = styled.div`
    height: 50px;
`

export const UniversalTitle = styled.h1`
    text-align: center;
`

/**
 * Layout page component
 */
class Layout extends Component {
    state = {
        showAlert: false,
        alertText: null,
    }

    handleAlert = (text) => {
        this.setState({ showAlert: true, alertText: text });
    }

    render() {
        return (
            <Container >
                <UniversalContentSpacing />
                {this.props.children}
            </Container >
        );
    }
}


export default Layout;