# Draftsaver jQuery plugin

Plugin created to simplify routines of form «autosave».

## Usage

```
$('your_selector').draftsaver(options);
```
Where `options` is object of settings.

 * `url`: url where form must saved
 * `ajaxSettings`: [jQuery ajax settings](http://api.jquery.com/jQuery.ajax/#jQuery-ajax-settings)
 * `fields`: array of names (not selector!) of tracked fields. All inputs and textareas by default (selector: `':input'`)
 * `alwaysUpdate`: array of names of fields, which will be added to request always. For example: `'_token'`
 * `ignoreSelector`: Selector of elements which must be skipped. By default: `':button,:submit,:reset,:file'`
 * `updateInterval`: number of milliseconds between tests of changing data. By default: 3000.
 * `updateOnlyChanged`: collect and try to save only changed data. By default: true.



## No warranties

Author is not very experienced JS developer, therefore quality of plugin may be low.
It's not tested at any sensitive number of browsers,
but uses only jQuery without any non-standart functions.

## License

[MIT license.](LICENSE)
