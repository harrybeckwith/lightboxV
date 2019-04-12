var lightboxa = (function () {
  const lightBox = document.querySelectorAll(".lightbox-v");
  // All the data
  let lightBoxData = [];
  // Group the data
  let lightBoxGrouped = [];
  // clicked lightbox data
  let clickedData = [];
  // strings for settings
  const lightboxSettings = {
    dataName: "data-lightbox-v",
    dataTitle: "data-title",
    dataAlt: "data-alt",
    arrows: "lightboxv__arrows",
    next: "lightboxv__next",
    prev: "lightboxv__prev",
    nextInside: "lightboxv__inside--next",
    prevInside: "lightboxv__inside--prev",
    close: "lightboxv__close",
    inside: "lightboxv__inside",
  };

  let option;

  if (typeof lightBoxVOptions === "undefined") {
    // default settings
    option = [
      {
        maxWidth: "",
        imageCount: true,
        fadeDuration: 10,
        border: false,
        noLoop: true,
        expand: false,
        arrowsSm: false,
      }
    ];
  } else {
    // reference from the html
    option = [lightBoxVOptions];
  }

  // Place starting div into DOM
  document.body.insertAdjacentHTML(
    "beforeend",
    '<div class="lightboxv"> </div>'
  );
  const lightBoxV = document.querySelector(".lightboxv");

  function getLightBoxItems() {
    // each light box item
    // get data
    lightBox.forEach(function (item) {
      let lightboxGroup = item.getAttribute(lightboxSettings.dataName);
      let lightboxTitle = item.getAttribute(lightboxSettings.dataTitle);
      let lightboxImg = item.getAttribute("href");
      let lightboxAlt = item.getAttribute(lightboxSettings.dataAlt);
      // create data set
      let lightboxDataSet = {
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
  lightBox.forEach(item => item.addEventListener("click", lightboxClick));

  function lightboxClick(e) {
    e.preventDefault();

    document.querySelector(".lightboxv").classList.add("lightboxv--show");
    document.body.classList.toggle('js-lightbox-open');
    // get data paths
    const lightBoxImg = this.getAttribute("href");
    const lightBoxData = this.getAttribute(lightboxSettings.dataName);
    // find the clicked data-lightbox text
    // get that object
    const lightboxGroup = lightBoxGrouped.find(item => {
      if (item.group === lightBoxData) {
        return true;
      }
      return false;
    });

    let lightboxDetails = lightboxGroup.details;
    let currentPosition;

    const postInside = lightboxDetails.find(item => {
      if (item.img === lightBoxImg) {
        // get index position of clicked img
        // inside its group
        currentPosition = lightboxDetails.indexOf(item);
        return true;
      }
      return false;
    });
    // create data set
    let gatherData = {
      groupDetails: lightboxDetails,
      currentIndex: currentPosition,
      currentItem: lightboxDetails[currentPosition]
    };
    // push up to make available
    clickedData = gatherData;
    // update lightbox with current item
    lightBoxV.innerHTML = `
    <div class="lightboxv__inside">
      <div class="lightboxv__inside__container">
        <img src="./dist/images/puff.svg" class="lightboxv__inside__img lightboxv__inside__img--loader" style="opacity: 1;">
      </div>
    </div>`;

    setTimeout(() => {
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
    let html;
    html = `<div class="lightboxv__inside ${
      option[0].arrowsSm ? `lightboxv__arrows-sm` : ``
      }   ${
      clickedData.groupDetails.length - 1 === clickedData.currentIndex &&
        option[0].noLoop
        ? `lightboxv__no__next`
        : ``
      } ${
      clickedData.currentIndex === 0 && option[0].noLoop
        ? `lightboxv__no__prev`
        : ``
      }">
 <div class="lightboxv__inside__container" ${
      option[0].maxWidth ? `style="width:${option[0].maxWidth}px"` : ""
      } >

 ${option[0].expand ? ` <div class="lightboxv__expand"></div>` : ``}

${
      clickedData.groupDetails.length > 1
        ? `<div class ="lightboxv__prev lightboxv__arrows">
<div class="lightboxv__arrows__inside lightboxv__inside--prev">
</div>
</div>`
        : ""
      }

 <img src ="${
      clicked.img
      }" class="lightboxv__inside__img lightboxv__inside__img--border" style="opacity: 0"
 alt="${clicked.alt}"
 >


${
      clickedData.groupDetails.length > 1
        ? `<div class ="lightboxv__next lightboxv__arrows
          ">
<div class="lightboxv__arrows__inside lightboxv__inside--next">
    
</div></div>`
        : ""
      }
</div>
<div class="lightboxv__details">
${
      option[0].imageCount
        ? `
<p class="lightboxv__count">${clickedData.currentIndex + 1} of ${
        clickedData.groupDetails.length
        }</p>`
        : ""
      }
    <p class="lightboxv__title">${clicked.title}</p>
   <span class="lightboxv__close"></span>
</div>
</div>`;

    // fade just the image in and out
    setTimeout(function () {
      const inside = document.querySelector(".lightboxv__inside__img");
      inside.style.opacity = "1";
    }, option[0].fadeDuration);
    // update the page
    lightBoxV.innerHTML = html;

    const imgBorder = document.querySelector(".lightboxv__inside__img--border");
    if (option[0].border) {
      imgBorder.classList.add("lightboxv__border");
    }
  }

  const next = noloop => {
    if (clickedData.currentIndex < clickedData.groupDetails.length - 1) {
      // up the current index by 1
      clickedData.currentIndex++;
      // display the updated html with next item
      updateHTML(clickedData.groupDetails[clickedData.currentIndex]);
    } else if (
      // if at the end of group
      (clickedData.currentIndex = clickedData.groupDetails.length)
    ) {
      // go back to first item
      clickedData.currentIndex = 0;
      updateHTML(clickedData.groupDetails[0]);

      if (noloop) {
        clickedData.currentIndex = clickedData.groupDetails.length - 1;
        updateHTML(clickedData.groupDetails[clickedData.currentIndex]);
      }
    }
  };

  const prev = noloop => {
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
  const checkLoop = direction => {
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

  const hideLightBox = () => {
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
      document
        .querySelector(".lightboxv__inside")
        .classList.toggle("lightboxv__expand__img");
    }
  });

  const container = document.querySelector(".lightboxv");
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
  let mouseDownX;
  let mouseUpX;
  let mouseDownY;
  let mouseUpY;

  container.addEventListener(
    "mousedown",
    function (e) {
      mouseDownX = e.clientX;
      mouseDownY = e.clientY;
      flag = 0;
    },
    false
  );

  container.addEventListener(
    "mousemove",
    function (e) {
      flag = 1;
    },
    false
  );
  container.addEventListener(
    "mouseup",
    function (e) {
      mouseUpX = e.clientX;
      mouseUpY = e.clientY;
      if (flag === 0) {
      } else if (flag === 1) {
        // next
        if (mouseDownX > mouseUpX + 50) {
          checkLoop("next");
        } else if (mouseDownX < mouseUpX) {
          checkLoop("prev");
        } else if (mouseDownY < mouseUpY) {
          // up swipe
        }
      }
    },
    false
  );
})();
