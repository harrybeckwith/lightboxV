function anchorLinkHandler(e) {
    e.preventDefault();
    const targetID = this.href.slice(this.href.indexOf("#"));
    const element = document.querySelector(targetID);
    const originalTop = element.getBoundingClientRect().top;
    const originalLeft = element.getBoundingClientRect().left;

    window.scrollBy({
        top: originalTop,
        left: originalLeft,
        behavior: "smooth"
    });


}
const linksToAnchors = document.querySelectorAll('a[href^="#"]');

linksToAnchors.forEach(each => each.addEventListener('click', anchorLinkHandler));

//none chrome will just work as normal anchor without smooth scroll.