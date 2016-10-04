define(['jquery', 'underscore', 'backbone', 'lib/jquery.fancybox', 'base/modules/analytics'], function ($, _, backbone, fancyBox, analytic) {

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
            events: {
                'click': 'addGTM'
            },
            initialize: function () {
                this.$el.fancybox({
                    width: '100%',
                    height: '100%'
                });
            },

            addGTM: function () {
                var href = this.$el.attr('href');
                var vehicleDataInput = $('#Hidden_Vehicle_Download_Brochure');
                var vehicleData = null;

                if (vehicleDataInput != null && vehicleDataInput.length > 0) {
                    try{
                        vehicleData = JSON.parse(vehicleDataInput.val());
                    }
                    catch(ex){
                        vehicleData = null;
                    }
                }
                else {
                    vehicleDataInput = this.$el.parent().find('.data-download-brochure');

                    try {
                        vehicleData = JSON.parse(vehicleDataInput.val());
                    }
                    catch (ex) {
                        vehicleData = null;
                    }
                }

                var dataGTM = {
                    "Label": href
                };

                if (vehicleData != null) {
                    dataGTM["brand"] = vehicleData["brand"];
                    dataGTM["make"] = vehicleData["make"];
                    dataGTM["year"] = vehicleData["year"];
                }

                analytic["download-brochure"](dataGTM);
            }
        });
    }


    return {
        init: function (container, isCreate) {
            return init(container, isCreate);
        }
    };
});
