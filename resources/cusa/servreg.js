var ServiceRequest = (function($){

    var firtTimeStep2 = true;
    var firtTimeStep3 = true;

    // Constructs a shipping address to be used to display on the confirmation page
    var _getShippingAddress = function() {
        var fullAddress = '<h5>' + $('#ship-firstname').val() + ' ' + $('#ship-lastname').val() + '</h5><p class="no-margin-bottom no-padding-top no-padding-bottom">' + $('#ship-address').val() + '</p>';
        if ($('#ship-suite').val() !== '') {
            fullAddress += '<p class="no-margin-bottom no-padding-top no-padding-bottom">' + $('#ship-suite').val() + '</p>';
        }
        fullAddress += '<p class="no-margin-bottom no-padding-top no-padding-bottom">' + $('#ship-city').val() + ', ' + $('#ship-state').val() + ' ' + $('#ship-zip').val() + '</p><p class="no-margin-bottom no-padding-top no-padding-bottom">United States</p>';
        return $(fullAddress);
    };

    // Constructs a billing address to be used to display on the confirmation page
    var _getBillingAddress = function() {
        var fullAddress = '<h5>' + $('#bill-firstname').val() + ' ' + $('#bill-lastname').val() + '</h5><p class="no-margin-bottom no-padding-top no-padding-bottom">' + $('#bill-address').val() + '</p>';
        if ($('#bill-suite').val() !== '') {
            fullAddress += '<p class="no-margin-bottom no-padding-top no-padding-bottom">' + $('#bill-suite').val() + '</p>';
        }
        fullAddress += '<p class="no-margin-bottom no-padding-top no-padding-bottom">' + $('#bill-city').val() + ', ' + $('#bill-state').val() + ' ' + $('#bill-zip').val() + '</p><p class="no-margin-bottom no-padding-top no-padding-bottom">United States</p>';
        return $(fullAddress);
    };
    // enables the tabs before the current one
    var enableTab = function(tabId) {
        $("#" + tabId).css("pointer-events", "");
        $("#" + tabId).css("cursor", "");
        $("#" + tabId).closest("div").css("pointer-events","");
        $("#" + tabId).closest("div").css("cursor","pointer");
    };
    // disables the tabs after the  current one
    var disableTab = function(tabId) {
        $("#" + tabId).css("pointer-events", "none");
        $("#" + tabId).closest("div").css("pointer-events","none");
        $("#" + tabId).closest("div").css("cursor","default");
        $("#" + tabId).css("cursor", "default");
    };

    var showBillingAndCreditCardForms = function() {

        var amountDue = $("#model-summary-cost-estimate").attr('data-cost');
        if (amountDue > 0) {
            return true;
        } else {
            return false;
        }

    };

    // Tab validation function. Each tab has its own validation rules
    var validateTab = function(tabNumber) {
        var tabValid = true;

        if (tabNumber == 1) {
            if ($('#model-summary-service-type').attr('data-service-code') == null || $('#model-summary-service-type').attr('data-service-code') === '- - - - - -') {
                tabValid = false;
            }
        } else if (tabNumber == 2) {
            var comment = $('#comments').val();

            if ($('#model-summary-service-type').attr('data-service-code') === 'R' && !$("input[name='reason']").is(":checked") && (comment.match('^Please do not enter your credit card information here') || comment === '')) {
                tabValid = false;
            }

        } else if (tabNumber == 3) {

            var location = $('#model-summary-service-location').text();

            if (location === '' || location ===  '- - - - - -') {
                tabValid = false;
            }

        } else if (tabNumber == 4) {

            //this calls validate the full address inputs against the web service, then it populates the suggested texts in each of the input's data atributtes.
            populateValidatedFullAddress(validateAddressUrl, ["ship-address", "ship-suite", 'ship-city', "ship-state", "ship-zip"]);

            var shippingValidationOptions = $.extend(
                {},
                formValidationDefaults,
                {
                    rules: {
                        "ship-firstname" : {
                            required : true,
                            lettersOnly : true
                        },
                        "ship-lastname" : {
                            required : true,
                            lettersOnly : true
                        },
                        "ship-email1" : {
                            required: true,
                            emailFormat: true
                        },
                        "ship-email2" : {
                            required: true,
                            emailFormat: true,
                            equalTo: "#ship-email1"
                        },
                        "ship-address" : {
                            required: true,
                            validateStreetAddress: true
                        },
                        "ship-city" : {
                            required : true,
                            lettersOnly : true,
                            validateCity: true
                        },
                        'state' : {
                            selectRequired : true,
                            validateState: true
                        },
                        "ship-zip" : {
                            required: true,
                            validateZipCode: true

                        },
                        'phoneType' : {
                            selectRequired : true
                        },
                        'ship-phone': {
                            required: true,
                            phoneUS: true
                        }
                    },
                    ignore : []
                });

            var billingValidationOptions = $.extend(
                {},
                formValidationDefaults,
                {
                    rules: {
                        'bill-firstname' :  {
                            required : true,
                            lettersOnly : true
                        },
                        'bill-lastname' :  {
                            required : true,
                            lettersOnly : true
                        },
                        'bill-address' : {
                            required : true,
                            validateStreetAddress: true
                        },
                        'bill-city' :  {
                            required : true,
                            lettersOnly : true,
                            validateCity: true
                        },
                        'state' : {
                            selectRequired : true,
                            validateState: true
                        },
                        'bill-zip' : {
                            required: true,
                            validateZipCode: true
                        }
                    },
                    ignore : []
                });

            tabValid = $("#shipping-form").validate(shippingValidationOptions).form();

            if ($('#chk-same').is(':visible') && !$('#chk-same').is(':checked')) {
                populateValidatedFullAddress(validateAddressUrl, ["bill-address", "bill-suite", "bill-city", "bill-state", "bill-zip"]);
                tabValid = tabValid && $("#billing-form").validate(billingValidationOptions).form();
            }

            if ($('#chk-create-account').is(':checked')) {

                $("#service-request-create-account").validate().settings.rules = {
                    'acct-email' : {
                        required : true,
                        emailFormat: true,
                        checkEmailAddress : [checkEmailUrl]
                    },
                    'acct-password' : {
                        required: true,
                        passwordFormat : true
                    },
                    'acct-password2' : {
                        required: true,
                        equalTo: '#acct-password'
                    }
                };

                tabValid = tabValid && $("#service-request-create-account").validate().form();
            }

            return tabValid;

        }

        if (!tabValid) {
            $(window).scrollTop(0);
        }

        return tabValid;
    };

    var _getDisclaimer = function(tabnumber) {


        var disclaimer = '';
        if (tabnumber == 1) {
            if ($("ul.servicePills").data("maintenance-flag") === 'Y') {
                disclaimer = discTab1;
            }
        } else if (tabnumber == 3) {
            disclaimer = discTab3;
        } else if (tabnumber == 4) {
            disclaimer = discTab4;
        } else if (tabnumber == 5) {
            if ($("ul.servicePills").data("warranty-flag") == false) {
                disclaimer = discTab5;
            }
        } else if (tabnumber == 6) {
            disclaimer = discConfirmation;
        }

        $('#disclaimerDesc').html(disclaimer);

        if (disclaimer !== '') {
            $('#additional-disclaimer').show();
            $('#model-summary-disclaimer').show();
        } else {
            $('#additional-disclaimer').hide();
            $('#model-summary-disclaimer').hide();
        }
    };

    var _displayServices = function(data, movingForward) {
        $('#wizard-header').show();
        $('#wizard-breadcrumbs').show();

        $("#btn-continue").attr('disabled', false).addClass('cbtn-canon-red').removeClass('cbtn-light-gray-1 disabled');
        $('#services-tab-panel').html(data.html).show();

        var $parentList = $("ul.servicePills");

        repairOrder.model.itemCode = $parentList.data("mercury-code");
        repairOrder.flatRateFlag = $parentList.data("flat-rate-flag");
        repairOrder.maintenanceFlag = $parentList.data("maintenance-flag");
        repairOrder.warrantyFlag = $parentList.data("warranty-flag");

        _getDisclaimer(1);

        if (!movingForward) {
            var selectedType = $('#model-summary-service-type').text();

            $.each($('ul.servicePills li'), function(i, item) {
                if ($(item).find('.service-type').text() === selectedType) {
                    $(item).click();
                    $(item).find('input[name="serviceType"]').prop("checked", true);
                }
            });
        } else {
            $('#model-summary-service-type').text('- - - - - -');
            $('#model-summary-cost-estimate').text('- - - - - -');

            if (data.serviceCount === 1) {
                var $onlyItem = $('ul.servicePills li');
                $onlyItem.click();
                $onlyItem.find('input[name="serviceType"]').prop("checked", true);
            }
        }
    };

    // Tab initialization function. Each tab can perform some specific actions to initialize itself
    var initializeTab = function(tabNumber, movingForward) {

        $('#btn-continue').html("Continue");

        _getDisclaimer(tabNumber);
        if (tabNumber == 1) {
            var modelId = $('#modelId1').val();

            // Get extended model info from WCM
            $.ajax({
                url: getWcmProductDetailUrl,
                type: 'POST',
                datatype:'json',
                async: false,
                data: { models : modelId }
            }).done(function(data) {
                if (data && data.items && data.items.length > 0) {
                    var results = data.items;
                    var wcmResult = results[0].productOverviewItem;
                    var sqsId = wcmResult.sqsid;
                    if (sqsId) {
                        $('#model-summary-model-name').attr('data-sqs-id', sqsId);
                    }

                    if ($('#devicetype-mobile').is(':visible')) {
                        $('#model-summary-image').attr('src', WCM_BASE_URL + wcmResult.small_thumbnailImageUrl).attr('alt', wcmResult.name).attr('title', wcmResult.name);
                    } else if ($('#devicetype-tablet').is(':visible')) {
                        $('#model-summary-image').attr('src', WCM_BASE_URL + wcmResult.medium_thumbnailImageUrl).attr('alt', wcmResult.name).attr('title', wcmResult.name);
                    } else {
                        $('#model-summary-image').attr('src', WCM_BASE_URL + wcmResult.large_thumbnailImageUrl).attr('alt', wcmResult.name).attr('title', wcmResult.name);
                    }

                } else {
                    $('#model-summary-image').attr('src', genericImageUrl);
                }
            }).fail(function(){
                $('#model-summary-image').attr('src', genericImageUrl);
            });

            $('#messagetemplates-service-locations').hide();
            $('#messagetemplates-data').html('');

            // Get the available repair services, if any
            var idToUse = $('#model-summary-model-name').attr('data-sqs-id');
            if (!$.isNumeric(idToUse)) {
                idToUse = modelId;
            }

            $.ajax({
                url: getRepairServicesUrl,
                type: 'POST',
                datatype:'json',
                async: false,
                data: {"modelId" : idToUse, "purchaseDate" : $("#model-summary-purchase-date").text(), "carepak" : $('#carepak').val()},
            }).done(function(data) {
                if (data.serviceCount > 0) {
                    _displayServices(data, movingForward);
                } else {

                    $('#services-tab-panel').hide();
                    $('#wizard-header').hide();
                    $('#wizard-breadcrumbs').hide();

                    // Get the correct message to display
                    $.ajax({
                        url: getWcmRepairMessageUrl,
                        type: 'POST',
                        datatype:'json',
                        data: {"model" : modelId},
                    }).always(function(data) {

                        $('#model-summary-service-type').text('');
                        $('#model-summary-cost-estimate').text('');
                        $("#btn-continue").attr('disabled', true).addClass('cbtn-light-gray-1 disabled').removeClass('cbtn-canon-red');

                        var fetchLocations = true;
                        if (data && data.items && data.items.length > 0) {
                            $('#services-tab-panel').html($('<div/>').html(data.items[0].message).text()).show();
                            if (data.items[0].displayLocation && data.items[0].displayLocation.toLowerCase() === 'false') {
                                fetchLocations = false;
                            }
                        }

                        $('#messagetemplates-data').html('');
                        $('#messagetemplates-service-locations').hide();

                        if (fetchLocations) {

                            $.ajax({
                                url: getServiceLocationsUrl,
                                type: 'POST',
                                datatype:'json',
                                data: {"modelId" : $('#modelId1').val(), "zipcode" : $('#zipcode').val(), "sqsModelId" : idToUse}
                            }).done(function(data) {
                                var listData = "";

                                var repairLocationTemplate = $('#tmpl-service-location').html();
                                Mustache.parse(repairLocationTemplate);

                                var locationsAsObjects = [];

                                $.each($(data).find("repairLocation"), function(i, loc) {
                                    var locationJson = {};

                                    locationJson.uid = $(loc).find('id').text();
                                    locationJson.city = $(loc).find('city').text();
                                    locationJson.state = $(loc).find('state').text();
                                    locationJson.name = $(loc).find('name').text();
                                    locationJson.address1 = $(loc).find('address1').text();
                                    locationJson.zip = $(loc).find('zip').text();
                                    locationJson.importantInfo = $(loc).find('importantInfo').text();
                                    locationJson.telephone = $(loc).find('telephone').text();
                                    locationJson.distance = $(loc).find('distance').text();
                                    locationJson.geoCoordinate = {};
                                    locationJson.geoCoordinate.latitude = $(loc).find('latitude').text();
                                    locationJson.geoCoordinate.longitude = $(loc).find('longitude').text();

                                    var indPps = $(loc).find('indPps').text();

                                    if (indPps == '' || indPps == '0') {
                                        locationJson.indPps = '';
                                    } else {
                                        locationJson.indPps = '1';
                                    }

                                    locationsAsObjects.push(locationJson);
                                });

                                if (locationsAsObjects.length > 0) {
                                    var showImportantInfoColumn = true;
                                    var showLogoColumn = false;
                                    $.each(locationsAsObjects, function(i, location) {

                                        location.index = i + 1;
                                        location.offset = i;

                                        if (location.importantInfo == '') {
                                            showImportantInfoColumn = false;
                                        }

                                        if (location.indPps == '1') {
                                            showLogoColumn = true;
                                        }

                                        listData += Mustache.render(repairLocationTemplate, location);
                                    });

                                    $('#messagetemplates-data').html(listData);
                                    $('#messagetemplates-service-locations').show();

                                    if (showLogoColumn == false) {
                                        $('.msl-logo').hide();
                                        $('.msl-name').removeClass('col-md-2').addClass('col-md-4');
                                    } else {
                                        $('.msl-logo').show();
                                        $('.msl-name').removeClass('col-md-4').addClass('col-md-2');
                                    }

                                    if (showImportantInfoColumn == false) {
                                        $('#msl-important-info').hide();
                                        $('.msl-address').removeClass('col-md-2').addClass('col-md-4');
                                    } else {
                                        $('#msl-important-info').show();
                                        $('.msl-address').removeClass('col-md-4').addClass('col-md-2');
                                    };
                                }
                            });
                        }
                    });
                }
            }).fail(function (data, textStatus) {
            });

            enableTab("tab1");
        } else if (tabNumber == 2) {
            enableTab("tab2");
            if (movingForward && firtTimeStep2) {
                $('input[type="checkbox"][name="reason"]').removeAttr('checked');
                $('input[type="checkbox"][name="accessory"]').removeAttr('checked');
                $('#comments').val('Please do not enter your credit card information here. If credit card information is required, you will be prompted to enter your information in the Billing/Cardholder Information page.');
                firtTimeStep2 = false;
            }

            var maxCount = $("textarea").attr("maxlength");
            $("#maxChar").text(maxCount);
            $("#comments").limiter(maxCount, $("#remainChar"));

        } else if (tabNumber == 3) {

            enableTab("tab3");
            if (movingForward && firtTimeStep3) {
                var idToUse = $('#model-summary-model-name').attr('data-sqs-id');
                if (!idToUse) {
                    idToUse = $('#model-summary-model-name').attr('data-model-id');
                }
                $.ajax({
                    url: getRepairLocationsUrl,
                    type: 'POST',
                    datatype:'json',
                    data: {"modelId" : idToUse, "zipCode" : $('#model-summary-model-name').data('zip-code')},
                }).done(function(data) {
                    var listData = "";

                    //hide the button find services location
                    $('#findServiceLocationButton').hide();

                    serviceCenterCount = $(data).find('repairLocation').size();
                    $('#location-count').html(serviceCenterCount);

                    var repairLocationTemplate = $('#tmpl-repair-location').html();
                    Mustache.parse(repairLocationTemplate);

                    var locationsAsObjects = [];

                    $.each($(data).find("repairLocation"), function(i, loc) {
                        var locationJson = {};

                        locationJson.uid = $(loc).find('id').text();
                        locationJson.city = $(loc).find('city').text();
                        locationJson.state = $(loc).find('state').text();
                        locationJson.name = $(loc).find('name').text();
                        locationJson.address1 = $(loc).find('address1').text();
                        locationJson.zip = $(loc).find('zip').text();
                        locationJson.importantInfo = $(loc).find('importantInfo').text();
                        locationJson.telephone = $(loc).find('telephone').text();
                        locationJson.distance = $(loc).find('distance').text();
                        locationJson.geoCoordinate = {};
                        locationJson.geoCoordinate.latitude = $(loc).find('latitude').text();
                        locationJson.geoCoordinate.longitude = $(loc).find('longitude').text();

                        locationsAsObjects.push(locationJson);
                    });

                    $.each(locationsAsObjects, function(i, location) {
                        if (i == 0) {
                            location.collapse = 'in';
                            location.active = 'active';
                        }
                        location.index = i + 1;
                        location.offset = i;
                        if(i>0){
                            location.isCollapsed = false;
                        }
                        else{
                            location.isCollapsed = true;
                        }

                        listData += Mustache.render(repairLocationTemplate, location);
                    });

                    $('#section').html(listData);

                    ServiceRequestHandlers.addMapRepairLocationHandlers(serviceCenterCount);

                    $('#findserviceloc').hide();
                    $('#find-result').show();

                }).fail(function (data, textStatus) {
                    alert('error retrieving repair locations');
                });
                firtTimeStep3 = false;
            }
        } else if (tabNumber == 4) {

            enableTab("tab4");
            $('#wizard-tab5-estimated-repair-cost').text($('#model-summary-cost-estimate').text());
            if ($('#model-summary-cost-estimate').data('cost') >= 0) {
                $('div.has-cost').show();
                $("#wizard-tab5-estimated-sales-tax").text(_getSalesTax());
            } else {
                $('div.has-cost').hide();
            }
        } else if (tabNumber == 5) {

            enableTab("tab5");
            $('#btn-continue').html("Submit");

            $('#ship-address-summary').empty();
            $('#bill-address-summary').empty();

            $('#ship-address-summary').append(_getShippingAddress());

            if ($('#chk-same').is(':checked')) {
                $('#bill-address-summary').append(_getShippingAddress());
            } else {
                $('#bill-address-summary').append(_getBillingAddress());
            }

            if (ServiceRequest.showBillingAndCreditCardForms() == true)	{
                var callbackUrl = Utils.getVirtualPortalRoot() + '/home/support/tcepps';

                $.ajax({
                    url: getTceppsInfoUrl,
                    type: 'POST',
                    datatype:'xml',
                    data: {"amount" : _calculateTotalCost().replace(/[$.]/g,''), "callbackUrl" : callbackUrl}
                }).done(function(data) {

                    $('#cc-app, #ccp-app').val(data.tcepssApp);
                    $('#cc-token, #ccp-token').val(data.tceppsToken);
                    $('#cc-sign, #ccp-sign').val(data.tceppsSign);
                    $('#cc-encryptedRequest, #ccp-encryptedRequest').val(data.tceppsEncryptedRequest);
                    $('#cc-encryptedRequestKey, #ccp-encryptedRequestKey').val(data.tceppsEncryptedRequestkey);

                    var tcepps = document.forms["tcepps"];

                    getCreditCardForm(tcepps);

                }).fail(function (data, textStatus) {
                    alert('error retrieving tcepss info');
                });
            }
        }

        $(window).scrollTop(0);
    };

    var _getSalesTax = function() {
        var repairServiceInfo = {
            zipcode: $("#zipcode").val(),
            repairServiceName : $("#model-summary-service-type").text(),
            repairServicePrice: repairOrder.serviceAmount + repairOrder.shipmentAmount
        };
        return  $.ajax({
            url: getSalesTaxUrl,
            type: "POST",
            datatype:"XML",
            data: {repairServiceInfo: JSON.stringify(repairServiceInfo)},
        }).success(function(data) {
            $("#wizard-tab5-estimated-sales-tax").text("$" + $(data).find("TotalTax").text());
            var total = _calculateTotalCost();
            $('#wizard-tab5-estimated-total').text(total);
            $('#model-summary-cost-estimate').text(total);
        }).fail(function (data, textStatus) {
            alert("Error retrieving repair service sales tax");
        });
    };

    var _calculateTotalCost = function() {

        var repairCost = Number($('#model-summary-cost-estimate').attr('data-cost').replace(/[^0-9\.-]+/g,""));
        if (repairCost < 0) {
            repairCost = 0;
        }
        var shipping = Number($('#wizard-tab5-estimated-shipping').text().replace(/[^0-9\.]+/g,""));
        var tax = Number($('#wizard-tab5-estimated-sales-tax').text().replace(/[^0-9\.]+/g,""));
        var totalCost = repairCost + shipping + tax;

        $('#wizard-tab5-estimated-repair-cost').text("$" + repairCost.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,"));
        $('#wizard-tab5-estimated-shipping').text("$" + shipping.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,"));
        $('#wizard-tab5-estimated-sales-tax').text("$" + tax.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,"));

        return "$" + totalCost.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    };

    var _initializeConfirmationTab = function() {

        if ($('#conf-issues li').length == 0) {
            $('#conf-issues').append($('<li>', { html: 'N/A'}));
        }
        //remove the Symptoms bullets
        $('#conf-issues li').css('list-style-type', 'none');

        //add N/A
        if($('#conf-comments').text() == undefined || $('#conf-comments').text() == null || $('#conf-comments').text().trim() == ''){
            $('#conf-comments').html(confirmationEmpty);
        }

        //add N/A
        if($('#conf-accessories').text() == undefined || $('#conf-accessories').text() == null || $('#conf-accessories').text().trim() == ''){
            $('#conf-accessories').html(confirmationEmpty);
        }

        _getDisclaimer(6);

        $.ajax({
            url: getFedExLocationsUrl,
            type: 'POST',
            datatype:'json',
            data: {"streetLine" : $('#ship-address').val(), "city" : $('#ship-city').val(), "state" : $('#ship-state').val(), "zipCode" : $('#ship-zip').val()},
        }).done(function(data) {

            $('#fedex-locations').append($(data));

        }).fail(function (data, textStatus) {});

        $.ajax({
            url: sendEmailShippingLabelUrl,
            type: 'POST',
            data: _getEmailInfo()
        });
    };

    var _submit_getIssues = function() {
        var issuesList = [];
        $("input[name='reason']:checked").each(function() {
            issuesList.push($(this).val());
        });
        return issuesList;
    };

    var _submit_getAccessories = function() {
        var accessoriesList = [];
        $("input[name='accessory']:checked").each(function() {
            accessoriesList.push($(this).val());
        });
        return accessoriesList;
    };

    var _submit_getCreditCard = function(data){

        if ($('#tab5-no-warranty').is(':visible')) {
            return {
                cardType : $('#creditcardtype').val(),
                customerRefNum : data.customerRefNum
            };
        } else {
            return {
                cardType : '3',
                customerRefNum : ''
            };
        }
    };

    var _submit_getShippingAddress = function(){
        return {
            firstName : $("#ship-firstname").val(),
            lastName : $("#ship-lastname").val(),
            companyName : $("#ship-company").val(),
            address1 : $("#ship-address").val(),
            address2 : $("#ship-suite").val(),
            city : $("#ship-city").val(),
            state : $("#ship-state option:selected").val(),
            zipCode : $("#ship-zip").val(),
            phoneType : $("#ship-phone-type option:selected").val(),
            phoneNumber : $("#ship-phone").val()
        };
    };

    var _submit_getBillingAddress = function() {


        var addPrefix = "bill";


        if ($('#chk-same').is(':checked') || ServiceRequest.showBillingAndCreditCardForms() == false) {
            addPrefix = "ship";
        }

        return {
            firstName : $("#" + addPrefix + "-firstname").val(),
            lastName : $("#" + addPrefix + "-lastname").val(),
            companyName : $("#" + addPrefix + "-company").val(),
            address1 : $("#" + addPrefix + "-address").val(),
            address2 : $("#" + addPrefix + "-suite").val(),
            city : $("#" + addPrefix + "-city").val(),
            state : $("#" + addPrefix + "-state option:selected").val(),
            zipCode : $("#" + addPrefix + "-zip").val(),
        };
    };

    var _createAndSubmit = function(data) {

        repairOrder.emailAddress = $("#ship-email1").val();
        repairOrder.serialNumber = $("#serial").val();
        repairOrder.comments = $("#comments").val();

        if ($('#model-summary-cost-estimate').data('cost') >= 0) {
            repairOrder.estimateTotalAmt = $("#wizard-tab5-estimated-total").text().replace(/[^0-9\.]+/g, "");
            repairOrder.salesTaxAmount = $("#wizard-tab5-estimated-sales-tax").text().replace(/[^0-9\.]+/g, "");
        } else {
            repairOrder.estimateTotalAmt = 0;
            repairOrder.salesTaxAmount = 0;
        }
        filterPhoneNumberInputs('maskedphone');
        repairOrder.purchaseDate = $("#dateofpurchase").val();
        repairOrder.callingOptOutFlag = $("#automatedCallingOptOutCheckbox").is(':checked') ? "true" : "false";
        repairOrder.carepakNumber = $("#carepak").val();
        repairOrder.carepakFlag = $("#carepak").val() ? true : false;
        repairOrder.selectedServiceCenterId = $("#model-summary-service-location").data("uid");
        repairOrder.model.modelId = $("#modelId1").val();
        repairOrder.model.modelName = $("#modelName1").val();
        repairOrder.issues = _submit_getIssues();
        repairOrder.accessories = _submit_getAccessories();
        repairOrder.creditCard = _submit_getCreditCard(data);
        repairOrder.shippingAddress = _submit_getShippingAddress();
        repairOrder.billingAddress = _submit_getBillingAddress();
        repairOrder.flatRateFlag = repairOrder.flatRateFlag == "Y" ? true : false;
        repairOrder.maintenanceFlag = repairOrder.maintenanceFlag == "Y" ? true : false;

        if ($("#chk-create-account").is(":checked")) {
            repairOrder.accountInfo = {};
            repairOrder.accountInfo.email = $('#acct-userid').val();
            repairOrder.accountInfo.password = $('#acct-password').val();
        }

        $('#loadingModal').modal('show');

        $.ajax({
            url: submitRepairOrderUrl,
            type: "POST",
            data: {repairOrderJson : JSON.stringify(repairOrder)},
            dataType : "json"
        }).success(function(data) {
            $('#loadingModal').modal('hide');
            if (data.repairResult === '1') {
                $("#model-summary-repair-num").text(data.repairId);
                $('#wizard-breadcrumbs').hide();
                $('section[id^="wizard-tab"]').hide();
                $('#btn-row').hide();
                $('#wizard-header').hide();

                $('#conf-ship-address-summary').empty();
                $('#conf-bill-address-summary').empty();

                $('#conf-ship-address-summary').append(_getShippingAddress());

                if ($('#chk-same').is(':checked')) {
                    $('#conf-bill-address-summary').append(_getShippingAddress());
                } else {
                    $('#conf-bill-address-summary').append(_getBillingAddress());
                }

                var $accessories = $('#conf-accessories');
                var $issues = $('#conf-issues');

                $('input[name="accessory"]:checked').each(function(idx, acc) {
                    $accessories.append($('<h4>' + acc.value + '</h4>'));
                });

                $('input[name="reason"]:checked').each(function(idx, reason) {
                    $issues.append($('<li>' + reason.value + '</li>'));
                });

                if ($('#comments').val().indexOf('Please do not enter') === -1) {
                    $('#conf-comments').text($('#comments').val());
                }

                $('#conf-estimated-repair-cost').text($('#wizard-tab5-estimated-repair-cost').text());
                $('#conf-estimated-shipping').text($('#wizard-tab5-estimated-shipping').text());
                $('#conf-estimated-sales-tax').text($('#wizard-tab5-estimated-sales-tax').text());
                $('#conf-estimated-total').text($('#wizard-tab5-estimated-total').text());

                $('#model-summary-bar').clone().appendTo($('#conf-summary-bar'));
                $('#model-summary-bar').remove();

                if (data.accountResult === '1') {
                    $('#account-create-info').html($('<li>' + createAccountSuccess + '</li>'));
                } else {
                    $('#account-create-info').html('');
                }

                $('#account-create-row').show();

                $('#confirmation-tab').show();
                _initializeConfirmationTab();
                $(window).scrollTop(0);
            } else {
                $("[name='wizardErrorsList']").empty();
                $("[name='wizardErrorsDiv']").show();
                $("[name='wizardErrorsList']").append("<li>" + errSubmitFailed + "</li>");

                if (data.accountResult === '1') {
                    $("[name='wizardErrorsList']").append("<li>" + createAccountSuccess + "</li>");
                }
            }
        }).fail(function (data, textStatus) {
            $('#loadingModal').modal('hide');
            $("[name='wizardErrorsList']").empty();
            $("[name='wizardErrorsDiv']").show();
            $("[name='wizardErrorsList']").append("<li>" + errSubmitFailed + "</li>");
            $(window).scrollTop(0);
        }).always(function() {
            resetPhoneNumberMasks('maskedphone');
        });
    };

    var setTcepssError = function(error) {
        $("[name='wizardErrorsList']").empty();
        $("[name='wizardErrorsDiv']").show();
        $("[name='wizardErrorsList']").append("<li>" + errTcepps + "</li>");
    };

    var createRepairOrder = function(parameters) {

        if (parameters === undefined) {
            _createAndSubmit();
        } else {
            $.ajax({
                url: decryptTceppsResponseUrl,
                type: 'POST',
                datatype:'json',
                data: { 'encryptedResponse': parameters.tceppsEncryptedResponse, 'encryptionKey': parameters.tceppsEncryptedResponseKey },
            }).done(function(data) {

                if (data.validCC === 'N') {
                    setTcepssError('');
                    return;
                }

                var fullCardName = $('div.creditcardtype button[data-card-type="' + data.creditCardType + '"]').attr('data-card-type-string');

                $('#conf-payment-method').html(fullCardName + ' ' + data.creditCardNum);

                $('#creditcardtype').val(data.creditCardType);

                _createAndSubmit(data);

            }).fail(function (data, textStatus) {
                alert($(errSubmitFailed));
                $(window).scrollTop(0);
            });
        }
    };

    // Process the submit action at the end of the wizard
    var processSubmit = function() {

        if ($("#btn-continue").text() == "Submit") {

            var addressToUse = _submit_getBillingAddress();

            if ($('#tab5-no-warranty').is(':visible')) {
                $('#ccp-firstName').val(addressToUse.firstName.substring(0,14));
                $('#ccp-lastName').val(addressToUse.lastName.substring(0,14));
                $('#ccp-companyName').val(addressToUse.companyName);
                $('#ccp-address1').val(addressToUse.address1);
                $('#ccp-address2').val(addressToUse.address2);
                $('#ccp-city').val(addressToUse.city);
                $('#ccp-state').val(addressToUse.state);
                var formattedZip = addressToUse.zipCode;
                if(formattedZip.indexOf('-') != -1){
                    var zipArr = formattedZip.split('-');
                    formattedZip = zipArr[0];
                }
                $('#ccp-zipCode').val(formattedZip);
                invokeTceppsProxy(tceppsProxy);
            } else {
                createRepairOrder();
            }
        }
    };

    // Deactivates a certain wizard step i.e. hide the <div> tab we are about to leave
    var deactivateWizardStep = function(currentWizardStep) {
        $('#wizard-tab' + currentWizardStep).hide();
        $('#tabheader' + currentWizardStep).removeClass('active');
    };

    // Activates a certain wizard step i.e. show the <div> tab we are about to enter
    var activateWizardStep = function(currentWizardStep) {
        $('#wizard-tab' + currentWizardStep).show();
        $('#tabheader' + currentWizardStep).addClass('active');
    };

    var _getEmailInfo = function() {
        var emailInfo = {};

        var name = $("#ship-firstname").val();
        var lastName = $("#ship-lastname").val();
        var nameValue = name + " " + lastName;
        var companyName = $("#ship-company").val();
        var street = $("#ship-address").val();
        var street2 = $("#ship-suite").val();
        var city = $("#ship-city").val();
        var state = $("#ship-state option:selected").text();
        var zip = $("#ship-zip").val();
        var phone = $("#ship-phone").val();
        var email = $("#ship-email1").val();
        var item = $("#modelName1").val();
        var serial = $("#serial").val();
        var repairNumber = $("#model-summary-repair-num").html();
        var carepak = $("#carepak").val();
        var symptomandComments = $("#comments").val();

        if (symptomandComments.match('^Please do not enter your credit card information here')) {
            symptomandComments = " ";
        }

        var typeofIssue = "";
        var typeofIssueList = $("input[name='reason']:checked");
        typeofIssueList.each(function(){
            typeofIssue = typeofIssue + $(this).val() + "  ";
        });
        var accessoriesIncluded = "";
        var accessoriesIncludedList = $("input[name='accessory']:checked");
        accessoriesIncludedList.each(function(){
            accessoriesIncluded = accessoriesIncluded + $(this).val() + "  ";
        });
        var dealerName = $("#conf-service-center-name").html();
        var dealerAdrr = $("#conf-service-center-address").html();
        var dealerCityFull = $("#conf-service-center-city").html();
        var dealerPhone = $("#conf-service-center-telephone").html();
        var dealerDistance = $("#conf-service-center-name").attr('data-distance');

        emailInfo.nameValue = nameValue;
        emailInfo.companyName = companyName;
        emailInfo.street = street;
        emailInfo.street2 = street2;
        emailInfo.city = city;
        emailInfo.state = state;
        emailInfo.zip = zip;
        emailInfo.phone = phone;
        emailInfo.email = email;
        emailInfo.item = item;
        emailInfo.serial = serial;
        emailInfo.repairNumber = repairNumber;
        emailInfo.carepak = carepak;
        emailInfo.symptomandComments = symptomandComments;
        emailInfo.typeofIssue = typeofIssue;
        emailInfo.accessoriesIncluded = accessoriesIncluded;
        emailInfo.dealerName = dealerName;
        emailInfo.dealerAdrr = dealerAdrr;
        emailInfo.dealerCityFull = dealerCityFull;
        emailInfo.name = name;
        emailInfo.dealerPhone = dealerPhone;
        emailInfo.dealerDistance = dealerDistance;

        return emailInfo;
    };

    //Send an email with the shipping label
    var sendEmailShippingLabel = function() {
        $('#loadingModal').modal('show');

        $.ajax({
            url: sendEmailShippingLabelUrl,
            type: 'POST',
            data: _getEmailInfo()
        }).done(function(data) {
            $("#emailConfirmation").show();
        }).fail(function (data, textStatus) {
            $("#emailConfirmation").text(errConfirmationEmail).show();
        }).always(function(data) {
            $('#loadingModal').modal('hide');
        });
    };

    //Print with the shipping label
    var printShippingLabel = function() {
        var name = $("#ship-firstname").val();
        var lastName = $("#ship-lastname").val();
        var nameValue = name + " " + lastName;
        var companyName = $("#ship-company").val();
        var street = $("#ship-address").val();
        var street2 = $("#ship-suite").val();
        var city = $("#ship-city").val();
        var state = $("#ship-state option:selected").text();
        var zip = $("#ship-zip").val();
        var phone = $("#ship-phone").val();
        var email = $("#ship-email1").val();
        var item = $("#modelName1").val();
        var serial = $("#serial").val();
        var repairNumber = $("#model-summary-repair-num").html();
        var carepak = $("#carepak").val();
        var symptomandComments = $("#comments").val();
        if(symptomandComments == 'Please do not enter your credit card information here.'){
            symptomandComments = " ";
        }
        var typeofIssue = "";
        var typeofIssueList = $("input[name='reason']:checked");
        typeofIssueList.each(function(){
            typeofIssue = typeofIssue + $(this).val() + "  ";
        });
        var accessoriesIncluded = "";
        var accessoriesIncludedList = $("input[name='accessory']:checked");
        accessoriesIncludedList.each(function(){
            accessoriesIncluded = accessoriesIncluded + $(this).val() + "  ";
        });
        var dealerName = $("#conf-service-center-name").html();
        var dealerAdrr = $("#conf-service-center-address").html();
        var dealerCityFull = $("#conf-service-center-city").html();

        window.open(printShippingLabelUrl + '?nameValue=' + nameValue
            + '&companyName=' + companyName
            + '&street=' + street
            + '&street2=' + street2
            + '&city=' + city
            + '&state=' + state
            + '&zip=' + zip
            + '&phone=' + phone
            + '&email=' + email
            + '&item=' + item
            + '&serial=' + serial
            + '&repairNumber=' + repairNumber
            + '&carepak=' + carepak
            + '&symptomandComments=' + symptomandComments
            + '&typeofIssue=' + typeofIssue
            + '&accessoriesIncluded=' + accessoriesIncluded
            + '&dealerName=' + dealerName
            + '&dealerAdrr=' + dealerAdrr
            + '&dealerCityFull=' + dealerCityFull);
    };



    return {
        activateWizardStep : activateWizardStep,
        deactivateWizardStep : deactivateWizardStep,
        initializeTab : initializeTab,
        validateTab : validateTab,
        sendEmailShippingLabel:sendEmailShippingLabel,
        printShippingLabel:printShippingLabel,
        processSubmit : processSubmit,
        createRepairOrder: createRepairOrder,
        disableTab: disableTab,
        enableTab : enableTab,
        setTcepssError : setTcepssError,
        showBillingAndCreditCardForms : showBillingAndCreditCardForms
    };

})(jQuery);

var isSubmitEnabled = false;

function tceppsResponseSuccess(parameters) {
    ServiceRequest.createRepairOrder(parameters);
}

function tceppsResponseError(errorMessage) {
    ServiceRequest.setTcepssError(errorMessage);
}

var ServiceRequestHandlers = (function($){

    var _currentWizardStep = 1;
    var _timeout = null;
    var _keyboardDelay = 700;
    var _showInitialSurveyQuestion = true;

    var _sortBy = function(field, reverse, primer){
        var key = primer ?
            function(x) {return primer(x[field])} :
            function(x) {return x[field]};

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        };
    };

    var initializeTypeAheads = function() {

        var models = [];
        var _typeaheadInitialized = false;

        $('#model').typeahead({
            source: function (query, process) {

                if (_typeaheadInitialized) {
                    return process(models);
                }

                if (_timeout) {
                    clearTimeout(_timeout);
                }
                _timeout = setTimeout(function() {
                    return $.post(getModelsUrl, '', function (data) {

                        $.each(data.sa.items, function walker(key, value) {
                            if (value.title !== undefined && value.model_id !== '') {
                                models.push(value);
                            }

                            if (value !== null && typeof value === "object") {
                                // Recurse into children
                                $.each(value, walker);
                            }
                        });

                        models = Utils.uniqueList(models, 'model_id');

                        models.sort(_sortBy('title', false, null));
                        _typeaheadInitialized = true;
                        return process(models);
                    });
                }, _keyboardDelay);
            },
            matcher: function(item) {
                if (item) {
                    var title = Utils.normalize(item.title);

                    var queryRegExp = new RegExp(Utils.normalize(this.query), 'gi');
                    if (title.match(queryRegExp) != null) {
                        return true;
                    }
                }

                return false;
            },
            highlighter: function(item) {
                query = Utils.denormalize(this.query);

                return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
                    return '<strong>' + match + '</strong>';
                });
            },
            displayText: function(model) {
                return $('<div/>').html(model.title).text();
            },
            afterSelect: function(model) {
                $('#modelId1').val(model.model_id);
                $('#itemCode1').val(model.itemcode);
                $('#modelName1').val(model.title);
            }
        });

        $('#model').keydown(function (e) {
            if (e.which !== 13  && e.which !== 9) {
                $('#modelId1').val('');
                $('#itemCode1').val('');
                $('#modelName1').val('');
            }
        });
    };

    var _getCoremetricsCategory = function(step) {

        if (step == 1) {
            return 'SERVICE REPAIR REQUEST - STEP 1 - SERVICE SELECTION';
        } else if (step == 2) {
            return 'SERVICE REPAIR REQUEST - STEP 2 - SERVICE DETAILS';
        } else if (step == 3) {
            return 'SERVICE REPAIR REQUEST - STEP 3 - SELECT SERVICE LOCATION';
        } else if (step == 4) {
            return 'SERVICE REPAIR REQUEST - STEP 4 - SHIPPING ADDRESS';
        } else if (step == 5) {
            return 'SERVICE REPAIR REQUEST - STEP 5 - PAYMENT & SUBMIT';
        }

        return '';
    };

    var _reportCoremetricsClick = function(btnText, currentStep) {
        CoreMetricsWrapper.createElementTag(btnText, _getCoremetricsCategory(currentStep));
    };

    var addWizardButtonHandlers = function() {
        $('button.continue').click(function() {

            _reportCoremetricsClick('CONTINUE', _currentWizardStep);

            ServiceRequestHandlers.resetCancelSurvey();

            if (ServiceRequest.validateTab(_currentWizardStep)) {
                $("[name='wizardErrorsDiv']").hide();
                $("[name='wizardErrorsList']").empty();

                if(_currentWizardStep == 4) {
                    var size = $('section#wizard-tab4 input, button').filter(function() {
                        var match = 'rgb(153, 194, 235)';
                        return ( $(this).css('background-color') == match);
                    }).size();
                    if (size > 0){
                        return false;
                    }
                }
                if (_currentWizardStep == 5) {
                    ServiceRequest.processSubmit();
                    return false;
                }
            }else  {
                $("[name='wizardErrorsList']").empty();
                $("[name='wizardErrorsDiv']").show();
                var errors = [];
                if(_currentWizardStep == 1){
                    $("[name='wizardErrorsList']").append("<li>" + lblNoServices + "</li>");
                }
                else if (_currentWizardStep == 2) {
                    $("[name='wizardErrorsList']").append("<li>" + errServiceDetails + "</li>");
                }
                else if (_currentWizardStep == 3) {
                    $("[name='wizardErrorsList']").append("<li>" + errServiceLocation + "</li>");
                }
                else if (_currentWizardStep == 4) {
                    $("#request-repair-wizard label.cf-error").each(function(){
                        if ($(this).is(':visible')){
                            if(errors.indexOf($(this).text()) == "-1"){
                                errors.push($(this).text());
                                if($(this).text() == "This field is required."){
                                    $("[name='wizardErrorsList']").append("<li>" + "There are missing required fields" + "</li>");
                                }
                                else{
                                    $("[name='wizardErrorsList']").append("<li>" + $(this).text() + "</li>");
                                }
                            }
                        }
                    });
                }
                return false;
            }

            ServiceRequest.deactivateWizardStep(_currentWizardStep);
            _currentWizardStep = _currentWizardStep + 1;
            ServiceRequest.initializeTab(_currentWizardStep, true);
            ServiceRequest.activateWizardStep(_currentWizardStep);
        });

        $('div.wizard-buttons button.back').click(function(e) {
            _reportCoremetricsClick('BACK', _currentWizardStep);

            ServiceRequestHandlers.resetCancelSurvey();

            if (_currentWizardStep == 1) {
                $('#request-repair-form').show();
                $('#request-repair-header').show();
                $('#request-repair-wizard').hide();
                return true;
            } else {
                $("[name='wizardErrorsDiv']").hide();
                $("[name='wizardErrorsList']").empty();
            }

            ServiceRequest.deactivateWizardStep(_currentWizardStep);
            _currentWizardStep = _currentWizardStep - 1;
            ServiceRequest.activateWizardStep(_currentWizardStep);

            ServiceRequest.initializeTab(_currentWizardStep, false);

        });

    };

    $(document).on('click', '#model-summary-disclaimer-link', function(e) {
        e.preventDefault();
        $('html,body').animate({
            scrollTop: $('#additional-instr').offset().top
        }, 1000);
    });

    var addCommentsHandler = function() {
        $('textarea#comments').focus(function() {
            if ($(this).val().indexOf('Please do not enter') === 0) {
                $(this).val('');
            }
        });
    };

    var addServiceTypeTabHandler = function() {

        $(document).on('click', 'ul.servicePills > li', function() {
            var $this = $(this);
            $('#model-summary-service-type').attr("data-service-code", $this.attr("data-service-code")).text($this.find('.service-type').text());
            if ($this.attr("data-service-code") === 'R') {
                $('.symptoms').show();
            } else {
                $('.symptoms').hide();
            }

            var $parentList = $("ul.servicePills");

            $('#model-summary-cost-estimate').text($this.find('.service-estimate').text());
            $('#model-summary-cost-estimate').attr("data-cost", $this.find('.service-estimate').data('cost'));
            repairOrder.model.itemCode = $parentList.data("mercury-code");
            repairOrder.shipmentAmount = $this.data("shipping-charge");
            repairOrder.flatRateFlag = $parentList.data("flat-rate-flag");
            repairOrder.maintenanceFlag = $parentList.data("maintenance-flag");
            repairOrder.warrantyFlag = $parentList.data("warranty-flag");
            repairOrder.selectedServiceCode = $this.data("service-code");
            repairOrder.serviceAmount = $this.find('.service-estimate').data('cost');
            if (repairOrder.serviceAmount < 0) {
                repairOrder.serviceAmount = 0;
            }
            $("#wizard-tab5-estimated-shipping").text("$" + repairOrder.shipmentAmount);

            var tabId = $this.find('label').attr('data-target').substring(1);
            $('#services-tab-panel').find('div[role=tabpanel]').removeClass('active');
            $('#services-tab-panel').find('div[id=' + tabId + ']').addClass('active');
            $('ul.servicePills > li').removeClass('active');
            $this.addClass('active');

            if (ServiceRequest.showBillingAndCreditCardForms() == false) {
                $('#tab5-no-warranty').hide();
                $('#conf-payment-method-div').hide();
                $("#billing-form").hide();
                $("#bill-address-summary-div").hide();
                $("#conf-bill-address-summary-div").hide();

            } else {
                $('#tab5-no-warranty').show();
                $('#conf-payment-method-div').show();
                $("#billing-form").show();
                $("#bill-address-summary-div").show();
                $("#conf-bill-address-summary-div").show();
            }
        });
    };

    var submitOnClick = function(){
        firtTimeStep2 = true;
        firtTimeStep3 = true;
        var validationOptions = $.extend(
            {},
            formValidationDefaults,
            {
                rules: {
                    modelId : {
                        modelSelected : ["modelId1"]
                    },
                    zipcode : {
                        validateZipcodeOnly : [validateZipCodeUrl, function(){return $("#zipcode").val();}]
                    },
                    dateofpurchase : {
                        dateNotInFuture : true
                    },
                    serial : {
                        maxlength : 15,
                        alphanumericOnly : true
                    },
                    carepak : {
                        alphanumericOnly : true
                    }
                },
                ignore : []   // to enable validation on the hidden 'modelId' field
            }
        );

        var $formValid = $("#model-search-form").validate(validationOptions).form();

        var $model = $('#modelName1');
        var $zipcode = $('#zipcode');

        if ($formValid) {

            $('#model-summary-model-name').text($model.val());
            $('#model-summary-model-name').attr('data-model-id', $('#modelId1').val());
            $('#model-summary-model-name').attr('data-zip-code', $zipcode.val());
            $('#model-summary-serial').text($('#serial').val());
            $('#model-summary-purchase-date').text($('#dateofpurchase').val());
            $("[name='requestRepairFormErrorsDiv']").hide();
            $("[name='requestRepairFormErrorsList']").empty();
            $('#request-repair-header').hide();
            $('#request-repair-form').hide();
            $('#request-repair-wizard').show();
            ServiceRequest.initializeTab(1, true);

        } else {
            var errors = [];
            $("[name='requestRepairFormErrorsList']").empty();
            $("[name='requestRepairFormErrorsDiv']").show();
            $("#request-repair-form label.cf-error").each(function(){
                if ($(this).is(':visible')){
                    if(errors.indexOf($(this).text()) == "-1"){
                        errors.push($(this).text());
                        if($(this).text() == "This field is required."){
                            $("[name='requestRepairFormErrorsList']").append("<li>There are missing required fields</li>");
                        }
                        else{
                            $("[name='requestRepairFormErrorsList']").append("<li>" + $(this).text() + "</li>");
                        }
                    }
                }
            });
        }
    };

    var addMapRepairLocationHandlers = function(serviceCenterCount) {

        $(document).on('click','.btn-repair-select',function(e){
            e.preventDefault();
            var $this = $(this);

            $(".btn-repair-select").each(function() {
                if($(this).text() == "Selected"){
                    $(this).text("Select");
                    $(this).parent().parent().removeClass("cbg-light-gray-3");

                    var headerId = '#section' + $(this).attr('data-link-header');
                    $('a[href="' + headerId + '"').find('.selected').hide();
                };
            });

            $('#model-summary-service-location').attr('data-uid', $this.attr('data-uid')).text($this.attr('data-id'));
            $('#conf-service-center-name').text($this.attr('data-name')).attr('data-distance', $this.attr('data-distance'));
            $('#conf-service-center-address').text($this.attr('data-address'));
            $('#conf-service-center-city').text($this.attr('data-city'));
            $('#conf-service-center-telephone').text($this.attr('data-telephone'));
            $this.text("Selected");
            $this.parent().parent().addClass("cbg-light-gray-3");

            var headerId = '#section' + $this.attr('data-link-header');
            $('a[href="' + headerId + '"').find('.selected').show();

        });
    };

    var loadWCMData = function (){
        $("#tab0").append(nWSupport.serviceAndRepair.fields.progressBarHeaders.title0);
        $("#tab1").append(nWSupport.serviceAndRepair.fields.progressBarHeaders.title1);
        $("#tab2").append(nWSupport.serviceAndRepair.fields.progressBarHeaders.title2);
        $("#tab3").append(nWSupport.serviceAndRepair.fields.progressBarHeaders.title3);
        $("#tab4").append(nWSupport.serviceAndRepair.fields.progressBarHeaders.title4);
        $("#tab5").append(nWSupport.serviceAndRepair.fields.progressBarHeaders.title5);

        $("#actionTitle").html(nWSupport.step2CreateAProductRepairRequest.fields.action.title);
        $("#actionDescription").html(nWSupport.step2CreateAProductRepairRequest.fields.action.description);
        $("#actionText").html(nWSupport.step2CreateAProductRepairRequest.fields.action.text);
        $("#carepakLabel").prepend(nWSupport.step2CreateAProductRepairRequest.fields.carePakInput);
        $("#modelLabel").html(nWSupport.step2CreateAProductRepairRequest.fields.modelInput);
        $("#zipCodeLabel").html(nWSupport.step2CreateAProductRepairRequest.fields.zipCodeInput);
        $("#dateOfPurchaseLabel").html(nWSupport.step2CreateAProductRepairRequest.fields.purchaseDateInput);
        $("#serialNumLabel").html(nWSupport.step2CreateAProductRepairRequest.fields.serialNumberInput);
        $("#btn-search-submit").html(nWSupport.step2CreateAProductRepairRequest.fields.submitButton);
        $("#serialNumberFinderTitle").html(nWSupport.step2CreateAProductRepairRequest.fields.serialNumberFinderTitle);

        $("#phoneNumberInfo").attr("data-original-title", nWSupport.step6ShippingAndBillingInfo.fields.phoneNumberInformation.title);
        $("#phoneNumberInfo").attr("data-content", nWSupport.step6ShippingAndBillingInfo.fields.phoneNumberInformation.content);
        $("#automatedCallingOptOutTitle").html(nWSupport.step6ShippingAndBillingInfo.fields.automatedCallingOptOut.title);
        $("#automatedCallingOptOutDescription").html(nWSupport.step6ShippingAndBillingInfo.fields.automatedCallingOptOut.description);
        $("#automatedCallingOptOutCheckBoxTitle").html(nWSupport.step6ShippingAndBillingInfo.fields.automatedCallingOptOut.checkboxTitle);
        $("#benefitsTitle").html(nWSupport.step6ShippingAndBillingInfo.fields.benefits.title);
        $("#benefitsText1").html(nWSupport.step6ShippingAndBillingInfo.fields.benefits.text1);
        $("#benefitsText2").html(nWSupport.step6ShippingAndBillingInfo.fields.benefits.text2);
        $("#benefitsText3").html(nWSupport.step6ShippingAndBillingInfo.fields.benefits.text3);
        $("#benefitsText4").html(nWSupport.step6ShippingAndBillingInfo.fields.benefits.text4);

        $("#confirmationTitle").html(nWSupport.step8ServiceRequestConfirmationPage.fields.confirmationTitle);
        $("#confirmationDescription1").html(nWSupport.step8ServiceRequestConfirmationPage.fields.description1);
        $("#confirmationDescription2").html(nWSupport.step8ServiceRequestConfirmationPage.fields.description2);

        $("#disclaimerTitle").html(nWSupport.serviceAndRepair.fields.disclaimerTitle);
        $("#additionalInstructionTitle").html(nWSupport.serviceAndRepair.fields.additionalInstructionTitle);

        $('#survey_initialquestion').html(nWSupport.serviceCancelSurvey.fields.initialquestion);
        $('#survey_radio1').html(nWSupport.serviceCancelSurvey.fields.radio1);
        $('#survey_radio2').html(nWSupport.serviceCancelSurvey.fields.radio2);
        $('#survey_whycancel').html(nWSupport.serviceCancelSurvey.fields.whycancel);
        $('#cancel_repair_other').attr('placeholder', nWSupport.serviceCancelSurvey.fields.answer4);
    };

    var initCancelSurvey = function (){
        $('#cancel_repair_other').val("");
        $('#cancel_repair_other').prop('disabled', true);
        $('#chkbox0').change(function() {
            $('#cancel_repair_other').prop('disabled', !this.checked);
            $('#cancel_repair_other').val("");
        });

        $.ajax({
            url: getSurveyAnswersUrl,
            type: 'GET',
            datatype:'json'
        }).done(function(data) {
            $('#survey_answers').append(data.html);
            if (data.showQuestion) {
                $('.initial-question').show();
                _showInitialSurveyQuestion = true;
            } else {
                $('.initial-question').hide();
                $('#no').click();
                _showInitialSurveyQuestion = false;
            }
        });

        $('[data-toggle="cancel-repair"]').click(function() {
            _reportCoremetricsClick('CANCEL', _currentWizardStep);
            if (!_showInitialSurveyQuestion) {
                $('#no').click();
            }
            $('html, body').animate({
                scrollTop: $("#cancel-questions").offset().top
            }, 500);
        });
    };

    var resetCancelSurvey = function (){
        if($('.do-not-wish-to-continue').is(':visible')) {
            $('.do-not-wish-to-continue').fadeOut();
        }
        $(".repair-cancelation-confirmation input[type='checkbox']").prop('checked', false);
        $(".repair-cancelation-confirmation input[type='radio']").prop('checked', false);
        $(".repair-cancelation-confirmation input[type='text']").val('');
        $(".close-cancel-repair").parents().find(".repair-cancelation-confirmation").fadeOut();
        $('#cancel_repair_other').prop('disabled', true).val("");
    };

    var emailSendFeedback = function (){
        var modelName = $("#modelName1").val();
        var serviceType = $("#model-summary-service-type").html();
        var totalCost = $("#model-summary-cost-estimate").html();
        var url = window.location.href;

        var $checkedAnswers = $('.survey_answer:checked');

        if ($checkedAnswers.length == 0) {
            alert(errSurveyAtLeastOne);
        } else {
            var otherComment = $('#cancel_repair_other').val().trim();
            if ($('#chkbox0').is(":checked") && otherComment === '') {
                alert(errSurveyMissingComment);
            } else {
                var selectedValues = $.map($checkedAnswers, function(cb, i) {
                    if (cb.id !== 'chkbox0') {
                        return cb.value;
                    }
                });
                if ($('#chkbox0').is(":checked")) {
                    selectedValues.push(otherComment);
                }

                var feedback = selectedValues.join('<br/>');
                var dataJson = {"modelName": modelName, "serviceType": serviceType, "totalCost": totalCost, "url": url, "feedback": feedback};
                $.ajax({
                    url: emailSendFeedbackUrl,
                    type: 'POST',
                    data: dataJson,
                }).done(function(data) {
                    ServiceRequestHandlers.resetCancelSurvey();
                    var wcmModelId = $('#modelId1').val();
                    $.ajax({
                        url: getWcmProductDetailUrl,
                        type: 'POST',
                        datatype:'json',
                        data: { models : wcmModelId }
                    }).done(function(data) {
                        if (data && data.items && data.items.length > 0) {
                            var results = data.items;
                            var wcmResult = results[0].productOverviewItem;
                            var wcmPath = wcmResult.path;
                            $('#SR_redirectUrl').val(_getProductDetailUrl(wcmPath));
                            $('#goToDetailForm').submit();
                        }
                    });
                }).fail(function (data, textStatus) {
                    alert(errSurveyEmailFailed);
                });
            }
        }
    };

    var _getProductDetailUrl = function(wcmPath) {
        return Utils.getVirtualPortalRoot() + fu_prod_sup_detail + Utils.cleanupWcmPath(wcmPath);
    };

    var blurHandler = function () {
        $("#acct-userid").blur(function(){

            $("#service-request-create-account").validate().settings.rules = {
                "acct-email": {
                    required : true,
                    emailFormat: true,
                    checkEmailAddress : [checkEmailUrl]
                }
            };

            var isValidEmail = $("#service-request-create-account").validate().form();
            if (!isValidEmail) {
                return false;
            }
            return true;
        });
    };

    var onChangeHandler = function(){
        $("#model, #zipcode, #dateofpurchase").change(function(){
            if($(this).val()){
                enableSubmitBtn();
            } else {
                disableSubmitBtn();
            }
        });
    };

    var tabNavigationHandler =  function() {
        ServiceRequest.enableTab("tab0");
        ServiceRequest.disableTab("tab1");
        ServiceRequest.disableTab("tab2");
        ServiceRequest.disableTab("tab3");
        ServiceRequest.disableTab("tab4");
        ServiceRequest.disableTab("tab5");

        $("#tabheader0").click(function(e){
            //Set cookie with initial tab values
            var form1Data = 'model='+$('#model').val()+'&modelId1='+$('#modelId1').val()+'&itemCode1='+$('#itemCode1').val()+'&modelName1='+$('#modelName1').val()+'&zipcode='
                +$('#zipcode').val()+'&dateofpurchase='+$('#dateofpurchase').val()+'&serial='+$('#serial').val()+'&carepak='+$('#carepak').val();
            setCookie('modelForm', form1Data, 1);
            window.location.reload();
        });

        $("#tabheader1").click(function(e){
            e.preventDefault();
            ServiceRequest.disableTab("tab2");
            ServiceRequest.disableTab("tab3");
            ServiceRequest.disableTab("tab4");
            ServiceRequest.disableTab("tab5");
            ServiceRequestHandlers.resetCancelSurvey();
            ServiceRequest.deactivateWizardStep(_currentWizardStep);
            _currentWizardStep = 1;
            ServiceRequest.activateWizardStep(_currentWizardStep);
            ServiceRequest.initializeTab(_currentWizardStep, false);

        });
        $("#tabheader2").click(function(e){
            e.preventDefault();
            ServiceRequest.disableTab("tab3");
            ServiceRequest.disableTab("tab4");
            ServiceRequest.disableTab("tab5");
            ServiceRequestHandlers.resetCancelSurvey();
            ServiceRequest.deactivateWizardStep(_currentWizardStep);
            _currentWizardStep = 2;
            ServiceRequest.activateWizardStep(_currentWizardStep);
            ServiceRequest.initializeTab(_currentWizardStep, false);
        });
        $("#tabheader3").click(function(e){
            e.preventDefault();
            ServiceRequest.disableTab("tab4");
            ServiceRequest.disableTab("tab5");
            ServiceRequestHandlers.resetCancelSurvey();
            ServiceRequest.deactivateWizardStep(_currentWizardStep);
            _currentWizardStep = 3;
            ServiceRequest.activateWizardStep(_currentWizardStep);
            ServiceRequest.initializeTab(_currentWizardStep, false);
        });
        $("#tabheader4").click(function(e){
            e.preventDefault();
            ServiceRequest.disableTab("tab5");
            ServiceRequestHandlers.resetCancelSurvey();
            ServiceRequest.deactivateWizardStep(_currentWizardStep);
            _currentWizardStep = 4;
            ServiceRequest.activateWizardStep(_currentWizardStep);
            ServiceRequest.initializeTab(_currentWizardStep, false);
        });
        $("#tabheader5").click(function(e){
            e.preventDefault();
        });
    };


    var initModal = function() {
        var options = {
            "backdrop" : "static",
            "show": false
        };
        $('#loadingModal').modal(options);
    };

    // function that disables the submit button
    var disableSubmitBtn = function(){
        $('#btn-search-submit').off("click");
        $('body, input').off("keypress");
        isSubmitEnabled = false;
        $('#btn-search-submit').css({
            "border-color" : "grey",
            "color" : "grey"
        });
//		$("label.error").hide();
    };

    var enableSubmitBtn = function(){
        if ($('#model').val() && $('#zipcode').val() && $('#dateofpurchase').val()){
            $('#btn-search-submit').removeAttr("style");
            $('#btn-search-submit').addClass("cbtn-canon-red-o");
            if(!isSubmitEnabled){
                $('#btn-search-submit').on("click", function(){submitOnClick();});
                $('input, body').keypress(function (e) {
                    var target = $(e.target);
                    if(target.is("input")){
                        e.stopPropagation();
                    }
                    if (e.which === 13) {
                        $('#btn-search-submit').click();
                    }
                });
                isSubmitEnabled = true;
            }
        }
    };

    var setImageURL = function(){
        if(imageURL != ""){
            $( ".dynamicImage" ).addClass("bannerbar");
            //this line will overwrite the background image but will maintain the other bannerbar class's css properties
            $( ".dynamicImage" ).css( "background-image", "url('" + imageURL + "')" );
        }else{
            $( ".dynamicImage" ).addClass("bannerbar");
        }
    };

    var initAnglesBehavior = function() {
        $(document).on('click', '.movingArrows', function() {
            $(this).find('span').toggleClass('fa-angle-up fa-angle-down');
        });
    };

    return {
        initModal : initModal,
        addWizardButtonHandlers : addWizardButtonHandlers,
        addCommentsHandler : addCommentsHandler,
        addServiceTypeTabHandler : addServiceTypeTabHandler,
        addMapRepairLocationHandlers : addMapRepairLocationHandlers,
        initializeTypeAheads : initializeTypeAheads,
        loadWCMData : loadWCMData,
        initCancelSurvey : initCancelSurvey,
        resetCancelSurvey : resetCancelSurvey,
        emailSendFeedback : emailSendFeedback,
        blurHandler : blurHandler,
        onChangeHandler : onChangeHandler,
        tabNavigationHandler : tabNavigationHandler,
        disableSubmitBtn : disableSubmitBtn,
        enableSubmitBtn : enableSubmitBtn,
        setImageURL : setImageURL,
        initAnglesBehavior : initAnglesBehavior
    };

})(jQuery);

$(document).ready(function() {

    // LiveChat coremetrics logging. Relying on a class from BoldChat implementation
    $(document).on('click', '.bcStatic', function(e) {
        CoreMetricsWrapper.createElementTag('Chat Initiated', 'BoldChat');
    });

    // Setup form validation for the create account form of the wizard
    var createAccountValidationOptions = $.extend(
        {},
        formValidationDefaults,
        {
            ignore : []
        }
    );

    $("#service-request-create-account").validate(createAccountValidationOptions);

    ServiceRequestHandlers.setImageURL();

    ServiceRequestHandlers.initModal();

    ServiceRequestHandlers.initCancelSurvey();

    ServiceRequestHandlers.addWizardButtonHandlers();

    ServiceRequestHandlers.addCommentsHandler();

    ServiceRequestHandlers.addServiceTypeTabHandler();

    ServiceRequestHandlers.initializeTypeAheads();

    ServiceRequestHandlers.loadWCMData();

    ServiceRequestHandlers.blurHandler();

    ServiceRequestHandlers.onChangeHandler();

    ServiceRequestHandlers.tabNavigationHandler();

    $('#serialnumber-finder').serialNumberFinder({serialNumberWcmUrl: getSerialNumberInfoUrl});

    ServiceRequestHandlers.disableSubmitBtn();

    ServiceRequestHandlers.initAnglesBehavior();

    //Check for cookie to see if we need to load the form data
    var cookieValue = getCookie('modelForm');
    if (cookieValue !== '') {
        cookieValue = decodeURIComponent(cookieValue);
        var splitData = cookieValue.split('&');
        for (var i=0;i<splitData.length;i++){
            var inData = splitData[i];
            var inSplit = inData.split('=');
            if(inSplit.length == 2){
                $('#'+inSplit[0]).val(inSplit[1]);
            }
        }

        ServiceRequestHandlers.enableSubmitBtn();
        setCookie('modelForm', '', -1);
    }

    $('form').each(function(){
        var list  = $(this).find('*[tabindex]').sort(function(a,b){ return a.tabIndex < b.tabIndex ? -1 : 1; }),
            first = list.first();
        list.last().on('keydown', function(e){
            if( e.keyCode === 9 ) {
                first.focus();
                return false;
            }
        });
    });

    $("#chk-same").change(function() {
        if ($(this).is(':checked')) {
            $('#billing-required-label').hide();
        } else {
            $('#billing-required-label').show();
        }
    });

});


