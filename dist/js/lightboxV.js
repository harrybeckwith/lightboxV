"use strict";

var lightboxV = function () {
    var lightBox = document.querySelectorAll(".lightbox-v");
    // All the data
    var lightBoxData = [];
    // Group the data
    var lightBoxGrouped = [];
    // clicked lightbox data
    var clickedData = [];
    // strings for settings
    var lightboxSettings = {
        dataName: "data-lightbox-v",
        dataTitle: "data-title",
        arrows: "lightboxV__arrows",
        next: "lightboxV__next",
        prev: "lightboxV__prev",
        nextInside: "lightboxV__arrows__inside--next",
        prevInside: "lightboxV__arrows__inside--prev",
        close: "lightboxV__close",
        inside: "lightboxV__inside",
        cross: "../dist/images/close.svg",
        nextArrow: "../dist/images/next.svg",
        prevArrow: "../dist/images/back.svg"
    };

    var option = void 0;

    if (typeof lightBoxVOptions === 'undefined') {
        // default settings
        option = [{
            maxWidth: 900,
            imageCount: true,
            fadeDuration: 10,
            border: true,
            noLoop: true,
            expand: false,
            arrowsSm: false
        }];
    } else {
        // reference from the html
        option = [lightBoxVOptions];
    }

    // Place starting div into DOM
    document.body.insertAdjacentHTML("beforeend", '<div class="lightboxV"> </div>');
    var lightBoxV = document.querySelector(".lightboxV");

    function getLightBoxItems() {
        // each light box item
        // get data
        lightBox.forEach(function (item) {
            var lightboxGroup = item.getAttribute(lightboxSettings.dataName);
            var lightboxTitle = item.getAttribute(lightboxSettings.dataTitle);
            var lightboxImg = item.getAttribute("href");
            // create data set
            var lightboxDataSet = {
                group: lightboxGroup,
                title: lightboxTitle,
                img: lightboxImg
            };
            // push into
            lightBoxData.push(lightboxDataSet);
        });
    }

    function groupLightBox() {
        // call all the items
        getLightBoxItems();
        // places data-lightbox with the same value into groups
        // places them into ligh
        var dateArrKeyHolder = [];
        lightBoxData.forEach(function (item) {
            dateArrKeyHolder[item.group] = dateArrKeyHolder[item.group] || {};
            var obj = dateArrKeyHolder[item.group];
            if (Object.keys(obj).length == 0) lightBoxGrouped.push(obj);

            obj.group = item.group;
            obj.details = obj.details || [];

            obj.details.push({ title: item.title, img: item.img });
        });
    }

    groupLightBox();
    // click on lightbox - get position in array object
    lightBox.forEach(function (item) {
        return item.addEventListener("click", lightboxClick);
    });

    function lightboxClick(e) {
        e.preventDefault();

        // get data paths
        var lightBoxImg = this.getAttribute("href");
        var lightBoxData = this.getAttribute(lightboxSettings.dataName);
        // find the clicked data-lightbox text
        // get that object
        var lightboxGroup = lightBoxGrouped.find(function (item) {
            if (item.group === lightBoxData) {
                return true;
            }
            return false;
        });

        var lightboxDetails = lightboxGroup.details;
        var currentPosition = void 0;

        var postInside = lightboxDetails.find(function (item) {
            if (item.img === lightBoxImg) {
                // get index position of clicked img
                // inside its group
                currentPosition = lightboxDetails.indexOf(item);
                return true;
            }
            return false;
        });
        // create data set
        var gatherData = {
            groupDetails: lightboxDetails,
            currentIndex: currentPosition,
            currentItem: lightboxDetails[currentPosition]
        };
        // push up to make available
        clickedData = gatherData;
        // update lightbox with current item

        updateHTML(clickedData.currentItem);
    }

    // create lightbox html - clicked image details being passed in
    function updateHTML(clicked) {
        // if no title set to blank
        if (clicked.title === null) {
            clicked.title = "";
        }
        // create the lightbox html
        var html = void 0;
        html = "<div class=\"lightboxV__inside " + (option[0].arrowsSm ? "lightboxV__arrowsSm" : "") + "   " + (clickedData.groupDetails.length - 1 === clickedData.currentIndex && option[0].noLoop ? "lightboxV__no__next" : "") + " " + (clickedData.currentIndex === 0 && option[0].noLoop ? "lightboxV__no__prev" : "") + "\">\n <div class=\"lightboxV__inside__container\" " + (option[0].maxWidth ? "style=\"width:" + option[0].maxWidth + "px\"" : "") + " >\n\n " + (option[0].expand ? " <div class=\"lightboxV__expand\"></div>" : "") + "\n\n" + (clickedData.groupDetails.length > 1 ? "<div class =\"lightboxV__prev lightboxV__arrows\">\n<div class=\"lightboxV__arrows__inside lightboxV__arrows__inside--prev\">\n</div>\n</div>" : "") + "\n\n" + (option[0].border ? "<img src =\"" + clicked.img + "\" class=\"lightboxV__inside__img lightboxV__border\" style=\"opacity: 0\">\n<div class=\"lightboxV__details\">" : "<img src =\"" + clicked.img + "\" class=\"lightboxV__inside__img\" style=\"opacity: 0\">\n<div class=\"lightboxV__details\">") + "\n\n" + (option[0].imageCount ? "\n<p class=\"lightboxV__count\">Image " + (clickedData.currentIndex + 1) + " of " + clickedData.groupDetails.length + "</p>" : "") + "\n\n    <p class=\"lightboxV__title\">" + clicked.title + "</p>\n\n   <span class=\"lightboxV__close\"></span>\n</div>\n\n" + (clickedData.groupDetails.length > 1 ? "<div class =\"lightboxV__next lightboxV__arrows\n          \">\n<div class=\"lightboxV__arrows__inside lightboxV__arrows__inside--next\">\n    \n</div></div>" : "") + "\n</div>\n</div>";

        // fade just the image in and out
        setTimeout(function () {
            var inside = document.querySelector(".lightboxV__inside__img");
            inside.style.opacity = "1";
        }, option[0].fadeDuration);
        // update the page
        lightBoxV.innerHTML = html;
    }

    // items inside the light box - arrows and close.
    lightBoxV.addEventListener("click", function (e) {
        if (option[0].noLoop === false) {
            // looping of images
            if (e.target.classList.contains(lightboxSettings.next)) {
                // if the current index of clicked is less than the number of items in its group
                // increase the index
                // go to next image in object

                if (clickedData.currentIndex < clickedData.groupDetails.length - 1) {
                    // up the current index by 1
                    clickedData.currentIndex++;
                    // display the updated html with next item
                    updateHTML(clickedData.groupDetails[clickedData.currentIndex]);
                } else if (
                // if at the end of group
                clickedData.currentIndex = clickedData.groupDetails.length) {
                    // go back to first item
                    clickedData.currentIndex = 0;
                    updateHTML(clickedData.groupDetails[0]);
                }
            } else if (e.target.classList.contains(lightboxSettings.prev) || e.target.classList.contains("lightboxV__arrows__inside--prev")) {
                // if the current index of clicked is less than the number of items in its group
                // increase the index
                // go to next image in object
                if (clickedData.currentIndex <= clickedData.groupDetails.length - 1) {
                    if (clickedData.currentIndex > 0) {
                        clickedData.currentIndex--;
                        // display the updated html with next item
                        updateHTML(clickedData.groupDetails[clickedData.currentIndex]);
                    } else {
                        clickedData.currentIndex = clickedData.groupDetails.length - 1;
                        updateHTML(clickedData.groupDetails[clickedData.currentIndex]);
                    }
                }
            } else if (e.target.classList.contains(lightboxSettings.close)) {
                // clear lightbox div
                lightBoxV.innerHTML = "";
            } else if (e.target.classList.contains(lightboxSettings.inside)) {
                // clear lightbox div
                lightBoxV.innerHTML = "";
            } else if (e.target.classList.contains("lightboxV__expand")) {
                // expand container
                document.querySelector(".lightboxV__inside").classList.toggle("lightboxV__expand__img");
            }
        } else if (option[0].noLoop === true) {
            // no looping of images
            if (e.target.classList.contains(lightboxSettings.next) || e.target.classList.contains("lightboxV__arrows__inside--next")) {
                // if the current index of clicked is less than the number of items in its group
                // increase the index
                // go to next image in object

                if (clickedData.currentIndex < clickedData.groupDetails.length - 1) {
                    // up the current index by 1
                    clickedData.currentIndex++;
                    // display the updated html with next item
                    updateHTML(clickedData.groupDetails[clickedData.currentIndex]);
                } else if (
                // if at the end of group
                clickedData.currentIndex = clickedData.groupDetails.length) {
                    // stay at end NO LOOP
                    clickedData.currentIndex = clickedData.groupDetails.length - 1;
                    updateHTML(clickedData.groupDetails[clickedData.currentIndex]);
                }
            } else if (e.target.classList.contains(lightboxSettings.prev) || e.target.classList.contains("lightboxV__arrows__inside--prev")) {
                // if the current index of clicked is less than the number of items in its group
                // increase the index
                // go to next image in object
                if (clickedData.currentIndex <= clickedData.groupDetails.length - 1) {
                    if (clickedData.currentIndex > 0) {
                        clickedData.currentIndex--;
                        // display the updated html with next item
                        updateHTML(clickedData.groupDetails[clickedData.currentIndex]);
                    } else if (clickedData.currentIndex = 1) {

                        clickedData.currentIndex = 0;
                        updateHTML(clickedData.groupDetails[clickedData.currentIndex]);
                    }
                }
            } else if (e.target.classList.contains(lightboxSettings.close)) {
                // clear lightbox div
                lightBoxV.innerHTML = "";
            } else if (e.target.classList.contains(lightboxSettings.inside)) {
                // clear lightbox div
                lightBoxV.innerHTML = "";
            } else if (e.target.classList.contains("lightboxV__expand")) {
                // expand container
                document.querySelector(".lightboxV__inside").classList.toggle("lightboxV__expand__img");
            }
        }
    });
}();
// to do

// test - tablet - mobile
// test browers
// turn into npm?
// add to github to dowload
// add to portfolio
// and link to download from portfolio
// share social sites
// use for work
// add tips on each slide - for demo images
// check babel code works
// make no loop default
//smooth scroll for menu
// oragnise folder with just lightboxV code needed for download - add to github
// steps to report a bug on github
// image paths - for arrows and close? place paths in the css - so users can edit