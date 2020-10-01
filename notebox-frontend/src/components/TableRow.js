import React, { Component } from 'react';
import styled from 'styled-components';
import requestHelper from './helpers/RequestHelper'

const TableModifyButton = styled.button`
    margin-left: 4px;
    margin-right: 4px;
`

const CollapsableDiv = styled.div`
    overflow-y: hidden;
    max-height: ${props => props.height};
    border: 0px;
`

const CollapsableDivTitle = styled.div`
    overflow-y: hidden;
    max-height: ${props => props.height};
    border: 0px;
    min-width: 100px;
`

const DateTableData = styled.td`
    width: 107px
`

const DEFAULT_MAX_HEIGHT = '82px';

/**
 * Table row component
 * 
 * This component represents a table row in the notes table
 */
class TableRow extends Component {

    state = {
        show: true,
        expanded: false,
    }

    showHtmlTitle(body) {
        let height = DEFAULT_MAX_HEIGHT;
        if (this.state.expanded) {
            height = '100%'
        }

        return (
            <td>
                <CollapsableDivTitle height={height} dangerouslySetInnerHTML={{ __html: body }} />
            </td>
        )
    }

    showHtmlContent(body) {
        let height = DEFAULT_MAX_HEIGHT;
        if (this.state.expanded) {
            height = '100%'
        }

        return (
            <td>
                <CollapsableDiv height={height} dangerouslySetInnerHTML={{ __html: body }} />
            </td>
        )
    }

    render() {
        return (
            <tr onClick={() => this.toggleHeight()} style={{ display: this.state.show ? "" : "none" }}>
                <td> {this.props.idx} </td>
                {this.showHtmlTitle(this.props.title)}
                {this.showHtmlContent(this.props.content)}
                <DateTableData> {this.props.last_updated} </DateTableData>
                <DateTableData> {this.props.created} </DateTableData>
                <td style={{ display: this.props.noButtons ? "none" : "", width: "187px" }}>
                    <div>
                        <TableModifyButton id={this.props.identity} className="btn btn-warning" onClick={e => this.handleModify()}>Modify</TableModifyButton>
                        <TableModifyButton id={this.props.identity} className="btn btn-danger" onClick={e => this.handleDelete(e.target, this.hideRow)}>Delete</TableModifyButton>
                    </div>
                </td>
            </tr>
        );
    }

    hideRow = () => this.setState({ show: false })

    toggleHeight() {
        if (this.state.expanded) {
            this.setState({ expanded: false })
        } else {
            this.setState({ expanded: true })
        }
    }

    handleModify() {
        this.props.showEditNoteModal(this.props.id, this.props.title, this.props.content)
    }

    handleDelete = (target, hideRow) => {
        console.log("Deleting note.")
        requestHelper.deleteNoteRequest(target.id, hideRow)
    }
}

export default TableRow;