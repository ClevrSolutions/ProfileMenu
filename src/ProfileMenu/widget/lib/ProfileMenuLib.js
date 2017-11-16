require({
	packages: [{
		name: "jquery21",
		location: "../../widgets/jQueryLib", main: "jquery-211-min"
	}]
},

	["jquery21"], function(jQuery21) {

    $.fn.profileMenu = function (callerSettings) {
        var settings = $.extend({
            tabHandle: '.profile-menu-button',          // click/hover handle
            speed: 200
        }, callerSettings || {});

        settings.tabHandle = $(settings.tabHandle);

        var obj = this;

        settings.tabHandle.click(function(event){
            event.preventDefault();
        });

        var showProfile = function() {
            obj.addClass('open').fadeIn(settings.speed);
            obj.parent().css('display', 'block');
        }

        var hideProfile = function() {
            obj.removeClass('open').fadeOut(settings.speed);
            obj.parent().css('display', 'none');
        }

        var clickScreenToClose = function() {
            obj.click(function(event){
                event.stopPropagation();
            });

            $(document).click(function(){
                hideProfile();
            });
        };

        var clickAction = function(){
            settings.tabHandle.click(function(event){
                if (obj.hasClass('open')) {
                    hideProfile();
                } else {
                    showProfile();
                    event.stopPropagation();
                }
            });

            clickScreenToClose();
        };

        clickAction();
    }
});