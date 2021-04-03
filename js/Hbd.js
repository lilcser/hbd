var container = $('#content');
var swipe = new Swipe(container);
var visualWidth = container.width();
var visualHeight = container.height();


var lamp = {
	elem: $('.b_background'),
	bright: function(){
		this.elem.addClass('lamp-bright');
	},
	dark: function () {
		this.elem.removeClass('lamp-bright');
	}
};

var bird = {
	elem: $('.bird'),
	fly: function () {
		this.elem.addClass('bird-Fly');
		this.elem.transition({
			'right': $('#content').width()
		},15000,'linear');
	}
};

var getValue = function(className){
	var $elem = $('' + className + '');
    return {
    	height: $elem.height(),
    	top: $elem.position().top
    };
};
var bridgeY = function(){
	var data = getValue('.c_background_middle');
	return data.top;
}();
var girl = {
	elem: $('.girl'),
	getHeight: function() {
		return this.elem.height();
	},
    rotate: function() {
    	this.elem.addClass('girl-rotate');
    },
    setOffset: function() {
    	this.elem.css({
    		left: visualWidth / 2,
    		top: bridgeY - this.getHeight()
    	});
    },
    getOffset: function() {
    	return this.elem.offset();
    },
    getWidth: function() {
    	return this.elem.width();
    }
};

girl.setOffset();

var animationEnd = (function() {
	var explorer = navigator.userAgent;
	if (~explorer.indexOf('WebKit')) {
		return 'webkitAnimationEnd';
	}
	return 'animationend';
})();

var logo = {
    elem: $('.logo'),
    run: function() {
        this.elem.addClass('logolightSpeedIn')
        .on(animationEnd, function() {
            $(this).addClass('logoshake').off();
        });
    }
};

	var roseURL = [
        'images/rose/rose1.png',
        'images/rose/rose2.png',
        'images/rose/rose3.png',
        'images/rose/rose4.png',
        'images/rose/rose5.png',
        'images/rose/rose6.png',
    ];

    function rose() {
        var $flakeContainer = $('#rose');

        function getImagesName() {
            return roseURL[[Math.floor(Math.random() * 6)]];
        }
        function createRoseBox() {
            var url = getImagesName();
            return $('<div class="rosebox" />').css({
                'width': 41,
                'height': 41,
                'position': 'absolute',
                'backgroundSize': 'cover',
                'zIndex': 100000,
                'top': '-41px',
                'backgroundImage': 'url(' + url + ')'
            }).addClass('roseRoll');
        }
        setInterval(function() {
            var startPositionLeft = Math.random() * visualWidth - 100,
                startOpacity    = 1,
                endPositionTop  = visualHeight - 40,
                endPositionLeft = startPositionLeft - 100 + Math.random() * 500,
                duration        = visualHeight * 10 + Math.random() * 5000;

            var randomStart = Math.random();
            randomStart = randomStart < 0.5 ? startOpacity : randomStart;

            var $flake = createRoseBox();

            $flake.css({
                left: startPositionLeft,
                opacity : randomStart
            });

            $flakeContainer.append($flake);

            $flake.transition({
                top: endPositionTop,
                left: endPositionLeft,
                opacity: 0.7
            }, duration, 'ease-out', function() {
                $(this).remove();
            });

        }, 200);
    }

var audioConfig = {
    enable: true,
    playURl: 'music/happy.wav',
    cycleURL: 'music/circulation.wav'
};

function Hmlt5Audio(url, isloop) {
    var audio = new Audio(url);
    audio.autoPlay = true;
    audio.loop = isloop || false;
    audio.play();
    return {
        end: function(callback) {
            audio.addEventListener('ended', function() {
                callback();
            }, false);
        }
    };
}


$(function(){
        var boy = BoyWalk();
        var audio1 = Hmlt5Audio(audioConfig.playURl);
        audio1.end(function() {
            Hmlt5Audio(audioConfig.cycleURL, true);
        });
        $('#sun').addClass('rotation');
        $('.cloud:first').addClass('cloud1Anim');
        $('.cloud:last').addClass('cloud2Anim');
        boy.walkTo(2500, 0.2).then(function(){
            swipe.scrollTo($('#content').width(),8000);
            bird.fly();
        }).then(function(){
            return boy.walkTo(7000, 0.5);
        }).then(function() {
            boy.stopWalk();
        }).then(function() {
            lamp.bright();
        }).then(function() {
            return boy.toShop(800);
        }).then(function(){
            return boy.buyFlower();
        }).then(function() {
            return boy.outShop(1000);
        }).then(function() {
            lamp.dark();
        }).then(function(){
            swipe.scrollTo($('#content').width()*2,5000);
        }).then(function(){
            boy.walkTo(5000, 0.15);
        }).then(function() {
            return boy.walkTo(5000, 0.25, (bridgeY - girl.getHeight()) / visualHeight);
        })
        .then(function() {
            var proportionX = (girl.getOffset().left - boy.getWidth() + girl.getWidth() / 3) / visualWidth;
            return boy.walkTo(2000,proportionX);
        }).then(function() {
            boy.resetOriginal();
        }).then(function() {
            setTimeout(function() {
                girl.rotate();
                boy.rotate(function() {
                    logo.run();
                });
            }, 2000);
        }).then(function(){
            rose();
        });
    });
