import React, { Component } from 'react';
import { Table, Form, Button } from 'react-bootstrap'
import styled from 'styled-components'
import { DEFAULT_LIMIT, Order, DEFAULT_OFFSET, OrderCriteria } from './helpers/RequestHelper';
import RequestHelper from './helpers/RequestHelper'
import TableRow from './TableRow';
import { Sleep } from './helpers/OtherHelpers';
import SortBySelector from './SortBySelector';
import SearchBar from './SearchBar';

const TableStyles = styled.div`
    .table-row {
        height: 50px;
        overflow-y: auto;
    }
`

/**
 * Notes tables component
 * This component represents the table that will display a users notes
 */
class NotesTable extends Component {
    
    state = {
        tableData: [],
        orderCriteria: OrderCriteria.DATE,
        order: Order.DESC,
        searchString: '',
        limit: DEFAULT_LIMIT,
        offset: DEFAULT_OFFSET,
        hasNextPage: false,
        hasPreviousPage: false,
    }

    render() {

        return (
            <React.Fragment>
                <Form.Group>
                    <SortBySelector setOrder={this.setOrder} />
                    <SearchBar setSearchString={this.setSearchString} />
                </Form.Group>
                <TableStyles>
                    <Table className="notes-table" striped bordered hover variant="dark">
                        <thead>
                            <TableRow id="#" title="Title" content="Content" last_updated="Edited" created="Created" noButtons={true} />
                        </thead>
                        <tbody>
                            {this.renderTableData()}
                        </tbody>
                    </Table>
                    <div className="float-right">
                        <Button disabled={!this.state.hasPreviousPage} onClick={this.handlePreviousPage}>Previous page</Button>
                        <span className="badge badge-light">{this.state.offset + 1}</span>
                        <Button disabled={!this.state.hasNextPage} onClick={this.handleNextPage}>Next page</Button>
                    </div>
                </TableStyles>
            </React.Fragment>
        );
    }

    setNavButtonsState(response) {
        if (this.state.tableData.length === 0) {
            this.setState({ hasPreviousPage: false, hasNextPage: false })
        } else {
            //check if there is a next page
            if (response.hasNextPage) {
                this.setState({ hasNextPage: true })
            } else {
                this.setState({ hasNextPage: false })
            }

            if (this.state.offset === 0) {
                this.setState({ hasPreviousPage: false })
            } else {
                this.setState({ hasPreviousPage: true })
            }
        }
    }

    handlePreviousPage = () => {
        if (this.state.offset > 0) {
            let newOffset = this.state.offset - 1;
            this.setState({ offset: newOffset }, function () {
                this.updateNotes()
            });
        }
    }

    handleNextPage = () => {
        if (this.state.hasNextPage) {
            let newOffset = this.state.offset + 1;
            this.setState({ offset: newOffset }, function () {
                this.updateNotes()
            });
        }
    }

    componentDidMount() {
        this.updateNotes();
    };

    updateNotes() {
        //erase current tableData
        this.setState({ tableData: [] })

        RequestHelper.getNotesRequest(this.state.order, this.state.orderCriteria, this.state.limit, this.state.offset, this.state.searchString)
            .then((response) => {
                if (response.data.length === 0) {
                    this.setState({ tableData: ["none"] })
                } else {
                    this.setState({ tableData: response.data })
                    this.setNavButtonsState(response);
                }
            });

        // if request has no data, retry for 10 times over 5 seconds
        let countDown = 10;
        while (this.state.tableData.length === 0 && countDown > 0) {
            Sleep(500);
            countDown--;
        }
    }

    setOrder = (newOrder, newOrderCriteria) => {
        this.setState({ order: newOrder, orderCriteria: newOrderCriteria }, function () {
            this.updateNotes();
        });
    }

    setSearchString = (str) => {
        this.setState({ searchString: str }, function () {
            this.updateNotes();
        });
    }

    showEditNoteModal = (id, title, content) => {
        this.props.showEditNoteModal(id, title, content);
    }

    renderTableData() {
        let data = this.state.tableData;
        let formattedData = [];

        if (data.length !== 0) {
            if (data[0] === 'none') {
                formattedData.push(<tr key={Math.random()}><td colSpan="5" align="center"><h2>No notes found!</h2></td></tr>);
            } else {
                formattedData = data.map((note, idx) => {
                    return <TableRow key={note.id} identity={note.id} idx={idx + (this.state.limit * this.state.offset) + 1} {...note} showEditNoteModal={this.showEditNoteModal} />
                });
            }
        } else {
            formattedData.push(<tr key={Math.random()}><td colSpan="5" align="center"><h2>Fetching data...</h2></td></tr>);
        }

        return formattedData;
    }
}

export default NotesTable;
