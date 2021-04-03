
function BoyWalk() {
    var instanceX;
    var container = $("#content");

    var visualWidth = container.width();
    var visualHeight = container.height();

	var getValue = function(className){
		var $elem = $('' + className + '');
	    return {
	    	height: $elem.height(),
	    	top: $elem.position().top
	    };
	};

    //y-axis
    var pathY = function(){
    	var data = getValue('.a_background');
    	return data.top + data.height;
    }();

    var $boy = $('#boy');
    var boyHeight = $boy.height();
    $boy.css({
    	top:pathY - boyHeight - 53
    });

    // stop
    function pauseWalk() {
        $boy.addClass('pauseWalk');
    }

    // resume
    function restoreWalk() {
        $boy.removeClass('pauseWalk');
    }

    function slowWalk() {
        $boy.addClass('slowWalk');
    }

    function startRun(options, walkTime) {
        var dfdPlay = $.Deferred();
        restoreWalk();
        $boy.transition(options,
        	{
        		duration:walkTime,
        		easing:'linear',
        		complete:function () {
        			dfdPlay.resolve();
        		}
        	}
        );
        return dfdPlay;
    }

    function walkRun(time, disX, disY) {
        time = time || 3000;
        slowWalk();

        var d1 = startRun({
            'left': disX + 'px',
            'top': disY ? disY + 'px': undefined
        }, time);
        return d1;
    }

    function walkToShop(runtime) {
        var defer = $.Deferred;
        var offsetBoy = $boy.offset();
        var boyOffsetLeft = offsetBoy.left;

        var data = getValue('.b_background');
        var x = data.left + data.width;

        instanceX = x - boyOffsetLeft + $boy.width();
        var walkPlay = startRun({
            'transform': 'translateX(' + instanceX + 'px) scale(0.3,0.3)',
            'opacity': 0.1
        },runtime);
        walkPlay.done(function() {
            defer.resolve;
        });
        return defer;
    }

    function buyFlower(){
        var defer = $.Deferred;
        setTimeout(function(){
            $boy.addClass('slowFlowerWalk');
            defer.resolve;
        },1000);
        return defer;
    }

    function walkOutShop(runtime) {
        var defer = $.Deferred();
        restoreWalk();
        var walkPlay = startRun({
            'transform': 'translateX(' + instanceX + 'px) scale(1,1)',
            'opacity': 1
        },runtime);
        walkPlay.done (function(){
            defer.resolve();
        });
        return defer;
    }

    function calculateDist(direction, proportion) {
        return (direction == "x" ?
            visualWidth : visualHeight) * proportion;
    }

    return {
        walkTo: function(time, proportionX, proportionY) {
            var distX = calculateDist('x', proportionX);
            var distY = calculateDist('y', proportionY);
            return walkRun(time, distX, distY);
        },

        toShop:function(){
            return walkToShop.apply(null,arguments);
        },

        buyFlower: function(){
            return  buyFlower();
        },

        outShop:function(){
            return walkOutShop.apply(null,arguments);
        },

        stopWalk: function() {
            pauseWalk();
        },
        setColor:function(value){
            $boy.css('background-color',value);
        },

        getWidth: function(){
            return $boy.width();
        },

        resetOriginal: function(){
            this.stopWalk();

            $boy.removeClass('slowWalk slowFlowerWalk').addClass('boyOriginal');
        },

        setFlowerWalk: function(){
            $boy.addClass('slowFlowerWalk');
        },

        rotate: function(callback) {
         restoreWalk();
         $boy.addClass('boy-rotate');

                   if (callback) {
                     $boy.on(animationEnd, function() {
                         callback();
                         $(this).off();
                     });
                 }
             }
    };
}
