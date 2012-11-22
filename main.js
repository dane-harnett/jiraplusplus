$(function(){
	chrome.storage.sync.get('customAssignees', function(items) {
		localStorage.setItem('jiraplusplus_options', JSON.stringify( items ));
	});
	var defaults = {
			customAssignees: {}
		},
		options = {};

	if (typeof localStorage.jiraplusplus_options !== 'undefined') {
		options = JSON.parse(localStorage.jiraplusplus_options);
	}
	if (typeof options !== 'object') {
		options = {};
	}
	options = $.extend({}, defaults, options);

	var specialAssigneeSelect = '<select name="specialAssigneeSelect" id="specialAssigneeSelect">';
	specialAssigneeSelect += '<option value="">Custom Assignees...</option>';
	$.each(options.customAssignees, function(i,v) {
		specialAssigneeSelect += '<option value="'+v.email+'">'+v.name+'</option>';
	});
	specialAssigneeSelect += '</select>';

	$(document).delegate('#specialAssigneeSelect', 'change', function(ev, el) {
		$('#assignee').val($(this).val());
		$('#assignee').trigger('liszt:updated');
		ev.preventDefault();
	});

	var mainFunction = function() {

		var $assigneeSelects = $('#assignee');

		$.each($assigneeSelects, function(i,v) {
			var $el = $(v);
			
			if ($el.parent().find('#specialAssigneeSelect').length == 0) {
				$el.after(specialAssigneeSelect);
			}
			if (!$el.hasClass('chzn-done')) {
				$el.chosen();
				$el.parent().find('.chzn-drop .chzn-search input[type="text"]').focus();
			}
		});

		setTimeout(mainFunction, 500);
	};
	setTimeout(mainFunction, 500);
});