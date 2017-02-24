
/**
 * Created by Q05459 on 2/23/2017.
 * from https://www.usa.canon.com/internet/PA_NWSupport/resources/js/servreq.js
 * got here from home page https://www.usa.canon.com/internet/portal/us/home/support/service-repair/repair?cm_sp=CSO-_-support/service-repair-_-Repair
 */


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
