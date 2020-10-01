
export function ValidateEmail(mail) {
    /* eslint-disable */
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    return (false)
}

export function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
};