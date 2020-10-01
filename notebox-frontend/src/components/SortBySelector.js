import React, { Component } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Order, OrderCriteria } from './helpers/RequestHelper'

const SelectorOrder = {
    NEWEST: "newest",
    OLDEST: "oldest",
    ALPHABETICAL: "alphabetical",
    RE_ALPHABETICAL: "re_alphabetical",
}

/**
 * SortBy selector component
 * 
 * This component represents a drop-down selector used to filter the notes in the notes table  
 */
class SortBySelector extends Component {

    render() {
        return (
            <Form inline className="float-left">
                <InputGroup>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon1">order by</InputGroup.Text>
                    </InputGroup.Prepend>
                    <select onChange={this.handleChange} className="form-control" name="city" >
                        <option defaultValue={SelectorOrder.NEWEST}>Age (newest to oldes) </option>
                        <option value={SelectorOrder.OLDEST}>Age (oldest to newest)</option>
                        <option value={SelectorOrder.ALPHABETICAL}>Title alphabetically</option>
                        <option value={SelectorOrder.RE_ALPHABETICAL}>Title reverse alphabetically</option>
                    </select>
                </InputGroup>
            </Form>
        );
    }

    handleChange = (event) => {
        let orderCriteria = OrderCriteria.DATE;
        let order = Order.DESC;

        const value = event.target.value;

        if(value === SelectorOrder.OLDEST) {
            order = Order.ASC;
        } else if(value === SelectorOrder.ALPHABETICAL) {
            orderCriteria = OrderCriteria.TITLE;
            order = Order.ASC;
        } else if(value === SelectorOrder.RE_ALPHABETICAL) {
            orderCriteria = OrderCriteria.TITLE;
        }

        this.props.setOrder(order, orderCriteria);
    }

}

export default SortBySelector;