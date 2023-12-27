const sortSvg = `<div class="sort-button-container"><button id="ppdbe-sort-button"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrows-sort" width="16" height="16" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"> <path stroke="none" d="M0 0h24v24H0z" fill="none"/> <path d="M3 9l4 -4l4 4m-4 -4v14" /> <path d="M21 15l-4 4l-4 -4m4 4v-14" /> </svg></button></div>`;
const searchElement = `<div class="search-input-container"><input type="text" id="ppdbe-search-input" name="member" value=""></div>`;

if (!localStorage.getItem("ppDebuggerExtended")) {
  var ppDebuggerExtended = {
    resized: false,
    resize_width: 0,
  }
  window.localStorage.setItem("ppDebuggerExtended", JSON.stringify(ppDebuggerExtended));
}

const addCSS = (css) =>
  (document.head.appendChild(document.createElement("style")).innerHTML = css);

var observerConfig = {
  childList: true,
  subtree: true,
};

const debuggerIframe = document.querySelector(
  "#seventag_container_debugger iframe"
)?.contentDocument;

var debuggerContainerObserver = new MutationObserver(function (mutations, mutationInstance) {

  if (debuggerIframe?.querySelector("#overview-container section table")) {
    if (!debuggerIframe.querySelector("#ppdbe-sort-button")) {
      addExtensionElements(debuggerIframe);
    }
  }

  if (debuggerIframe?.querySelector('li[ng-class="{active: $state.includes(\'events-log.details.variables\')}"]')) {
    if (!debuggerIframe.querySelector("#ppdbe-search-input")) {
      updateVariableElements(debuggerIframe);
    }
  }

});

debuggerContainerObserver.observe(document, observerConfig);

function addExtensionElements(ppDebuggerDocument) {

  if (ppDebuggerDocument) {
    const tagFiredHeader = ppDebuggerDocument.querySelector(
      "#overview-container section table thead tr th.size-35"
    );
    const tagNameHeader = ppDebuggerDocument.querySelector(
      "#overview-container section table thead tr th.size-55"
    );
    const tagContainer = ppDebuggerDocument.querySelector(
      "#overview-container"
    );
    const tagList = ppDebuggerDocument.querySelector(
      "#overview-container section table tbody"
    );

    // Add the sorting HTML element and connect the sorting function
    tagFiredHeader?.insertAdjacentHTML("beforeend", sortSvg);
    // addCSS(".sort-button-container { margin-left: 4px}");
    // addCSS(".size-35 { display: flex; !important}");
    const sortButton = ppDebuggerDocument.querySelector("#ppdbe-sort-button");
    sortButton?.addEventListener("click", function () {
      sortTags(tagList, ppDebuggerDocument);
    });

    // Add the search HTML element and connect the filter function
    tagNameHeader?.insertAdjacentHTML("beforeend", searchElement);
    const searchInput = ppDebuggerDocument.querySelector("#ppdbe-search-input");

    const sendDebouncedInput = debounce((text) => {
      const tagArray = getCurrentTagArray(tagList);
      const items = [...tagList.children];
      tagArray.forEach((tag, index) => {
        if (tag.title.toLowerCase().includes(text.toLowerCase())) {
          items[index].style.display = "table-row";
        } else {
          items[index].style.display = "none";
        }
      });
    });

    searchInput?.addEventListener("input", (event) => {
      sendDebouncedInput(event.target.value);
    });
  }

  if (readLocalStorageEntry().resized === false) {
    ppResizeDebug(700);
  } else {
    if (readLocalStorageEntry().resize_width < 400) {
      ppResizeDebug(400);
    } else {
      ppResizeDebug(readLocalStorageEntry().resize_width);
    }
  }

  if (!document.querySelector("#biggerPreviewLink")) {
    var dbg = document.querySelector("#seventag_container_debugger");
    if (!dbg) return;
    dbg.style.maxWidth = "100%";
    var plnk = document.createElement('a');
    plnk.setAttribute('style', 'font-family:arial;font-size:13px;color:#fff;text-decoration:none;position:absolute;right:70px;top:17px');
    plnk.setAttribute('id', 'biggerPreviewLink');
    plnk.setAttribute('href', '#');
    plnk.innerHTML = "&#5130;";
    plnk.addEventListener('click', function (e) {
      ppDebugAdd(200);
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
    dbg.appendChild(plnk);

    plnk = document.createElement('a');
    plnk.setAttribute('style', 'font-family:arial;font-size:13px;color:#fff;text-decoration:none;position:absolute;right:70px;top:30px');
    plnk.setAttribute('id', 'smallerPreviewLink');
    plnk.setAttribute('href', '#');
    plnk.innerHTML = "&#5125;";
    plnk.addEventListener('click', function (e) {
      ppDebugAdd(-200);
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
    dbg.appendChild(plnk);

    //create observer for panel div if resized from inside iframe to show or hide resize links
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === "attributes") setTimeout(showHideBtns, 1000);
      });
    });
    var config = { attributes: true, childList: false, characterData: false }
    observer.observe(dbg, config);

  }
}

function sortTags(tagList) {
  const currentTags = getCurrentTagArray(tagList);
  sortIndexByTimesFired(currentTags);
  const sortedIndexes = getNewObjectArrayIndexes(currentTags, "index");
  const items = [...tagList.children];

  items.sort(
    (a, b) =>
      sortedIndexes.indexOf(items.indexOf(a)) -
      sortedIndexes.indexOf(items.indexOf(b))
  );
  items.forEach((it) => tagList.appendChild(it));
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

function updateVariableElements(ppDebugger) {

  const variableNameHeader = ppDebugger.querySelector(
    "#event-details > div.ng-scope section table thead tr th.size-30"
  );

  const variableList = ppDebugger.querySelector(
    "#event-details-variables > table > tbody"
  );

  variableNameHeader?.insertAdjacentHTML("beforeend", searchElement);
  const searchInput = ppDebugger.querySelector("#ppdbe-search-input");

  const sendDebouncedInput = debounce((text) => {
    const variableArray = getCurrentVariableArray(variableList);
    const items = [...variableList.children];
    variableArray.forEach((variable, index) => {
      if (variable.title.toLowerCase().includes(text.toLowerCase())) {
        items[index].style.display = "table-row";
      } else {
        items[index].style.display = "none";
      }
    });
  });

  searchInput?.addEventListener("input", (event) => {
    sendDebouncedInput(event.target.value);
  });

  var liElement = ppDebugger.querySelector('li[ng-class="{active: $state.includes(\'events-log.details.variables\')}"]');
  if (liElement && liElement.classList.contains('active')) {
    var section = ppDebugger.getElementById('event-details-variables');
    if (section) {
      var tds = section.querySelectorAll('td[title]');
      tds.forEach(function (td) {
        if (td.getAttribute('title').trim() !== '') {
          td.innerText = td.getAttribute('title');
        }
      });
    }
  } else {
    // Perform any cleanup if the liElement is not found or not active
  }
}

function ppResizeDebug(w) {
  modifyLocalStorageEntry('resized', true);
  modifyLocalStorageEntry('resize_width', w);

  var pnl = document.querySelector("#seventag_container_debugger");
  if (pnl) pnl.style.width = w.toString() + "px";
  showHideBtns();
}

//hide buttons if panel is minimized or too small
function showHideBtns() {
  var bgr = document.querySelector("#biggerPreviewLink");
  var sml = document.querySelector("#smallerPreviewLink");
  var pnl = document.querySelector("#seventag_container_debugger");
  var w = pnl.clientWidth || parseInt(pnl.style.width) || 0;
  if (bgr && sml) {
    bgr.style.display = w > 300 ? "inline-block" : "none";
    sml.style.display = bgr.style.display;
  }
}

//resize on link click
function ppDebugAdd(x) {
  var d = document.querySelector("#seventag_container_debugger");
  var w = d.clientWidth || parseInt(d.style.width) || 0;
  if (d && (w > 0)) ppResizeDebug(w + x);
  return false;
}