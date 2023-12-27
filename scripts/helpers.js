function modifyLocalStorageEntry(property, value) {
    let ppDebuggerExtended = localStorage.getItem('ppDebuggerExtended');

    if (ppDebuggerExtended) {
        ppDebuggerExtended = JSON.parse(ppDebuggerExtended);
        ppDebuggerExtended[property] = value;

        localStorage.setItem('ppDebuggerExtended', JSON.stringify(ppDebuggerExtended));
    } else {
        console.log('ppDebuggerExtended does not exist in localStorage.');
    }
}

function readLocalStorageEntry() {
    const ppDebuggerExtended = localStorage.getItem('ppDebuggerExtended');

    if (ppDebuggerExtended) {
        return JSON.parse(ppDebuggerExtended);
    } else {
        console.log('ppDebuggerExtended does not exist in localStorage.');
        return null;
    }
}

function debounce(callBack, delay = 500) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            callBack(...args);
        }, delay);
    };
}