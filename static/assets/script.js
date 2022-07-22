function isScreenMb() {
  return screen.width <= 640
}
function reportWindowSize() {
  // var height =  window.innerHeight;
  // var width = window.innerWidth;
  // if(isScreenMb() && $(".css-scfpn5").length){
  //         $(".css-scfpn5").removeClass('css-scfpn5').addClass('css-g7asl1_mb')
  // }else{
  //     $(".css-g7asl1_mb").removeClass('css-g7asl1_mb').addClass('css-scfpn5');
  // }
}
window.addEventListener('resize', reportWindowSize)
window.addEventListener('load', reportWindowSize)
function checkIsVR() {
  return (
    document.getElementById('vr-button') &&
    document.getElementById('vr-button').style.display != 'none'
  )
}
jQuery(document).ready(function ($) {
  var currentView = ''
  let views
  let menuConfig
  function selectActive() {
    $('.HighlightsItem').each(function (index, e) {
      if ($(this).hasClass('active_view')) {
        $(this).removeClass('active_view')
      }
    })
    $('.HighlightsItem').each(function (index, e) {
      // console.log("🚀 ~ file: script.js ~ line 27 ~ $ ~ $(this).data('view')", $(this).data('view'))
      // console.log('select active', $(this).data("view"));

      if (currentView == $(this).data('view')) {
        $(this).addClass('active_view')
      }
    })
  }

  fetch('shapespark/scene.json')
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
      views = json.views
    })
  fetch('menuConfig.json')
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
      menuConfig = json
    })
  $('#info-bar-over').on('click', function () {
    if ($('#LayoutInfo').hasClass('show')) {
      $('#LayoutInfo').removeClass('show')
    } else {
      $('#LayoutInfo').addClass('show')
    }
  })
  $('#close_info').on('click', function () {
    $('#LayoutInfo').removeClass('show')
  })

  $('#LayoutControls .view_mode').click(function (e) {
    $('#LayoutControls .view-active').addClass('css-13dkh0e')
    $('#LayoutControls .view_mode').removeClass('view-active')
    // $("#LayoutControls .view_mode").removeClass("tour-playing");

    $(this).addClass('view-active').removeClass('css-13dkh0e')
    var view_name = $(this).data('view')
    if (view_name) {
      console.log('🚀 ~ file: script.js ~ line 54 ~ $ ~ view_name', view_name)
      WALK.getViewer().switchToView(view_name)
    } else {
      console.log($(this).attr('id') == 'tour-playing')
      if ($(this).attr('id') == 'tour-playing') {
        // $(this).addClass("view-active").addClass("tour-playing");
        $('#tour-button').click()
      } else {
        // $('#vr-button').click();
      }
    }
  })
  $('.epufmjg0').on('click', function () {
    $('#fullscreen-button').click()
  })
  $('.css-zbp4ta').on('click', function () {
    // $("#help-button").click();
    $('#tutorial-modal').css('display', 'flex')
  })

  $('#tour-playing').click(function () {
    console.log($(this))
    if ($(this).hasClass('tour-playing')) {
      $(this).removeClass('tour-playing')
    } else {
      $(this).addClass('view-active').addClass('tour-playing')
    }
  })

  $('.close-modal').on('click', function () {
    $('#tutorial-modal').css('display', 'none')
  })

  window.onclick = function (event) {
    if (event.target == $('#tutorial-modal')[0]) {
      $('#tutorial-modal').css('display', 'none')
    }
  }

  //help-button

  $(document).on('click', '#furtunire_on', function () {
    WALK.getViewer().switchToView('Display Furniture On')
  })
  $(document).on('click', '#furtunire_off', function () {
    WALK.getViewer().switchToView('Display Furniture Off')
  })

  $(document).on('click', '.HighlightsItem', function () {
    //
    var view_name = $(this).data('view')
    console.log('🚀 ~ file: script.js ~ line 26 ~ $ ~ view_name', view_name)
    WALK.getViewer().switchToView(view_name)
  })
  $(document).on('click', '#furniture-off', function () {
    // console.log($("#svg-test"));
    let element = $('#furniture-toggle').hasClass('css-wk5srw1')
    if (element) {
      $('#furniture-toggle').removeClass('css-wk5srw1')
      $('#furniture-toggle').addClass('css-12sr6l71')
      $('[id=svg-test]').each(function () {
        $(this).removeClass('furniture-off-svg')
        $(this).addClass('furniture-off-svg-on')
      })
    } else {
      $('#furniture-toggle').removeClass('css-12sr6l71')
      $('#furniture-toggle').addClass('css-wk5srw1')
      $('[id=svg-test]').each(function () {
        $(this).addClass('furniture-off-svg')
        $(this).removeClass('furniture-off-svg-on')
      })
      // $("#svg-test").addClass("furniture-off-svg");
      // $("#svg-test").removeClass("furniture-off-svg-on");
    }
  })
  $(document).on('click', '#LayoutFeatures', function () {
    $('body').toggleClass('css-top-view')
    WALK.getViewer().onSceneReadyToDisplay(function () {
      console.log('onSceneReadyToDisplay')
      // var viewer = WALK.getViewer();

      //helpWrapper.style.display = null;
    })
    if (!isScreenMb()) {
      if ($('#LayoutUI').hasClass('css-n35p41')) {
        console.log(1)
        //close
        $('#LayoutUI').removeClass('css-n35p41')
        $('#LayoutUI').addClass('css-bct84m')

        $('#LayoutUI .e5z0rfm0').removeClass('css-12sr6l7')
        $('#LayoutUI .e5z0rfm0').addClass('css-wk5srw')

        $('#LayoutUI .e5z0rfm2').removeClass('css-1eti7ja')
        $('#LayoutUI .e5z0rfm2').addClass('css-c65bht')
      } else {
        console.log(2)

        $('#LayoutUI').addClass('css-n35p41')
        $('#LayoutUI').removeClass('css-bct84m')

        $('#LayoutUI .e5z0rfm0').removeClass('css-wk5srw')
        $('#LayoutUI .e5z0rfm0').addClass('css-12sr6l7')

        $('#LayoutUI .e5z0rfm2').removeClass('css-c65bht')
        $('#LayoutUI .e5z0rfm2').addClass('css-1eti7ja')
      }
    } else {
      if ($('#LayoutUI').hasClass('css-uw7kfr')) {
        console.log(3)

        $('#LayoutUI').removeClass('css-uw7kfr')
        $('#LayoutUI').addClass('css-n35p41')

        $('#LayoutUI .e5z0rfm0').removeClass('css-wk5srw')
        $('#LayoutUI .e5z0rfm0').addClass('css-12sr6l7')

        $('#LayoutUI .e5z0rfm2').removeClass('css-c65bht')
        $('#LayoutUI .e5z0rfm2').addClass('css-1eti7ja')

        $('#playWraper').removeClass('mobile')
      } else {
        console.log(4)

        $('#LayoutUI').addClass('css-uw7kfr')
        $('#LayoutUI').removeClass('css-n35p41')

        $('#LayoutUI .e5z0rfm0').removeClass('css-12sr6l7')
        $('#LayoutUI .e5z0rfm0').addClass('css-wk5srw')

        $('#LayoutUI .e5z0rfm2').removeClass('css-1eti7ja')
        $('#LayoutUI .e5z0rfm2').addClass('css-c65bht')

        $('#playWraper').addClass('mobile')
      }
    }

    //css-1eti7ja  css-c65bht
    // css-12sr6l7  css-wk5srw
  })

  WALK.getViewer().onViewSwitchStarted(function (name) {
    console.log('onViewSwitchStarted', name)
    if (name != 'Top' && name != 'Orbit') {
      $('#LayoutControls .view-active').addClass('css-13dkh0e')
      $('#LayoutControls .view_mode').removeClass('view-active')
      $('#LayoutControls .walking_mode')
        .addClass('view-active')
        .removeClass('css-13dkh0e')
    }
    currentView = name
    selectActive()
  })
  var viewer = WALK.getViewer()
  document.getElementById('s1').addEventListener('click', function () {
    viewer.captureImage({
      isPanorama: false,

      toDataUrl: false,
      // defaults to the user screen width and height
      width: 1280,
      height: 720,
    })
  })

  viewer.play()
  currentView = 'Living Room'

  var images = {
    'Living Room': 'Living Room.JPG', //01
    Kitchen: 'Kitchen.JPG', //02
    'Dining Room': 'Dining.JPG', //03
    'Bedroom 1': 'Bedroom1.JPG', //04
    Toilet_2: 'Bath2.JPG', //05
    Entrance: 'Entrance.JPG', //07
    'Bedroom 2': 'Bedroom2.JPG', //08
    'Bedroom 3': 'Bedroom3.JPG', //09
    Toilet_1: 'Bath1.JPG',
  }
  var changeTitle = {}
  var disableViews = [
    // "Display Furniture Off",
    // "Display Furniture On",
    'Top',
    'Orbit',
  ]

  WALK.getViewer().onSceneLoadComplete(function () {
    // displayName = {
    //     "Living Room": "거실", //01
    //     Kitchen: "주방", //02
    //     "Dining Room": "식당", //03
    //     "Bedroom 1": "침실1", //04
    //     Toilet_2: "욕실2", //05
    //     Entrance: "입구", //07
    //     "Bedroom 2": "침실2", //08
    //     "Bedroom 3": "침실3", //09
    //     Toilet_1: "욕실1",
    // };
    // setTimeout(function(){
    //     $('#lg_stove').click();
    // },300);
    $('#LayoutControls').addClass('show')
    $('#LayoutFeatures').addClass('show')
    // if (checkIsVR()) {
    //     // $("#vr").addClass("show");
    // }
    var data_html = ''
    var data_html_mb = ''
    // $("#view-list-items .view").each(function (index, e) {
    //     let name = $(this).text();
    //     if (!disableViews.includes(name)) {
    //         data_html += `<div data-component="HighlightsItem" width="200" height="auto" data-view="${name}" class="HighlightsItem css-1g9e2n5 e1xx9fq10">
    //         <div class="e1xx9fq11">
    //           <img src="assets/views/${images[name]}" />
    //         </div>
    //         <div class="css-ijnaex e1xx9fq12"><span title="${
    //             changeTitle[name] ? changeTitle[name] : name
    //         }" class="css-1w7rkhm e1xx9fq13"><strong>${
    //             changeTitle[name] ? changeTitle[name] : displayName[name]
    //         }</strong></span></div>
    //         <span class="css-1khcmp6 e1xx9fq15"></span>
    //      </div>`;

    //         data_html_mb += `<div width="auto" height="80" class="HighlightsItem s-item css-1kj463k e1xx9fq10" data-view="${name}">
    //      <div class="css-18irzvx e1xx9fq11" style="background-image: url(assets/views/${
    //          images[name]
    //      });"></div>
    //      <div class="css-11d3xxp e1xx9fq12"><span title="Entrance" class="css-1w7rkhm e1xx9fq13"><strong>${
    //          changeTitle[name] ? changeTitle[name] : displayName[name]
    //      }</strong></span></div>
    //      <span class="css-1khcmp6 e1xx9fq15"></span>
    //   </div>`;
    //     }
    // });
    let leftMenuViews = views.filter(
      (view) =>
        !view.hideFromMenu && view.name !== 'Orbit' && view.name !== 'Top',
    )

    displayName = {}

    console.log(leftMenuViews)
    console.log(menuConfig)
    menuConfig.map((menu) => {
      displayName[menu.name] = menu.title
    })

    menuConfig.forEach((view) => {
      console.log(view)
      let img = menuConfig
        .filter((config) => config.name === view.name)
        .map((item) => item.imgSrc)
      console.log(img)
      data_html += `
            <div data-component="HighlightsItem" 
                width="200"
                height="auto"
                data-view="${view.name}"
                class="HighlightsItem css-1g9e2n5 e1xx9fq10">
                    <div class="e1xx9fq11">
                        <img src="assets/views/${img[0]}" />
                    </div>
                    <div class="css-ijnaex e1xx9fq12">
                        <span 
                            title="${view.name}" 
                            class="css-1w7rkhm e1xx9fq13">
                                <strong>${view.title}
                                </strong>
                        </span>
                    </div>
                    <span class="css-1khcmp6 e1xx9fq15"></span>
            </div>`
    })
    menuConfig.forEach((menu) => {
      data_html_mb += `<div 
            width="auto" 
            height="80" 
            class="HighlightsItem s-item css-1kj463k e1xx9fq10" 
            data-view="${menu.name}">
            <div 
                class="css-18irzvx e1xx9fq11" 
                style="background-image: url(assets/views/${menu.imgSrc});">
            </div>
            <div 
                class="css-11d3xxp e1xx9fq12">
                    <span 
                        title="Entrance" 
                        class="css-1w7rkhm e1xx9fq13">
                            <strong>${menu.title}</strong>
                    </span>
            </div>
            <span class="css-1khcmp6 e1xx9fq15"></span>
        </div>`
    })
    // data_html_mb += `<div
    //                     width="auto"
    //                     height="80"
    //                     class="HighlightsItem s-item css-1kj463k e1xx9fq10"
    //                     data-view="${name}">
    //                     <div
    //                         class="css-18irzvx e1xx9fq11"
    //                         style="background-image: url(assets/views/${
    //                             images[name]
    //                         });">
    //                     </div>
    //                     <div
    //                         class="css-11d3xxp e1xx9fq12">
    //                             <span
    //                                 title="Entrance"
    //                                 class="css-1w7rkhm e1xx9fq13">
    //                                     <strong>${
    //                                         changeTitle[name]
    //                                             ? changeTitle[name]
    //                                             : displayName[name]
    //                                     }</strong>
    //                             </span>
    //                     </div>
    //                     <span class="css-1khcmp6 e1xx9fq15"></span>
    //                 </div>`;
    $('#ScrollingArea').html(data_html)
    $('#LayoutMobileHighlights .slider').first().html(data_html_mb)
    $('.variable-width').slick({
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow: 3,
      // slidesToScroll: 1,
      centerMode: false,
      variableWidth: true,
      prevArrow: `<div type="previous" class="css-1dde90t e1fyde4h1"><svg width="35" height="35" viewBox="0 0 31 31" stroke-width="1.4171428571428573" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><polygon fill="none" points="18.0020243 9 11.5900002 15.5664517 18.0020243 22 11.5900002 15.5664517"></polygon></svg></div>`,
      nextArrow: `<div type="next" class="css-l94ndw e1fyde4h1"><svg width="35" height="35" viewBox="0 0 31 31" stroke-width="1.4171428571428573" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"><polygon fill="none" points="12.9979757 9 19.4099998 15.5664517 12.9979757 22 19.4099998 15.5664517"></polygon></svg></div>`,
    })
    $('#LayoutFeatures').click()
    //
    //   let floor_plans = window.data.fields["Floor plans"];
    //   console.log(floor_plans);
    // jQuery('#view-list-items .view').each(function(element){

    //           if(floor_plans.includes(jQuery(this).text())){
    //             jQuery(this).hide();
    //           }
    //       });
    //       if(getUrlVars()["view"]){
    //         jQuery('#view-list-items .view').each(function(element){
    //             if(getUrlVars()["view"] ==jQuery(this).text()){
    //                 jQuery(this).click();
    //             }
    //         });
    //       }
    selectActive()
    console.log('onSceneLoadComplete')
  })
  // $(document).on("click",".config_view_item",function() { //
  //     var view_name =  $(this).data('view');
  //     console.log("🚀 ~ file: script.js ~ line 26 ~ $ ~ view_name", view_name)
  //     WALK.getViewer().switchToView(view_name);
  //     $( ".toogle_left" ).addClass('minimum');
  //     $( '.gwd-div-110x' ).addClass( "hidden" );
  // });
})
