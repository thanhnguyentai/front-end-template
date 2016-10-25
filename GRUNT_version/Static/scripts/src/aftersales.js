define(['jquery'], function ($) {
    function init(container) {
        item_active_process();
        if ($('html').hasClass('lte9')) {
            arrow_ie9_process();
        }
        var department_list_item = container.find('li.orange-top-border > a');
        department_list_item.click(function (e) {
            e.preventDefault();
            var _this = $(this);
            _this.parent().siblings().removeClass('active').find('.services-list').slideUp();
            if (_this.parent().hasClass('active')) {
                _this.parent().toggleClass('active').find('.services-list').slideUp();
            } else {
                _this.parent().toggleClass('active').find('.services-list').slideDown();
            }
            if ($('html').hasClass('lte9')) {
            	if (_this.parent().hasClass('active')) {
            		_this.parent().siblings().find('i.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
            		_this.find('i.fa').removeClass('fa-angle-down').addClass('fa-angle-up');
            	} else {
            		_this.parent().siblings().find('i.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
            		_this.find('i.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
            	}
            }
        });
    }
    return {
        init: function (container) {
            init(container);
        }
    };
    function item_active_process() {
        $('ul.department-lists li.orange-top-border').each(function () {
            var _self = $(this);
            if (_self.hasClass('active')) {
                _self.find('.services-list').slideDown();
            }
        });
    }
    function arrow_ie9_process() {
        $('ul.department-lists li.orange-top-border').each(function () {
            var _self = $(this);
            if (_self.hasClass('active')) {
                _self.find('i.fa').removeClass('fa-angle-down').addClass('fa-angle-up');
            } else {
                _self.find('i.fa').removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        });
    }
});