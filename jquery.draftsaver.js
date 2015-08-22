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
            return (field.data('old-draft-text') != field.val());
        }

        function save_draft(data) {
            data = data || {};
            var temp = settings.ajaxSettings;

            temp.data = data;
            jQuery.ajax(temp);
        }

        var action = function () {
            var changed_data = {};
            var changed = false;

            fields.each(function () {
                var field = $(this);

                if (is_changed(field)) {
                    changed = true;
                    changed_data[field.attr('name')] = field.val();
                    field.data('old-draft-text', field.val());
                } else if ( ! settings.updateOnlyChanged) {
                    changed_data[field.attr('name')] = field.val();
                }
            });

            if (changed) {
                save_draft(changed_data);
            }
        };

        // fills buffers by initial data
        fields.each(function () {
            $(this).data('old-draft-text', $(this).val());
        });

        intervalId = setInterval(action, settings.updateInterval);
    };

})(jQuery);