(function ($) {
    $.fn.jGetXpath = function (shortPath = false) {
        function checkId(that) {
            if (undefined !== that.attr('id')) {

            }
            return null;
        }

        function checkClass(that) {
            if (undefined !== that.attr('class')
                && undefined !== that[0]
                && 0 < that[0].classList.length) {
            }
            return null;
        }

        function checkFullPath(that, shortParent = false) {
            let lastParent = that, path = '', byClass, byId;
            while (0 !== lastParent.length) {
                if (shortParent) {
                    byId = checkId(lastParent);
                    if (null !== byId) {
                        path = byId + path;
                        break;
                    }
                    byClass = checkClass(lastParent);
                    if (null !== byClass) {
                        path = byClass + path;
                        break;
                    }
                }
                if (!shortParent || (!byId && !byClass)) {
                    path = checkIndex(lastParent) + path;
                }
                lastParent = lastParent.parent();
            }
            return path.toLowerCase();
        }

        function checkIndex(elem) {
            let tag = elem.prop("tagName");
            if (undefined === tag) {
                return '';
            }
            let neighbours = elem.parent().children(tag),
                path = '/' + tag;
            if (1 < neighbours.length) {
                let index = neighbours.index(elem) + 1;
                path = path + '[' + index + ']';
            }
            return path;
        }

        function isUniqueId(id) {
            return 1 === $('#' + id).length;
        }

        function isUniqueClass(className) {
            return 1 === $('.' + className).length;
        }

        let path = checkId(this);
        if (!path) {
            path = checkClass(this);
        }
        if (!path) {
            path = checkFullPath(this, shortPath);
        }
        return path;
    };

    String.prototype.prepareForDomXPath = function () {
        let domXPath = '',
            elements = this.split('/');
        if (elements[0].length) {
            if (elements[0].indexOf('#') !== -1) {
                let splitElement = elements[0].split('#');
                elements[0] = '//*[@id="' + splitElement[1] + '"]';
            }
            if (elements[0].indexOf('.') !== -1) {
                let splitElement = elements[0].split('.');
                elements[0] = '//*[contains(@class, "' + splitElement[1] + '")]';
            }
        }
        domXPath = elements.join('/');
        return domXPath.toLowerCase();
    };

})(jQuery);

$(document).ready(function () {
    $("*").click(function (event) {
        event.stopPropagation();
        let xPath = $(this).jGetXpath();
        let arr = []
        //   let arr=listof
        arr.push({ "path": xPath, "location": window.location.pathname })
        if (arr.length() == "5") {
            post(arr);
            arr = [];
        }
    });
});

async function post(element) {
    const response = await fetch("/detectTripWire", {
        method: "POST",
        body: JSON.stringify({ "paths": element }),
        headers: {
            "Content-Type": "application/json"
        }
    })

    if (!response.ok) {
        throw Error(`Request failed with status ${response.status}`)
    }
    console.log("Request successful!")
}