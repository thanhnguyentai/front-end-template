define(['jquery', 'vendor/jquery.validate', 'vendor/jquery.validate.additional'], function ($) {

    'use strict';

    var removeStyleInvalid = function (element) {
        $(element).removeClass("invalid");
        if ($(element).is('select')) {
            $(element).parent().children('.selected-label').removeClass("invalid");
        }
    };

	$.extend($.validator.messages, {
		accept: "Please choose a valid file.",
		extension: "Please choose a valid file."
	});

	$.validator.addMethod("email", function(val, el) {

	    if (val.length == 0) {
	    	return true;
	    }

		return this.optional(el) || /^[\S]{1,}@[\S]{1,}\.[\S]{1,}$/ig.test(val);
	}, 'Please enter a valid email address.');

	$.validator.addMethod("url", function(val, el) {

	    if (val.length == 0) {
	    	return true;
	    }

	    if(!(/^(https?|s?ftp):\/\//i.test(val))) {
	        val = 'http://'+val;
	    }

	   	var valid = this.optional(el) || /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/ig.test(val);

		if(valid) {
			$(el).val(val);
		}

		return valid;
	}, 'Please enter a valid URL.');

	$.validator.addMethod("phone", function (val, el) {

		if(val.length == 0) {
			return true;
		}

		return this.optional(el) || /^[+]?([()]?[0-9][()]?\s?)+([()]?[0-9][()]?)$/gm.test(val);
		//return this.optional(el) || /^\S*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\S*$/gm.test(val);
	}, 'Please enter a valid phone number.');

	$.validator.addMethod("require-at-least", function (val, el) {
	    var linkedElement = $(el).attr('data-linked-element');

	    if (!linkedElement || linkedElement.length == 0) {
	        if (val && val.trim().length > 0) {
	            removeStyleInvalid(el);
	            return true;
	        }
	        else {
	            return false;
	        }
	    }

	    // Check the linked element
	    if (!val || val.trim().length == 0) {
	        linkedElement = $('#' + linkedElement);
	        var linkedElementValue = linkedElement.val();
	        if (!linkedElementValue || linkedElementValue.trim().length == 0)
	            return false;
	    }
	    
	    removeStyleInvalid(el);
	    return true;

	}, 'This field is required.');

	$.validator.addMethod("require-if-other", function (val, el) {
	    var dependedElement = $(el).attr('data-depended-element');

	    if (!dependedElement || dependedElement.length == 0) {
	        removeStyleInvalid(el);
	        return true;
	    }

	    // Check the linked element
	    if (!val || val.trim().length == 0) {
	        dependedElement = $('#' + dependedElement);
	        var dependedElementValue = dependedElement.val();
	        if (dependedElementValue && dependedElementValue.trim().length > 0) {
	            return false;
	        }
	    }

	    removeStyleInvalid(el);
	    return true;

	}, 'Please fill this field.');

	return $.validator;
});
