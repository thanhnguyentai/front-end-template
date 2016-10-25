define(['jquery'], function ($) {
    function init(container) {
        setHeight(container);
        $(window).resize(function () {
            setHeight(container);
        });
    }
    function setHeight(container) {
        var _self = container;
        var max = 0;
        _self.find('.feature-item__column .feature-item__container').each(function () {
            $(this).height('');
            var h = $(this).find('.feature-item__text-container').height() + 20;
            max = Math.max(max, h);
        }).height(max);
    }

    return {
        init: function (container) {
            init(container);
        }
    };
});