const sortSvg =
  '<button id="ppdbe-sort-button"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrows-sort" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <path d="M3 9l4 -4l4 4m-4 -4v14" /> <path d="M21 15l-4 4l-4 -4m4 4v-14" /> </svg></button>';

var observer = new MutationObserver(function (mutations, mutationInstance) {
  const ppDebugger = document.querySelector(
    "#seventag_container_debugger iframe"
  )?.contentDocument;

  if (ppDebugger?.querySelector("#overview-container section table")) {
    extensionFunction(ppDebugger);
    mutationInstance.disconnect();
  }
});

observer.observe(document, {
  childList: true,
  subtree: true,
});

function extensionFunction(ppDebuggerDocument) {
  if (ppDebuggerDocument) {
    const tagHeader = ppDebuggerDocument.querySelector(
      "#overview-container section table thead tr th.size-35"
    );

    tagHeader.insertAdjacentHTML("beforeend", sortSvg);
    const sortButton = ppDebuggerDocument.querySelector("#ppdbe-sort-button");

    sortButton.addEventListener("click", function () {
      sortTags(tagList, ppDebuggerDocument);
    });

    const tagContainer = ppDebuggerDocument.querySelector(
      "#overview-container"
    );
    const tagList = ppDebuggerDocument.querySelector(
      "#overview-container section table tbody"
    );
  }
}

function sortTags(tagList, ppDebuggerDocument) {
  const currentTags = checkCurrentTagOrder(tagList);
  sortIndexByTimesFired(currentTags);
  const sortedIndexes = getNewObjectArrayIndexes(currentTags, "index");
  var newTagsContainer = ppDebuggerDocument.createDocumentFragment();

  sortedIndexes.forEach(function (idx) {
    newTagsContainer.appendChild(tagList.children[idx].cloneNode(true));
  });

  tagList.innerHTML = null;
  tagList.appendChild(newTagsContainer);
}

function sortIndexByTimesFired(objectArray) {
  objectArray.sort((a, b) => b.timesFired - a.timesFired);
}

function getNewObjectArrayIndexes(objectArray, field) {
  const sortedIndexes = [];
  objectArray.forEach((object) => {
    sortedIndexes.push(object[field]);
  });
  return sortedIndexes;
}

function checkCurrentTagOrder(tagList) {
  var tagOrder = [];

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
    tagOrder.push(tagObject);
  });
  return tagOrder;
}
