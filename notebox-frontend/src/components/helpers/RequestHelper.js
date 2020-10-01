import Axios from "axios";
import { currentTimestamp } from './DateTimeHelper'
import Auth from "../../Auth";

export const BACKEND_URL = 'http://127.0.0.1:5000';
export const BACKEND_AUTH_PATH = '/auth';
export const BACKEND_NOTES_PATH = '/notes';
export const BACKEND_ACCOUNT_PATH = '/account';

export const Order = {
    ASC: "ASC",
    DESC: "DESC",
};

export const OrderCriteria = {
    TITLE: "title",
    DATE: "last_updated",
}

export const DEFAULT_LIMIT = 6;
export const DEFAULT_OFFSET = 0;

class RequestHelper {

    isAuthenticated(response) {
        if (!response || response.status === 401) {
            Auth.logout(() => { location.reload() })
        }
    }

    async saveNoteRequest(formData, noteId) {

        let response;

        const headers = Object.assign({}, this.getAuthHeader(), this.getContentTypeJsonHeader());

        //url
        let URL = BACKEND_URL + BACKEND_NOTES_PATH;

        const title = formData.get('title');
        const content = formData.get('content');

        if (!title) {
            alert("A note must have a title!")
            return;
        }

        //config
        const config = { headers }

        // if the modal has a NoteId, it updates a note
        // else it creates a new one
        if (noteId) {
            console.log("update note")

            URL += ("/" + noteId)

            const data = {
                'title': title,
                'content': content,
                'last_updated': currentTimestamp(),
            }

            response = await Axios.patch(URL, data, config)
                .catch((error) => {
                    console.log(error);
                    this.isAuthenticated(error.response);
                })
        } else {
            console.log("save new note")

            //data
            const data = {
                'title': title,
                'content': content,
                'created': currentTimestamp(),
            }

            response = await Axios.put(URL, data, config)
                .catch((error) => {
                    console.log(error);
                    this.isAuthenticated(error.response);
                })
        }

        return response;
    }

    deleteAccountRequest() {

        const headers = Object.assign({}, this.getAuthHeader(), this.getContentTypeJsonHeader());

        //url
        const URL = BACKEND_URL + BACKEND_ACCOUNT_PATH;

        //config
        const config = { headers }

        //data
        const data = {}

        let response = Axios.delete(URL, config, data)
            .then((response) => {
                // if respose is 200 -> show = false on target
                if (response.status === 200) {
                    console.log("Account deleted!")
                }
                return response;
            }, (error) => {
                console.log(error);
                this.isAuthenticated(error.response);
            })

        return response;
    }
 
    deleteNoteRequest(id, hideRow) {

        let response;

        const headers = Object.assign({}, this.getAuthHeader(), this.getContentTypeJsonHeader());

        //url
        const URL = BACKEND_URL + BACKEND_NOTES_PATH + "/" + id;

        //config
        const config = { headers }

        //data
        const data = {}

        response = Axios.delete(URL, config, data)
            .then((response) => {
                // if respose is 200 -> show = false on target
                if (response.status === 200) {
                    hideRow()
                }
            }, (error) => {
                console.log(error);
                this.isAuthenticated(error.response);
            })
    }

    async getNotesRequest(order, orderCriteria, limit, offset, searchString) {

        let responseData;

        const headers = Object.assign({}, this.getAuthHeader(), this.getContentTypeJsonHeader());

        let noteOrder;
        if (!order) {
            noteOrder = Order.ASC;
        } else {
            noteOrder = order;
        }

        let noteOrderCriteria;
        if (!order) {
            noteOrderCriteria = OrderCriteria.DATE;
        } else {
            noteOrderCriteria = orderCriteria;
        }

        let pageLimit;
        if (!limit) {
            pageLimit = DEFAULT_LIMIT;
        } else {
            pageLimit = limit;
        }

        let pageOffset;
        if (!offset) {
            pageOffset = DEFAULT_OFFSET;
        } else {
            pageOffset = offset;
        }

        //url
        const URL = BACKEND_URL + BACKEND_NOTES_PATH
            + "?orderCriteria=" + noteOrderCriteria
            + "&order=" + noteOrder
            + "&limit=" + pageLimit
            + "&offset=" + pageOffset
            + "&str=" + searchString;

        //config
        const config = { headers }

        //data
        const data = {}

        responseData = await Axios.get(URL, config, data)
            .then(response => response.data)
            .catch(error => {
                    console.log(error);
                    this.isAuthenticated(error.response);
                })

        return responseData;
    }

    getAuthHeader() {
        let email = sessionStorage.getItem('email');
        let token = sessionStorage.getItem('token');

        if (email && token) {
            return { 'Authorization': 'JWT ' + token };
        } else {
            return {};
        }
    }

    getContentTypeJsonHeader() {
        return { 'Content-Type': 'application/json' };
    }

}

export default new RequestHelper();