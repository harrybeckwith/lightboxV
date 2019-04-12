"use strict";

var lightboxa = function () {
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
    dataAlt: "data-alt",
    arrows: "lightboxv__arrows",
    next: "lightboxv__next",
    prev: "lightboxv__prev",
    nextInside: "lightboxv__inside--next",
    prevInside: "lightboxv__inside--prev",
    close: "lightboxv__close",
    inside: "lightboxv__inside"
  };

  var option = void 0;

  if (typeof lightBoxVOptions === "undefined") {
    // default settings
    option = [{
      maxWidth: "",
      imageCount: true,
      fadeDuration: 10,
      border: false,
      noLoop: true,
      expand: false,
      arrowsSm: false
    }];
  } else {
    // reference from the html
    option = [lightBoxVOptions];
  }

  // Place starting div into DOM
  document.body.insertAdjacentHTML("beforeend", '<div class="lightboxv"> </div>');
  var lightBoxV = document.querySelector(".lightboxv");

  function getLightBoxItems() {
    // each light box item
    // get data
    lightBox.forEach(function (item) {
      var lightboxGroup = item.getAttribute(lightboxSettings.dataName);
      var lightboxTitle = item.getAttribute(lightboxSettings.dataTitle);
      var lightboxImg = item.getAttribute("href");
      var lightboxAlt = item.getAttribute(lightboxSettings.dataAlt);
      // create data set
      var lightboxDataSet = {
        group: lightboxGroup,
        title: lightboxTitle,
        img: lightboxImg,
        alt: lightboxAlt
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

      obj.details.push({ title: item.title, img: item.img, alt: item.alt });
    });
  }

  groupLightBox();
  // click on lightbox - get position in array object
  lightBox.forEach(function (item) {
    return item.addEventListener("click", lightboxClick);
  });

  function lightboxClick(e) {
    e.preventDefault();

    document.querySelector(".lightboxv").classList.add("lightboxv--show");
    document.body.classList.toggle('js-lightbox-open');
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
    lightBoxV.innerHTML = "\n    <div class=\"lightboxv__inside\">\n      <div class=\"lightboxv__inside__container\">\n        <img src=\"./dist/images/puff.svg\" class=\"lightboxv__inside__img lightboxv__inside__img--loader\" style=\"opacity: 1;\">\n      </div>\n    </div>";

    setTimeout(function () {
      updateHTML(clickedData.currentItem);
    }, 500);
  }

  // create lightbox html - clicked image details being passed in
  function updateHTML(clicked) {
    // if no title set to blank
    if (clicked.title === null) {
      clicked.title = "";
    }
    // create the lightbox html
    var html = void 0;
    html = "<div class=\"lightboxv__inside " + (option[0].arrowsSm ? "lightboxv__arrows-sm" : "") + "   " + (clickedData.groupDetails.length - 1 === clickedData.currentIndex && option[0].noLoop ? "lightboxv__no__next" : "") + " " + (clickedData.currentIndex === 0 && option[0].noLoop ? "lightboxv__no__prev" : "") + "\">\n <div class=\"lightboxv__inside__container\" " + (option[0].maxWidth ? "style=\"width:" + option[0].maxWidth + "px\"" : "") + " >\n\n " + (option[0].expand ? " <div class=\"lightboxv__expand\"></div>" : "") + "\n\n" + (clickedData.groupDetails.length > 1 ? "<div class =\"lightboxv__prev lightboxv__arrows\">\n<div class=\"lightboxv__arrows__inside lightboxv__inside--prev\">\n</div>\n</div>" : "") + "\n\n <img src =\"" + clicked.img + "\" class=\"lightboxv__inside__img lightboxv__inside__img--border\" style=\"opacity: 0\"\n alt=\"" + clicked.alt + "\"\n >\n\n\n" + (clickedData.groupDetails.length > 1 ? "<div class =\"lightboxv__next lightboxv__arrows\n          \">\n<div class=\"lightboxv__arrows__inside lightboxv__inside--next\">\n    \n</div></div>" : "") + "\n</div>\n<div class=\"lightboxv__details\">\n" + (option[0].imageCount ? "\n<p class=\"lightboxv__count\">" + (clickedData.currentIndex + 1) + " of " + clickedData.groupDetails.length + "</p>" : "") + "\n    <p class=\"lightboxv__title\">" + clicked.title + "</p>\n   <span class=\"lightboxv__close\"></span>\n</div>\n</div>";

    // fade just the image in and out
    setTimeout(function () {
      var inside = document.querySelector(".lightboxv__inside__img");
      inside.style.opacity = "1";
    }, option[0].fadeDuration);
    // update the page
    lightBoxV.innerHTML = html;

    var imgBorder = document.querySelector(".lightboxv__inside__img--border");
    if (option[0].border) {
      imgBorder.classList.add("lightboxv__border");
    }
  }

  var next = function next(noloop) {
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

      if (noloop) {
        clickedData.currentIndex = clickedData.groupDetails.length - 1;
        updateHTML(clickedData.groupDetails[clickedData.currentIndex]);
      }
    }
  };

  var prev = function prev(noloop) {
    if (clickedData.currentIndex <= clickedData.groupDetails.length - 1) {
      if (clickedData.currentIndex > 0) {
        clickedData.currentIndex--;
        // display the updated html with next item
        updateHTML(clickedData.groupDetails[clickedData.currentIndex]);
      } else {
        clickedData.currentIndex = clickedData.groupDetails.length - 1;
        updateHTML(clickedData.groupDetails[clickedData.currentIndex]);

        if (noloop && clickedData.currentIndex === 1) {
          clickedData.currentIndex = 0;
          updateHTML(clickedData.groupDetails[clickedData.currentIndex]);
        }
      }
    }
  };
  // check direction of lb image
  var checkLoop = function checkLoop(direction) {
    if (option[0].noLoop === false) {
      if (direction === "next") {
        next();
      } else if (direction === "prev") {
        prev();
      }
    } else {
      if (direction === "next") {
        next(true);
      } else if (direction === "prev") {
        prev(true);
      }
    }
  };

  var hideLightBox = function hideLightBox() {
    // clear lightbox div
    lightBoxV.innerHTML = null;
    lightBoxV.classList.remove("lightboxv--show");
    document.body.classList.toggle('js-lightbox-open');
  };

  // items inside the light box - arrows and close.
  lightBoxV.addEventListener("click", function (e) {
    // looping of images
    if (e.target.classList.contains(lightboxSettings.nextInside)) {
      checkLoop("next");
    } else if (e.target.classList.contains(lightboxSettings.prevInside)) {
      checkLoop("prev");
    } else if (e.target.classList.contains(lightboxSettings.close)) {
      hideLightBox();
    } else if (e.target.classList.contains(lightboxSettings.inside)) {
      hideLightBox();
    } else if (e.target.classList.contains("lightboxv__expand")) {
      // expand container
      document.querySelector(".lightboxv__inside").classList.toggle("lightboxv__expand__img");
    }
  });

  var container = document.querySelector(".lightboxv");
  //device swipe events
  container.addEventListener("touchstart", startTouch, false);
  container.addEventListener("touchmove", moveTouch, false);

  // Swipe Up / Down / Left / Right
  var initialX = null;
  var initialY = null;

  function startTouch(e) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
  }

  function moveTouch(e) {
    if (initialX === null) {
      return;
    }

    if (initialY === null) {
      return;
    }

    var currentX = e.touches[0].clientX;
    var currentY = e.touches[0].clientY;

    var diffX = initialX - currentX;
    var diffY = initialY - currentY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // sliding horizontally
      if (diffX > 0) {
        // swiped left
        checkLoop("next");
      } else {
        checkLoop("prev");
        // swiped right
      }
    } else {
      // sliding vertically
      if (diffY > 0) {
        // swiped up
        console.log("swiped up");
      } else {
        // swiped down
        console.log("swiped down");
      }
    }

    initialX = null;
    initialY = null;

    e.preventDefault();
  }
  // desktop drag events
  var flag = 0;
  var mouseDownX = void 0;
  var mouseUpX = void 0;
  var mouseDownY = void 0;
  var mouseUpY = void 0;

  container.addEventListener("mousedown", function (e) {
    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
    flag = 0;
  }, false);

  container.addEventListener("mousemove", function (e) {
    flag = 1;
  }, false);
  container.addEventListener("mouseup", function (e) {
    mouseUpX = e.clientX;
    mouseUpY = e.clientY;
    if (flag === 0) {} else if (flag === 1) {
      // next
      if (mouseDownX > mouseUpX + 50) {
        checkLoop("next");
      } else if (mouseDownX < mouseUpX) {
        checkLoop("prev");
      } else if (mouseDownY < mouseUpY) {
        // up swipe
      }
    }
  }, false);
}();