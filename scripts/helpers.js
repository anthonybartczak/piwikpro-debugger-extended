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

function getCurrentTagArray(tagList) {
    var tagArray = [];

    tagList.querySelectorAll("tr").forEach((tag, index) => {
        var tagTitle = tag.querySelector("td span").getAttribute("title");
        if (tagTitle == "") {
            tagTitle = tag.querySelector("span").innerText;
        }

        var tagFired = tag.querySelector("td div span").innerText;

        tagObject = {
            index: index,
            title: tagTitle,
            timesFired: tagFired == "Not fired" ? 0 : parseInt(tagFired.split("")[0]),
        };
        tagArray.push(tagObject);
    });
    return tagArray;
}


function getCurrentVariableArray(variableList) {
    var variableArray = [];

    variableList.querySelectorAll("tr").forEach((variable, index) => {
      var variableTitle = variable.querySelector("td.size-30.ng-binding").getAttribute("title");
      if (variableTitle == "") {
        variableTitle = variable.querySelector("td.size-30.ng-binding").innerText;
      }

      variableObject = {
        index: index,
        title: variableTitle,
      };
      variableArray.push(variableObject);
    });
    return variableArray;
  }