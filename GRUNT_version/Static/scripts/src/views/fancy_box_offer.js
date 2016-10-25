define(['jquery', 'underscore', 'backbone', 'lib/jquery.fancybox', 'lib/jquery.fancybox-buttons'], function ($, _, backbone, fancyBox, buttons) {

    'use strict';

    function init(container, isCreate) {
        var backboneView = backboneInit();
        if (isCreate)
            return new backboneView({
                el: container
            });
        else
            return backboneView;

    }

    function backboneInit() {
        return Backbone.View.extend({
            initialize: function () {
                this.$el.find('.brand-model__item a').each(function () {
                    var current_container_w = 0;
                    var current_container_h = 0;
                    $(this).fancybox({
                        helpers: {
                            title: {
                                type: 'inside'
                            },
                            buttons: {} // we need this to clone
                        },
                        afterLoad: function () {
                            // make sure we have a title
                            this.title = this.title ? this.title : "&nbsp;";
                        },
                        afterShow: function () {
                            // wait for the buttons helper
                            setTimeout(function () {
                                $("#fancybox-buttons")
                                .find(".btnToggle")
                                .clone(true, true) // clone with data and events
                                .addClass("clone") // set class "clone" (and remove class "top")
                                .appendTo(".fancybox-title") // append it to the title
                                .fadeIn(); // show it nicely
                            }, 100); //setTimeout
                            var toggle = $(".btnToggle.clone");
                            current_container_w = toggle.parents('.fancybox-skin').find('.fancybox-outer').width();
                            current_container_h = toggle.parents('.fancybox-skin').find('.fancybox-outer').height();
                        }, // afterShow
                        onUpdate: function () {
                            if($(window).width() > 1200) {
                                var toggle = $(".btnToggle.clone");
                                toggle.toggleClass('btnToggleOn');
                                if (!toggle.hasClass('btnToggleOn')) {
                                    console.log('current_container_w' + current_container_w);
                                    toggle.parents('.fancybox-skin').find('.fancybox-inner, .fancybox-outer').css({ "width": current_container_w, "height": "auto" }).parents('.fancybox-wrap').css({ "width": current_container_w, "height": "auto" });
                                } else {
                                    toggle.parents('.fancybox-skin').find('.fancybox-inner, .fancybox-outer').css({ "width": "100%", "height": "auto" }).parents('.fancybox-wrap').css({ "width": $(window).width() - 60, "height": "auto" });
                                }
                
                                $.fancybox.reposition();
                            }
                        }
                    });
                });
            },
            events: {
                'resize window': 'update_fancybox'
            },
            update_fancybox: function () {
                $.fancybox.trigger('onUpdate');
            },
        });
    }


    return {
        init: function (container, isCreate) {
            return init(container, isCreate);
        }
    };
});
