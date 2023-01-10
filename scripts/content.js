window.addEventListener("load", checkIfIframeLoaded(), false);

function checkIfIframeLoaded() {
  const ppDebugger = document.querySelector(
    "#seventag_container_debugger iframe"
  );

  ppDebugger.addEventListener("load", extensionFunction(), false);
}

function extensionFunction() {
  const ppDebuggerDocument = document.querySelector(
    "#seventag_container_debugger iframe"
  ).contentDocument;

  if (ppDebuggerDocument) {
    const tagContainer = ppDebuggerDocument.querySelector(
      "#overview-container"
    );
    const tagList = ppDebuggerDocument.querySelector(
      "#overview-container table tbody"
    );

    //const tags = ppDebuggerDocument.querySelectorAll("td[id^=tag-name]");

    var originalTagOrder = [];

    ppDebuggerDocument
      .querySelectorAll("td[id^=tag-name]")
      .forEach((tag, index) => {
        var tagTitle = tag.querySelector("span").getAttribute("title");
        if (tagTitle == "") {
          tagTitle = tag.querySelector("span").innerText;
        }

        tagObject = { index: index, title: tagTitle };
        originalTagOrder.push(tagObject);
      });

    console.log(originalTagOrder);
  }
}
