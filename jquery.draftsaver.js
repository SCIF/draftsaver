/**
 * @author Zhuravlev Alexander <scif-1986@ya.ru>
 * @licence MIT, http://opensource.org/licenses/mit-license.php
 */
(function ($) {
    $.fn.draftsaver = function (options) {
        var intervalId;
        options = options || {};


        if ('string' == typeof(options) && 'stop' == options) {
            intervalId && clearInterval(intervalId);

            return;
        }

        var settings = $.extend({
            'url': undefined,
            'ajaxSettings': {},
            'fields': [],
            "ignoreSelector": ':button,:submit,:reset,:file',
            "updateInterval": 3000,
            "alwaysUpdate": [],
            "updateOnlyChanged": true
        }, options);

        settings.ajaxSettings = $.extend({
            'dataType': 'json',
            'type': 'POST'
        }, options.ajaxSettings);

        var form = this;
        settings.ajaxSettings.url = settings.url || form.attr('action');

        var input_selector = ':input';
        if (settings.fields.length > 0) {
            input_selector = '';
            settings.fields.forEach(function (val) {
                input_selector += '[name="' + val + '"],';
            });
            settings.alwaysUpdate.forEach(function (val) {
                input_selector += '[name="' + val + '"],';
            });
            input_selector = input_selector.substr(0, input_selector.length - 1);
        }

        var fields = form.find(input_selector).not(settings.ignoreSelector);

        function is_changed(field) {
            return (field.data('old-draft-text') != field_value(field));
        }

        function save_draft(data) {
            data = data || {};
            var temp = settings.ajaxSettings;

            temp.data = data;
            jQuery.ajax(temp);
        }

        function field_value(field) {
            var val;
            field = $(field);

            if (field.is(':checkbox')) {
                val = field.is(':checked') ? 1 : false;
            } else {
                val = field.val();
            }

            return val;
        }

        var action = function () {
            var changed_data = {};
            var changed = false;

            fields.each(function () {
                var field = $(this);
                var value = field_value(field);

                if (is_changed(field)) {
                    changed = true;

                    if (false != value) {
                        changed_data[field.attr('name')] = value;
                    }

                    field.data('old-draft-text', value);
                } else if ( ! settings.updateOnlyChanged && false != value) {
                    changed_data[field.attr('name')] = field_value(field);
                }
            });

            if (changed) {
                save_draft(changed_data);
            }
        };

        // fills buffers by initial data
        fields.each(function () {
            $(this).data('old-draft-text', field_value(this));
        });

        intervalId = setInterval(action, settings.updateInterval);
    };

})(jQuery);