function load() {

    var game_over = false;

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

    loadImages([
        {name: 'scene', src: 'imagens/Scene', format: '.png', number: 2, animation: true},
        {name: 'human', src: 'imagens/Human/Human', format: '.png', number: 21, animation: true},
        {name: 'dolphin', src: 'imagens/Dolphin/Dolphin', format: '.png', number: 9, animation: true},
        {name: 'arm', src: 'imagens/Arm/arm', format: '.png', number: 12, animation: true},
        {name: 'cables', src: 'imagens/Cables/Cables', format: '.png', number: 2, animation: true},
        {name: 'energyBar', src: 'imagens/EnergyBar/EnergyBar', format: '.png', number: 7, animation: true},
        {name: 'serum', src: 'imagens/Serum/Serum', format: '.png', number: 43, animation: true}
    ], loadCode);

    function loadCode() {
        let heartCanvas = document.getElementById('heartCanvas');
        let heartCanvasCTX = heartCanvas.getContext('2d');
        heartCanvasCTX.translate(-2, 0);

        //Gráfico
        //let divPontos = document.getElementById('div-game')
        let canvas = document.getElementById('box');
        let ctx = canvas.getContext('2d');

        function animation(x, y, images, length, frames, task, defaultTask, loop) {
            this.x = x;
            this.y = y;
            this.images = images;
            this.length = length;
            this.currentTask = defaultTask;
            this.frames = frames;
            this.task = task;
            this.loop = loop;
            this.ended = false;

            this.img = [];
            for (var i = 0; i < this.length; i++) {
                this.img[i] = this.images[i];
            }

            var CI;//Current Image
            var CIN = 0;//Current Image Number
            var FC = 0;//Frame Counter
            this.run = function () {
                CI = this.task[this.currentTask];
                if (CI.playing == false) {
                    CIN = CI.start;
                    CI.playing = true;
                }

                if (FC == this.frames) {
                    CIN++;
                    if (CIN == CI.frames + CI.start) {
                        this.ended = true;
                        if (this.loop) {
                            CIN = CI.start;
                        } else {
                            CIN = CI.frames + CI.start - 1;
                        }
                    } else {
                        this.ended = false;
                    }
                    FC = 0;
                }
                ctx.drawImage(this.img[CIN], this.x, this.y);
                FC++;
            };

            this.changeTask = function (task) {
                this.currentTask = task;
                CIN = this.task[this.currentTask].start;
            }
        }

        let scene = {
            images: allImages['scene'],
            animation: new animation(0, 0, allImages['scene'], 2, 3, {
                blinking: {start: 0, frames: 2, playing: false}
            }, "blinking", true)
        };

        let human = {
            images: allImages['human'],
            animation: new animation(73,81,allImages['human'],21,10, {
                breathing: {start: 0, frames: 4, playing: false},
                shock: {start: 14, frames: 2, playing: false},
                deathexplosion: {start: 6, frames: 7, playing: false},
                deathinanition: {start: 4, frames: 3, playing: false},
                deathburn: {start: 14, frames: 6, playing: false},
                smoking: {start: 19, frames: 2, playing: false}
            }, "breathing", true)
        };

        let dolphin = {
            images: allImages['dolphin'],
            animation: new animation(240,60,allImages['dolphin'],9,9, {
                moving: {start: 3, frames: 2, playing: false},
                talking: {start: 1, frames: 2, playing: false},
                frustrated: {start: 7, frames: 2, playing: false},
                winning: {start: 5, frames: 1, playing: false}
            }, 'moving', true)
        }

        let arm = {
            animation: new animation(61, 50, allImages['arm'], 12, 6, {
                iddle: {start: 0, frames: 1, playing: false},
                hit: {start: 2, frames: 10, playing: false}
            }, 'iddle', false)
        };

        energyPulse = function () {
            arm.animation.changeTask('hit');
        };

        let cables = {
            animation: new animation(0, 0, allImages['cables'], 2, 2, {
                iddle: {start: 0, frames: 1, playing: false}
            }, "iddle", true)
        };

        let energy = {
            animation: new animation(33,16,allImages['energyBar'],7,10,{
                bar1: {start: 1,frames:1,playing: false},
                bar2: {start: 2,frames:1,playing: false},
                bar3: {start: 3,frames:1,playing: false},
                bar4: {start: 4,frames:1,playing: false},
                bar5: {start: 5,frames:1,playing: false},
                bar6: {start: 6,frames:1,playing: false}
            },"bar1",false)
        };
        energyLevel = function (val) {
            if (val <= 6) {
                energy.animation.changeTask("bar" + val);
            }
        };

        let serum = {
            animation: new animation(13,58,allImages['serum'],43,10,{},"serum1",false)
        };
        for (let i = -1; i < 43;i++){
            serum.animation.task["serum"+i] = {start: i+1,frames:1,playing:false};
        }
        serumLevel = function (val) {
            if (val <=41) {
                serum.animation.changeTask("serum" + val);
            }
        };

        let divisor = 60; // novo
        function Heart() {
            let data = [100, 101];
            let value = 0;
            let adder = 1;
            this.ampDivisor = 5;
            this.input = 80;
            this.pumping = true;
            this.timer = 20;

            let x = 0;
            let counter = 0;
            this.update = () => {
                let amp = Math.floor(this.input / this.ampDivisor);

                x += 1;
                if (x > 150) {
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
                heartCanvasCTX.moveTo(x - 1, data[1] - 25);

                let angle = x * (180 / Math.PI);
                value += adder;
                if (!this.pumping) {
                    value = 0;
                }
                if (value >= amp) {
                    adder = -adder;
                }
                if (value <= -amp) {
                    adder = -adder;
                }
                data[0] = value * Math.sin(angle) + 100;

                heartCanvasCTX.lineTo(x, data[0] - 25);
                heartCanvasCTX.stroke();
                heartCanvasCTX.clearRect(x + 1, 0, 1, heartCanvas.height);


                angle = x * (180 / Math.PI);
                value += adder;
                if (!this.pumping) {
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

        let intervalo = setInterval(() => {
            heart.update();
        }, 1000 / divisor);



        //Dados iniciais
        let hidratacao = 70;
        let energia = 0;
        let score = 0;
        let bpm = 80;
        let death = false;
        let counterGlobal = false;

        //Morrer

        function dead() {

            setTimeout(function () {

                console.log("morte");

                dolphin.animation.changeTask('frustrated');
                dolphin.animation.loop = false;

                if (bpm < 0) {
                    human.animation.changeTask("deathinanition");
                    human.animation.loop = false;
                }
                if (bpm > 200) {
                    if (energia < 200) {
                        human.animation.changeTask("deathburn");
                        setTimeout(function () {
                            human.animation.changeTask("smoking");
                            human.animation.loop = true;
                        }, 900);
                    } else {
                        human.animation.changeTask("deathexplosion");
                        human.animation.loop = false;
                    }
                }

                setTimeout(function () {
                    reset();
                }, 3000);
            }, 500)

        }


//Atualiza as informações mostradas
        function update() {
            bpm = Math.floor(bpm);
            hidratacaoHtml.innerHTML = "Hidratação: " + hidratacao;
            bpmHtml.innerHTML = "Bpm: " + bpm;
            energiaHtml.innerHTML = "Energia: " + energia;
            scoreHtml.innerHTML = "SCORE: " + score;
            heart.input = bpm;
        }

//reseta as letiáveis para caso morra

        function reset() {
            game_over = true;
            processaFade(canvas, 2, 100, 0);
        }
        function restartPlay() {
            processaFade(canvas, 3, 0, 100);

            // Reset Animation
            human.animation.changeTask("breathing");
            human.animation.loop = true;
            dolphin.animation.changeTask('moving');
            dolphin.animation.loop = true;

            // Reset game state
            hidratacao = 70;
            energia = 0;
            score = 0;
            bpm = 80;
            death = false;
            counterGlobal = false;
            update();
        }

//fade no div principal
        function processaFade(element, time, initial, end) {
            if (initial == 0) {
                increment = 2;
                element.style.display = "block";
            } else {
                increment = -2;
            }
            opc = initial;
            intervalo = setInterval(function () {
                if ((opc == end)) {
                    if (end == 0) {
                        element.style.display = "block";
                    }
                    clearInterval(intervalo);
                } else {
                    opc += increment;
                    element.style.opacity = opc / 100;
                    element.style.filter = "alpha(opacity=" + opc + ")";
                }
            }, time * 10);
        }
        



//Timer de checagem de variáveis
        let intervalo1 = setInterval(function () {
            //Embelezamento de onda
            if (bpm > 180) {
                heart.ampDivisor = 0.5;
                divisor = 1000;
                heart.timer = 24;
            } else if (bpm >= 160) {
                heart.ampDivisor = 5;
                heart.timer = 23;
                divisor = 800;
            } else if (bpm >= 140) {
                heart.ampDivisor = 5;
                heart.timer = 20;
                divisor = 600;
            } else if (bpm >= 120) {
                heart.ampDivisor = 5;
                heart.timer = 22;
                divisor = 300;
            } else if (bpm >= 100) {
                heart.ampDivisor = 5;
                heart.timer = 20;
                divisor = 150;
            } else if (bpm >= 80) {
                heart.timer = 19;
                heart.ampDivisor = 5;
                divisor = 90;
            } else if (bpm >= 60) {
                heart.ampDivisor = 5.1;
                heart.timer = 24;
                divisor = 1;
            } else if (bpm >= 40) {
                heart.ampDivisor = 5
                heart.timer = 25;
                divisor = 30;
            } else if (bpm >= 20) {
                heart.ampDivisor = 5;
                heart.timer = 30;
                divisor = 10;
            } else if (bpm > 0) {
                heart.ampDivisor = 3;
                heart.timer = 30;
                divisor = 1;
            } else if (bpm <= 0) {
                heart.ampDivisor = 1
                heart.timer = 55;
                divisor = 30;
            };
            //nível de energia

            let energ = Math.floor(energia/100) + 1;
            if (energ == 5)
                energ+=1;
            energyLevel(energ);

            //nível do soro
            let hi = 42 - Math.floor((42*hidratacao)/100);

            serumLevel(hi);


            //Checagem do BPM
            if (bpm > 200 || bpm < 0) {
                death = true;

            }
            //Hidratação não mata mais, apenas bloqueia o defib.
            /*if (hidratacao <= 0) {
                death = true;
            }*/
            if (death == true) {

                heart.pumping = false;
                if (!counterGlobal) {
                    counterGlobal = true;
                    dead();
                }
            }


        }, 1000 / 120);

//Teclas
        let keyUp, keyDown, keyLeft, keyRight;
        keyUp = 87;
        keyDown = 83;
        keyLeft = 65;
        keyRight = 68;
        window.addEventListener("keyup", function (event) {

                if (game_over) {
                    
                    game_over = false;
                    restartPlay();
                }

                //tecla S
                if (event.keyCode == keyDown && death == false) {
                    if (hidratacao <= 95){
                        hidratacao += 5;
                    bpm -= bpm * 20 / 100;
                    update();
                    }
                    

                    //tecla A
                } else if (event.keyCode == keyLeft && death == false) {
                    if (energia >= 100 && hidratacao >= 10) {
                        energyPulse();
                        setTimeout(function () {
                        
                            energia -= 100;
                            if (bpm < 60) {
                                bpm += bpm * 35 / 100 + 25;
                            } else {
                                bpm +=  bpm * 30 / 100;
                            }
                            hidratacao -= 10;
                            update();
                        

                        }, 800);
                    }

                } else if (event.keyCode == keyRight && death == false) {
                    if (energia >= 400) {
                        energia -= 400;
                        score += 1;
                        update();
                    }

                }
            },
            false
        )
        ;


//Timer to set BPM
        setInterval(() => {
            let tendencia = 0.5;

            //Random tendencioso (Menor que 100 tende a cair, maior que 100 tende a subir)
            if (bpm >= 100) {
                tendencia = ((bpm - 100) / 2) / 100 + 0.5;
            }
            else {
                tendencia = (bpm / 100) / 2;
            }
            

            let decisor = Math.random();
            

            //BPM addition
            let somador = 0;

            if (bpm < 50 || bpm > 150){
                somador = Math.random() * 2 + 2;
                          
            } else {
                somador = Math.random() * 6 + 3;
            }

            if (decisor < tendencia)
                bpm += somador;

            else
                bpm -= somador;


            update();

        }, 350);

//Timer somador de energia
        setInterval(() => {
            if (energia <= 400) {
                energia += 20;
                update();

            }


        }, 30000 / bpm);



// Escreve a primeira vez os valores
        let hidratacaoHtml = document.getElementById('hidratacao');
        hidratacaoHtml.innerHTML = "Hidratação: " + hidratacao;

        let bpmHtml = document.getElementById('bpm');
        bpmHtml.innerHTML = "Bpm: " + bpm;


        let energiaHtml = document.getElementById('energia');
        energiaHtml.innerHTML = "Energia: " + energia;

        let scoreHtml = document.getElementById('score');
        scoreHtml.innerHTML = "Score: " + score;

        /*this.bar.animate = new animation(this.bar.x, this.bar.y, bar, 17, 8, {
         off: {start: 0, frames: 1, playing: false},
         start: {start: 1, frames: 14, playing: false},
         blink: {start: 15, frames: 2, playing: false}
         }, "off", true);*/

        let intervaloCanvas = setInterval(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            scene.animation.run();
            human.animation.run();
            dolphin.animation.run();
            arm.animation.run();
            cables.animation.run();
            energy.animation.run();
            serum.animation.run();
        }, 1000 / 60);

    }
}
