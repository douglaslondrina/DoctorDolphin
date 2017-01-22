function load() {
    allImages = [];
    function loadImages(images, loading) {
        var self = this;
        var totalImgN = 0;
        for (var i = 0; i < images.length; i++) {
            totalImgN += images[i].number;
        }

        this.run = function () {
            if (imageLoading == totalImgN) {
                loading();
            }
        };

        allImages = {};
        var imageLoading = 0;
        for (var i = 0; i < images.length; i++) {
            var imagez = images[i];
            if (imagez.animation) {
                let currentImage = allImages[imagez.name] = [];
                for (var l = 0; l < imagez.number; l++) {
                    currentImage.push(new Image());
                    currentImage[l].onload = function () {
                        imageLoading++;
                        self.run();
                    };
                    currentImage[l].src = imagez.src + l + imagez.format;
                }
            } else {
                let currentImage = allImages[imagez.name] = new Image();
                currentImage.onload = function () {
                    imageLoading++;
                    self.run();
                };
                currentImage.src = imagez.src;
            }
        }
    }

    loadImages([{name: 'background',src: 'imagens/DoctorDolphin_scene_all.png', format: '.png', number: 1, animation: false}],loadCode);

    function loadCode() {
        let heartCanvas = document.getElementById('heartCanvas');
        let heartCanvasCTX = heartCanvas.getContext('2d');
        heartCanvasCTX.translate(-2, 0);

        function Heart() {
            let data = [100, 101];
            let value = 0;
            let adder = 1;
            this.input = 110;
            this.pumping = true;
            this.timer = 10;

            let x = 0;
            let counter = 0;
            this.update = () => {
                let amp = Math.floor(this.input / 8);

                x += 1;
                if (x > 75) {
                    x = 1;
                }

                counter++;
                if (counter > 0 && counter < this.timer) {
                    this.pumping = false;
                } else if (counter > this.timer) {
                    counter = -this.timer;
                    this.pumping = true;
                }

                heartCanvasCTX.strokeStyle = "white";
                heartCanvasCTX.lineWidth = 2;
                heartCanvasCTX.beginPath();
                heartCanvasCTX.moveTo(x - 1, data[1] - 60);

                let angle = x * (180 / Math.PI);
                value += adder;
                if (this.pumping) {
                    value = 0;
                }
                if (value >= amp) {
                    adder = -adder;
                }
                if (value <= -amp) {
                    adder = -adder;
                }
                data[0] = value * Math.sin(angle) + 100;

                heartCanvasCTX.lineTo(x, data[0] - 60);
                heartCanvasCTX.stroke();
                heartCanvasCTX.clearRect(x + 1, 0, 1, heartCanvas.height);


                angle = x * (180 / Math.PI);
                value += adder;
                if (this.pumping) {
                    value = 0;
                }
                if (value >= amp) {
                    adder = -adder;
                }
                if (value <= -amp) {
                    adder = -adder;
                }
                data[1] = value * Math.sin(angle) + 100;
            }
        }

        let heart = new Heart();

        let canvas = document.getElementById('box');
        let ctx = canvas.getContext('2d');
        ctx.drawImage(allImages['background'],0,0);

        let intervalo = setInterval(()=> {
            heart.update();
        }, 1000 / 60);
    }
}