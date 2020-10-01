import React, { Component } from 'react';
import { Form, FormControl, InputGroup } from 'react-bootstrap';
import styled from 'styled-components';

const SearchBarStyles = styled.div`
    float: left;
    color: red;
    height: 44px;
    display: block;
`

/**
 * Search bar component
 * 
 * This component represents the search bar used to filter the notes in the note table
 */
class SearchBar extends Component {
    state = {
        searchString: ''
    }

    render() {
        return (
            <Form onSubmit={(e)=> e.preventDefault()} inline className="float-right">
                <SearchBarStyles>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">search</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                            onKeyDownCapture={this.handleEnterChange}
                            onTouchEnd={this.handleChange}
                            placeholder="insert search string"
                            aria-label="string"
                            aria-describedby="basic-addon1"
                        />
                    </InputGroup>
                </SearchBarStyles>
            </Form>
        );
    }

    handleEnterChange = (event) => {
        if(event.key === 'Enter') {
            this.handleChange(event);
        }
    }

    handleChange = (event) => {
        this.setState({ searchString: event.target.value });
        this.props.setSearchString(event.target.value);
    }

}

export default SearchBar;