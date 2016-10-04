define(['jquery', 'lib/pikaday.jquery', 'moment', 'pikaday'], function ($, jqueryPikaday, moment, Pikaday) {

    'use strict';

    function init(container) {
        var nowDT = new Date();
        var nowDTStr = nowDT.getDate();
        var start_year_range = nowDT.getFullYear() - 100;
        var locales = {
            ar: {
                previousMonth: 'الشهر السابق',
                nextMonth: 'الشهر القادم',
                months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
                monthsShort: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
                weekdays: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
                weekdaysShort: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"]
            },
            en: {
                previousMonth: 'Previous Month',
                nextMonth: 'Next Month',
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                weekdays: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                weekdaysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            }
        };
        var is_rtl = false;
        if ($('html').attr('dir') == 'rtl') {
            is_rtl = true;
        }
        var picker = container.find('.date-picker-input');
        var options = {
            field: container.find('.date-picker-input')[0],
            firstDay: 1,
            format: 'MMM DD, YYYY',
            position: 'bottom right',
            maxDate: new Date(),
            yearRange: [parseInt(start_year_range), parseInt(nowDT.getFullYear())],
            i18n: locales[$('html').attr('lang')],
            onSelect: function (date) {
                container.removeClass('placeholder');
            }
        }
        var pik = new Pikaday(options);
        $(window).resize(function () {
            pik.adjustPosition();
        });
    }

    return {
        init: init
    };
});
