var blank = "splash.png";
var isPhotoTaken = false;


photoHandling = {

    photoTaken: function(){
        return photoHandling.isPhotoTaken;
    },
    resetPicture: function () {
        photoHandling.isPhotoTaken = false;
        Session.set("isphototaken", photoHandling.isPhotoTaken);
        
        Session.set("photo", blank);
        var canvas = document.getElementById('canvas');
        if (!canvas) return;
        var context = canvas.getContext('2d');
        var imageObj = new Image();

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'white';
        context.fill();
        var photo = new Image();
        photo.onload = function() {
            if (photo.width < canvas.width) {
                context.drawImage(
                            photo,
                            (canvas.width - photo.width) / 2,
                            (canvas.height - photo.height) / 2
                );
            } else {
                context.drawImage(
                            photo,
                            0,0,
                            canvas.width,
                            canvas.height
                );
            }
        };
        photo.src =  Session.get("photo");
    },

    takePhoto: function() {
        var canvas = document.getElementById('canvas');
        var context = canvas.getContext('2d');

        MeteorCamera.getPicture({ width: 800, height: 600, correctOrientation: true }, function(error, data) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (data) {
                photoHandling.isPhotoTaken = true;

                photoHandling.fitImageInCanvas(data, canvas);
                Materialize.toast("Tocca la foto per coprire", 4000 , 'rounded');
                Materialize.toast("Targhe e visi", 4000 , 'rounded');
                //Materialize.toast("Completa la scheda e premi \"Multa\"", 4000 , 'rounded');
                Session.set("photo", data);
                $('body').scrollTop(0);
                
                Session.set("isphototaken", photoHandling.isPhotoTaken);
                geoLocalization.geocode();
        
            } else {
                photoHandling.resetPicture();
            }
        });
    },
    fitImageInCanvas: function (data, canvas, allowCors) {
        var context = canvas.getContext('2d');
        var photo = new Image();
        if (allowCors)
            photo.setAttribute('crossOrigin', 'anonymous');

        photo.onload = function () {
            // canvas.width : x = photo.width : photo.height
            if (photo.width > photo.height) {
                var scaled = (canvas.width * photo.height) / photo.width;
                context.drawImage(
                            photo,
                            0, (canvas.height - scaled) / 2,
                            canvas.width,
                            scaled
                );
            } else {
                var scaled = (canvas.height * photo.width) / photo.height;
                context.drawImage(
                            photo,
                            (canvas.width - scaled) / 2,
                            0,
                            scaled,
                            canvas.height
                );
            }
        };
        photo.src = data;
    },

    drawLogo: function (canvasId, offsetX, offsetY) {
        var canvas = document.getElementById(canvasId);
        var context = canvas.getContext('2d');
        var imageObj = new Image();

        imageObj.onload = function () {
            var w = imageObj.width / 4;
            var h = imageObj.height / 4;
            context.drawImage(
                        imageObj,
                        offsetX - (w / 2),
                        offsetY - (h / 2),
                        w, h
            );
        };
        imageObj.src = "icon.png";
    }
}
