
function getElementPath(element) {
    return "//" + $(element).parents().andSelf().map(function () {
        var $this = $(this);
        var tagName = this.nodeName;
        if ($this.siblings(tagName).length > 0) {
            tagName += "[" + $this.prevAll(tagName).length + "]";
        }
        return tagName;
    }).get().join("/").toLowerCase();
}

$(document).ready(function () {
    $("*").click(function (event) {
        event.stopPropagation();
        post(getElementPath(this));
    });
    $("*").hover(function(){
        $(this).css("border", "1px solid red");
        }, function(){
        $(this).css("border", "none");
      });
});

async function post(element) {
    const tripwire = {
        // "session": sessionStorage.getItem("sessionid"),
        "elementPath": element,
        "path": window.location.pathname
    }
  
    const response = await fetch("/createTripWire", {
      method: "POST",
      body: JSON.stringify(tripwire),
      headers: {
        "Content-Type": "application/json"
      }
    })
  
    if (!response.ok) {
      throw Error(`Request failed with status ${response.status}`)
    }
    console.log("Request successful!")
}