import React, { Component } from 'react';

/**
 * NoMatch page component
 * This page is used for any URLs are not matching the ones that this application supports 
 */
class NoMatch extends Component {
    render() { 
        return ( <h1>No matching page</h1> );
    }
}
 
export default NoMatch;