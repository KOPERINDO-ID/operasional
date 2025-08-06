
// allow user rotate
screen.orientation.unlock();

// access current orientation


document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {


}

function htmlToImage() {
  window.canvas2ImagePlugin.saveImageDataToLibrary(
    function (msg) {
      alert(msg);
    },
    function (err) {
      alert(err)
    },
    document.getElementById("myCanvas"),
    "jpeg" // format is optional, defaults to 'png'
  );
}



function getMenuUser() {
  app.dialog.close();
  if (localStorage.getItem("user_id") == 260) {
    jQuery('.menu-ninda').show();
    jQuery('.menu-manan').hide();
    jQuery('.menu-owner').hide();
  } else if (localStorage.getItem("user_id") == 262) {
    jQuery('.menu-ninda').hide();
    jQuery('.menu-manan').hide();
    jQuery('.menu-owner').show();
  } else {
    jQuery('.menu-ninda').hide();
    jQuery('.menu-manan').show();
    jQuery('.menu-owner').hide();
  }
}

function showLineGraph() {

}


function showday() {



  const getDaysByMonth = (month) => {
    const daysInMonth = moment(month).daysInMonth();
    return Array.from({ length: daysInMonth }, (v, k) => k + 1)
  };

  let month = '2020-02';
  var dayday = getDaysByMonth(month);



  for (var i = 0; i < 7; i++) {



  }



}
