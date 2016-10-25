define(['underscore', 'jquery', 'base/modules/custom_select_wrapper', 'base/modules/validator', 'base/modules/analytics', 'base/modules/animate'], function (_, $, customSelectWrapper, validator, analytic, animate) {
    var recaptcha1, recaptcha2;
    var modelText;

    function initReCaptchar() {

        if (!window.reCaptchaIsReady) {
            var timeout = setTimeout(function () {
                clearTimeout(timeout);
                initReCaptchar();
            }, 1000);
            return;
        }

        if ($("#recaptcha1").length > 0)
            recaptcha1 = grecaptcha.render('recaptcha1', {
                'sitekey': $("#recaptcha1").attr('data-recaptcha')
            });

        if ($("#recaptcha2").length > 0)
            recaptcha2 = grecaptcha.render('recaptcha2', {
                'sitekey': $("#recaptcha2").attr('data-recaptcha')
            });
    }

    function addGoogleTagManager(event, data) {
        data = data || {};
        analytic[event](data);
    }
    function placeHolderIe9() {
        if ($('html').hasClass('lte9')) {
            $('input[name="DateOfBirth"]').each(function () {
                var _this = $(this);
                _this.parent().append('<span class="date-placeholder__ie">' + _this.attr('placeholder') + '</span>');
            });
            $('input[placeholder]').focus(function () {
                var input = $(this);
                if (input.val() == input.attr('placeholder')) {
                    input.val('');
                    input.parent().removeClass('placeholder');
                }
            }).blur(function () {
                var input = $(this);
                if (input.val() == '' || input.val() == input.attr('placeholder')) {
                    input.parent().addClass('placeholder');
                    if (input.attr("name") == "DateOfBirth") {
                        input.val('');
                    } else {
                        input.val(input.attr('placeholder'));
                    }
                }
            }).blur();
            $('input[name="DateOfBirth"]').each(function () {
                var _this = $(this);
                if (_this.val() != '') {
                    _this.parent().removeClass('placeholder');
                }
            });
            $('input[placeholder]').parents('form').submit(function () {
                $(this).find('[placeholder]').each(function () {
                    var input = $(this);
                    if (input.val() == input.attr('placeholder')) {
                        input.val('');
                    }
                });
            });
        }
    }
    function init(container) {
        var otherBrand = $('#OtherBrand');
        var vehicleBrand = $('#VehicleBrand');
        var vehicleModel = $('#VehicleModel');
        
        var havingOtherBrand = true;
        var havingVehicleBrand = true;
        var havingVehicleModel = true;

        if (!vehicleModel || vehicleModel.length == 0) {
            havingVehicleModel = false;
        }

        if (!vehicleBrand || vehicleBrand.length == 0) {
            havingVehicleBrand = false;
        }

        if (!otherBrand || otherBrand.length == 0) {
            havingOtherBrand = false;
        }


        placeHolderIe9();
        initReCaptchar();
        if ($("#VehicleModel").length > 0 && $("#VehicleModel").val() == 0 && ($("#VehicleModel option") == null || $("#VehicleModel option").length <= 1))
            $("#VehicleModel").attr("data-disabled", true);
        if ($("#Finance_VehicleModel").length > 0 && $("#Finance_VehicleModel").val() == 0)
            $("#Finance_VehicleModel").attr("data-disabled", true);

        customSelectWrapper.init(container);

        if (havingOtherBrand) {
            otherBrand.on('change', function () {
                var otherBrandValue = $(this).val();
                if (otherBrandValue && otherBrandValue.trim().length > 0) {
                    if (havingVehicleBrand) {
                        vehicleBrand.val('');
                        vehicleBrand.trigger('change');
                        customSelectWrapper.updateSelect(vehicleBrand);
                    }
                }
            });
        }

        if ($("#VehicleBrand").length > 0)
            $("#VehicleBrand").change(function () {
                if ($("#VehicleBrand").val() != "") {
                    var CountryOptions = {};
                    CountryOptions.url = "/FinanceAndInsurance/VehicleModel";
                    CountryOptions.type = "POST";
                    CountryOptions.data = { BrandId: $("#VehicleBrand").val(), lang: $('html').attr('lang') };
                    CountryOptions.success = function (StatesList) {
                        $("#VehicleModel").empty();
                        $("#VehicleModel").append("<option value=\"\">" + modelText + "</option>");
                        for (var i = 0; i < StatesList.length; i++) {
                            if (StatesList[i].Text != null)
                                $("#VehicleModel").append("<option value=\"" + StatesList[i].Value.ID + "\">" + StatesList[i].Text + "</option>");
                        }
                        $("#VehicleModel").attr("data-disabled", false);

                        customSelectWrapper.updateSelect($("#VehicleModel"));
                    };
                    CountryOptions.error = function (err) {
                        alert(err);
                    };
                    $.ajax(CountryOptions);

                    // Clear other brand
                    if (havingOtherBrand) {
                        otherBrand.val('');
                    }
                }
                else {
                    $("#VehicleModel").empty();
                    $("#VehicleModel").append("<option value=\"\">" + modelText + "</option>");
                    $("#VehicleModel").attr("data-disabled", true);
                    customSelectWrapper.updateSelect($("#VehicleModel"));
                }
            });

        if ($("#Finance_VehicleBrand").length > 0)
            $("#Finance_VehicleBrand").change(function () {
                if ($("#Finance_VehicleBrand").val() != "") {
                    var CountryOptions = {};
                    CountryOptions.url = "/FinanceAndInsurance/VehicleModel";
                    CountryOptions.type = "POST";
                    CountryOptions.data = { BrandId: $("#Finance_VehicleBrand").val(), lang: $('html').attr('lang') };
                    CountryOptions.success = function (StatesList) {
                        $("#Finance_VehicleModel").empty();
                        $("#Finance_VehicleModel").append("<option value=\"\">" + modelText + "</option>");
                        for (var i = 0; i < StatesList.length; i++) {
                            if (StatesList[i].Text != null)
                                $("#Finance_VehicleModel").append("<option value=\"" + StatesList[i].Value.ID + "\">" + StatesList[i].Text + "</option>");
                        }
                        $("#Finance_VehicleModel").attr("data-disabled", false);
                        customSelectWrapper.updateSelect($("#Finance_VehicleModel"));
                    };
                    CountryOptions.error = function (err) {
                        alert(err);
                    };
                    $.ajax(CountryOptions);
                }
                else {
                    $("#Finance_VehicleModel").empty();
                    $("#Finance_VehicleModel").append("<option value=\"\">" + modelText + "</option>");
                    $("#Finance_VehicleModel").attr("data-disabled", true);
                    customSelectWrapper.updateSelect($("#Finance_VehicleModel"));
                }
            });
        function htmlEscape(str) {
            return String(str)
                    .replace(/&/g, '&amp;')
                    .replace(/"/g, '&quot;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
        }
        (function ($) {

            $.each($.validator.methods, function (key, value) {
                $.validator.methods[key] = function () {
                    if (arguments.length > 0) {
                        var el = $(arguments[1]);
                        el.val(htmlEscape($.trim(el.val())));
                    }

                    return value.apply(this, arguments);
                };
            });
        }(jQuery));

        var validatorRule = {
            Email: {
                required: true,
                email: true
            },
            Tel: {
                required: true,
                digits: true
            },
            Miles: {
                required: true,
                digits: true
            },
            VehicleType: {
                required: true
            },
            DrivingExperience: {
                required: true
            },
            RegistrationNumber: {
                required: true,
                //digits: true
                alphanumeric: true
            },
            VehicleValue: {
                required: true,
                digits: true
            },
            DateOfBirth: {
                required: true,
                date: true
            },
            hiddenRecaptcha: {
                required: function () {
                    if (window.reCaptchaIsReady && grecaptcha.getResponse(recaptcha1) == '') {
                        if ($("#recaptcha1").children("span.messagefillCapcha").length == 0)
                            $("#recaptcha1").append("<span class=\"messagefillCapcha\" style=\"color: red\">Fill the Captcha</span>");
                        return true;
                    } else {
                        $("span.messagefillCapcha").remove();
                        return false;
                    }
                }
            }
            , hiddenRecaptcha2: {
                required: function () {
                    if (window.reCaptchaIsReady && grecaptcha.getResponse(recaptcha2) == '') {
                        if ($("#recaptcha2").children("span.messagefillCapcha").length == 0)
                            $("#recaptcha2").append("<span class=\"messagefillCapcha\" style=\"color: red\">Fill the Captcha</span>");
                        return true;
                    } else {
                        $("span.messagefillCapcha").remove();
                        return false;
                    }
                }
            }
        };


        if (!havingOtherBrand) {
            validatorRule = _.extend(validatorRule, {
                VehicleBrand: {
                    required: true
                },
                VehicleModel: {
                    required: true
                }
            });
        }

        
        validator.setDefaults({
            ignore: '*:not([name]), .input-hidden', //Fixes your name issue
            onkeyup: false,
            debug: true,
            onfocusout: function (element) {
                if ($(element).valid()) {
                    $(element).removeClass("invalid");
                    if ($(element).is('select')) {
                        $(element).parent().children('.selected-label').removeClass("invalid");
                    }
                }
            },
            focusInvalid: false,
            highlight: function (element, errorClass) {
                $(element).addClass("invalid");
                if ($(element).is('select')) {
                    $(element).parent().children('.selected-label').addClass("invalid");
                }
            },
            errorPlacement: function (error, element) {
                return true;
            },
            rules: validatorRule,
            submitHandler: function (form) {
                var id = $(form).attr('id');
                var event = '';
                var data = {};

                if (havingOtherBrand) {
                    var valueOtherBrand = otherBrand.val().trim();
                    if (!valueOtherBrand || valueOtherBrand.length == 0) {
                        var isValid = true;
                        if (havingVehicleBrand) {
                            var valueVehicleBrand = vehicleBrand.val();
                            if (!valueVehicleBrand || valueVehicleBrand.length == 0) {
                                vehicleBrand.addClass('invalid');
                                isValid = false;
                            }
                            else {
                                vehicleBrand.removeClass('invalid');
                            }
                        }
                        if (havingVehicleModel) {
                            var valueVehicleBrand = vehicleBrand.val();
                            if (!valueVehicleBrand || valueVehicleBrand.length == 0) {
                                vehicleBrand.addClass('invalid');
                                isValid = false;
                            }
                            else {
                                vehicleBrand.removeClass('invalid');
                            }
                        }

                        if (!isValid)
                            return false;
                    }
                }

                switch (id) {
                    case 'RenewInsuranceForm':
                        event = 'renew-insurance';
                        data = {
                            'brand': $(form).find('#VehicleBrand option:selected').text(),
                            'make': $(form).find('#VehicleModel option:selected').text()
                        };
                        break;
                    case 'FinanceAndInsuranceForm':
                        event = 'renew-finance';
                        data = {
                            'brand': $(form).find('#Finance_VehicleBrand option:selected').text(),
                            'make': $(form).find('#Finance_VehicleModel option:selected').text()
                        };
                        break;
                    case 'ContactUsForm':
                        event = 'send-enquiry';
                        var selectedEnquiryType = $(form).find('#Enquiry_Type').val();
                        if (selectedEnquiryType == 'Vehicle Enquiry') {
                            data = {
                                'brand': $(form).find('select[name="brandId"] option:selected').text()
                            };
                        }
                        break;
                    case 'BookServicesForm':
                        event = 'book-service';
                        data = {
                            'brand': $(form).find('#VehicleBrand option:selected').text(),
                            'make': $(form).find('#VehicleModel option:selected').text(),
                            'year': $(form).find('select[name="ModelYear"] option:selected').text(),
                            'branch': $(form).find('#Branches option:selected').text()
                        };
                        break;
                    case 'BookTestDriveForm':
                        event = 'book-test-drive';
                        data = {
                            'brand': $(form).find('#VehicleBrand option:selected').text(),
                            'make': $(form).find('#VehicleModel option:selected').text(),
                            'branch': $(form).find('#Branches option:selected').text()
                        };
                        break;
                }

                if (event && event.length > 0) {
                    addGoogleTagManager(event, data);
                }

                var inputs = $(form).find('input');
                var textareas = $(form).find('textarea');
                if (inputs != null && inputs.length > 0) {
                    for (var i = 0; i < inputs.length; i++) {
                        var encodeValue = _.escape(inputs.eq(i).val());
                        inputs.eq(i).val(encodeValue);
                    }
                }
                if (textareas != null && textareas.length > 0) {
                    for (var i = 0; i < textareas.length; i++) {
                        var encodeValue = _.escape(textareas.eq(i).val());
                        textareas.eq(i).val(encodeValue);
                    }
                }

                $(form)[0].submit();
            },

            invalidHandler: function (event, validator) {
                //if ($('html').hasClass('lte9')) {
                //	$('input[placeholder]').each(function () {
                //		if ($(this).attr("name") != "DateOfBirth") {
                //			$(this).focus();
                //		}
                //	});
                //}
                animate($('body'), 'scroll', { offset: $(validator.errorList[0].element).offset().top - 60, duration: 500, easing: "easeInOutQuad" });
            }
        });



        $("#RenewInsuranceForm").validate({
            onfocusout: function (element) {
                if ($(element).valid()) {
                    $(element).removeClass("invalid");
                    if ($(element).is('select')) {
                        $(element).parent().children('.selected-label').removeClass("invalid");
                    }
                }
            }
        });

        $("#FinanceAndInsuranceForm").validate({
            onfocusout: function (element) {
                if ($(element).valid()) {
                    $(element).removeClass("invalid");
                    if ($(element).is('select')) {
                        $(element).parent().children('.selected-label').removeClass("invalid");
                    }
                }
            }
        });
        $("#BookTestDriveForm").validate({
            onfocusout: function (element) {
                if ($(element).valid()) {
                    $(element).removeClass("invalid");
                    if ($(element).is('select')) {
                        $(element).parent().children('.selected-label').removeClass("invalid");
                    }
                }
            }
        });

        $("#BookServicesForm").validate({
            onfocusout: function (element) {
                if ($(element).valid()) {
                    $(element).removeClass("invalid");
                    if ($(element).is('select')) {
                        $(element).parent().children('.selected-label').removeClass("invalid");
                    }
                }
            }
        });
        $("#ContactUsForm").validate({
            ignore: ".input-hidden textarea",
            onfocusout: function (element) {
                if ($(element).valid()) {
                    $(element).removeClass("invalid");
                    if ($(element).is('select')) {
                        $(element).parent().children('.selected-label').removeClass("invalid");
                    }
                }
            }
        });
        function isExternal(url) {
            var match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
            if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) return true;
            if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":(" + { "http:": 80, "https:": 443 }[location.protocol] + ")?$"), "") !== location.host) return true;
            return false;
        }
        //$("#button-done-submit").on("click", function() {
        //    //var previousLink = window.history.go(-2);
        //    //if (isExternal(previousLink))
        //        window.Location.href = "/";
        //    //else {
        //    //    window.history.go(-2);
        //    //}


        //});

    }
    function preProcess() {
        modelText = $('#selectModelTextHiddenField').val();
    }

    return {
        init: function (container) {
            preProcess();
            init(container);
        }
    };
});