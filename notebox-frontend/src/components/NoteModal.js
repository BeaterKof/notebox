import React, { Component } from 'react';
import { Form, Modal, Button } from 'react-bootstrap';
import requestHelper from './helpers/RequestHelper'

export const ModalType = {
    NEW_NOTE: "new",
    EDIT_NOTE: "edit",
}

/**
 * Note modal component
 * This modal is used when notes are created or modified
 */
class NoteModal extends Component {
    state = {}

    render() {
        return (
            <React.Fragment>
                <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={this.props.show}>
                    <Modal.Header closeButton onClick={this.props.onHide}>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {this.props.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Form.Group>
                        <Form onSubmit={this.handleSaveNote}>
                            <Modal.Body>
                                <Form.Control name="title" as="textarea" rows="1" type="text" placeholder="Title..."
                                    suppressContentEditableWarning="true" contentEditable="true" defaultValue={this.props.noteTitle} />
                                <br />
                                <Form.Control name="content" as="textarea" rows="5" type="text" placeholder="Content..."
                                    suppressContentEditableWarning="true" contentEditable="true" defaultValue={this.props.noteContent} />
                            </Modal.Body>
                            <Modal.Footer>
                                <Button className="btn btn-success" type="submit">Save</Button>
                                <Button onClick={this.props.onHide}>Close</Button>
                            </Modal.Footer>
                        </Form>
                    </Form.Group>
                </Modal>
            </React.Fragment>
        );
    }

    handleSaveNote = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        requestHelper.saveNoteRequest(formData, this.props.noteId)
            .then(response => {
                if(response.status === 200) {
                    window.location.reload();
                }
            });
    }
}

export default NoteModal;