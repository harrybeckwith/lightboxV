"use strict";

function anchorLinkHandler(e) {
    e.preventDefault();
    var targetID = this.href.slice(this.href.indexOf("#"));
    var element = document.querySelector(targetID);
    var originalTop = element.getBoundingClientRect().top;
    var originalLeft = element.getBoundingClientRect().left;

    window.scrollBy({
        top: originalTop,
        left: originalLeft,
        behavior: "smooth"
    });
}
var linksToAnchors = document.querySelectorAll('a[href^="#"]');

linksToAnchors.forEach(function (each) {
    return each.addEventListener('click', anchorLinkHandler);
});

//none chrome will just work as normal anchor without smooth scroll.