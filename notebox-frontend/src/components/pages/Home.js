import React, { Component } from 'react';
import NotesTable from '../NotesTable'
import styled from 'styled-components';
import NoteModal from '../NoteModal';
import ModalType from '../NoteModal'

const CreateNoteButton = styled.button`
    margin-right: 8px;
`

/**
 * Home page component
 */
class Home extends Component {

    state = {
        showModal: false,
        modalType: '',  // new or edit
        modalHeader: '',
        modalTitle: '',
        modalContent: '',
        modalNoteId: null,
    }

    closeModal = () => {
        this.setState({ showModal: false });
    }

    showAlert = (variant, title, text) => {
        this.props.showAlert(variant, title, text);
    }

    render() {
        return (
            <React.Fragment>
                <CreateNoteButton className="float-left btn btn-primary" onClick={this.showNewNoteModal}>
                    New note
                </CreateNoteButton>

                <NoteModal show={this.state.showModal}
                    onHide={this.closeModal}
                    title={this.state.modalHeader}
                    noteTitle={this.state.modalTitle}
                    noteContent={this.state.modalContent}
                    noteId={this.state.modalNoteId} />

                <NotesTable tableData={this.state.tableData} loadTableData={this.loadTableData} showEditNoteModal={this.showEditNoteModal} />
            </React.Fragment>
        );
    }

    showNewNoteModal = () => {
        this.setState({
            showModal: true,
            modalType: ModalType.NEW_NOTE,
            modalHeader: "New note",
            modalTitle: '',
            modalContent: '',
            modalNoteId: null
        })
    }

    showEditNoteModal = (id, title, content) => {
        this.setState({
            showModal: true,
            modalType: ModalType.EDIT_NOTE,
            modalHeader: "Edit note",
            modalTitle: title,
            modalContent: content,
            modalNoteId: id
        })
    }

}

export default Home;