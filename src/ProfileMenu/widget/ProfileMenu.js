/**
 Profile Menu widget
 ========================

 @file      : ProfileMenu.js
 @version   : 1.0
 @author    : Nick van Wieren
 @date      : 24-10-2014
 @copyright : Mansystems Nederland B.V.
 @license   : Apache License, Version 2.0, January 2004

 Documentation
 =============
 ExpertDesk specific widget for Profile Menu for which the content is driven by a form.

 Change log
 ==========
 1.0 Initial release
 1.0.1 Username/Emailaddress Overflow hidden not working (CSS)
 */

require({
	packages: [{
		name: "jquery21",
		location: "../../widgets/jQueryLib", main: "jquery-211-min"
	}]
},

	["jquery21"], function(jQuery21) {

    dojo.provide('ProfileMenu.widget.ProfileMenu');

    dojo.declare('ProfileMenu.widget.ProfileMenu', [mxui.widget._WidgetBase, dijit._Templated, dijit._Container, dijit._Contained, mxui.mixin._Contextable], {

        /**
         * Internal variables.
         * ======================
         */
        _wgtNode: null,
        _contextGuid: null,
        _contextObj: null,

        // Extra variables
        _extraContentDiv: null,
        _imageGuid: null,

        // Template path
        templatePath: dojo.moduleUrl('ProfileMenu', 'widget/templates/ProfileMenu.html'),

        /**
         * Mendix Widget methods.
         * ======================
         */

        // DOJO.WidgetBase -> PostCreate is fired after the properties of the widget are set.
        postCreate: function () {
            'use strict';

            console.log('ProfileMenu - postCreate');

            this._setupWidget();
            this._createProfileMenu();
            this.addFormToPanelContent();
        },

        addFormToPanelContent: function () {
            logger.debug(this.id + '.addFormToPanelContent');

            mx.ui.openForm(this.panelForm, {
				domNode: this._profileMenu,
                callback: dojo.hitch(this, function() {
                    jQuery21("[id^=mxui_widget_ActionButton]").each(dojo.hitch(this, function( index, element ) {
                            jQuery21(element).click(dojo.hitch(this, function() {
                                var menu = jQuery21(this._profileMenu);
                                menu.removeClass('open').fadeOut(200);
                                menu.parent().css('display', 'none');
                            }));
                        }));
                    }),
				    error: function(err) {
					    console.log(this.id + '.addFormToPanelContent =>' + err);
					}
                }
            );
        },

        // Create child nodes.
        _createProfileMenu: function () {
            'use strict';

            // Assigning externally loaded library to internal variable inside function.
            var $ = this.$;

            console.log('ProfileMenu - createProfileMenu events');

            jQuery21(this._profileMenu).profileMenu({
                tabHandle: '.profile-menu-button',          //class of the element that will be profile image
                speed: 200                                  //speed of animation
            });

            var entity = this.imageEntity;
            var constraint = this.entityConstraint;
            var xPath = '//' + entity + constraint;

            mx.data.get({
                xpath: xPath,
                filter: {
                    amount: 1
                },
                callback: dojo.hitch(this, function (objs) {
                    jQuery21.each(objs, dojo.hitch(this, function (index, currObj) {
                        if (this.imageObject != currObj._guid) {
                            this.imageObject = currObj._guid;

                            if (this.subHandle) {
                                this.unsubscribe(this.subHandle);
                            }
                            this.subHandle = this.subscribe({
                                guid: this.imageObject,
                                callback: dojo.hitch(this, function () {
                                    this._setProfileImage(true);
                                })
                            });

                            this._setProfileImage(false);
                        }

                    }))
                })
            });
        },

        update: function (obj, callback) {
            'use strict';

            // startup
            console.log('ProfileMenu - update');

            if (typeof callback !== 'undefined') {
                callback();
            }

        },

        /**
         * Extra setup widget methods.
         * ======================
         */
        _setupWidget: function () {
            'use strict';

            // To be able to just alter one variable in the future we set an internal variable with the domNode that this widget uses.
            this._wgtNode = this.domNode;

            dojo.require("ProfileMenu.widget.lib.ProfileMenuLib");

        },

        _setProfileImage: function (preventCache) {

            var targetNode = this.profileImg;
            var defaultImage = this.defaultImage;
            var url = '';

            if (this.imageObject != null) {
                url = '/file?guid=' + this.imageObject + '&thumb=true';
            } else {
                url = defaultImage;
            }

            var xhrArgs = {
                url: url,
                handleAs: "text",
				preventCache: preventCache,
                failOk: true,
                handle: function (error, ioargs) {
                    if (ioargs.xhr.status == 200) {
                        targetNode.src = ioargs.url;
                    } else {
                        targetNode.src = defaultImage;
                        console.log('ProfileMenu - image could not be retrieved from server | error_code ' + ioargs.xhr.status);
                    }
                }
            };

            var deferred = dojo.xhrGet(xhrArgs);
        }

    })
});
