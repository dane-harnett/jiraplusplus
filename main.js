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

		if ($('.jpp-quickfilter').length == 0) {
			$('.ops.js-quickfilter-selector').after('<ul class="ops jpp-quickfilter"></ul>');
		}

		var $quickFilters = $('.ghx-quickfilter-button');
		var $jppAssigneeSelect = $('#jppAssigneeSelect');
		var $jppFixVersionSelect = $('#jppFixVersionSelect');
		var qfreg = /&quickFilter=([0-9]+)/g;
		var x = window.location.href.match(qfreg);
		var currentFilterIds = [];
		for (var i in x) {
			var s = x[i].split('=');
			if (s.length == 2)
				currentFilterIds.push(s[1]);
		}

		if ($jppAssigneeSelect.length == 0) {
			var $assigneeQuickFilters = $quickFilters.filter(function(){
				return $(this).attr('title').match(/assignee="(.*)"/);
			});

			var assigneeOptions = '';
			var selectdata = '';
			
			$.each($assigneeQuickFilters, function(){
				$(this).hide();
				var selected = '';
				var dfid = $(this).data('filterId');
				if ($.inArray(dfid.toString(), currentFilterIds) > -1){
					selected = ' selected';
					selectdata = ' data-pre="'+dfid+'"';
				}
				assigneeOptions += '<option value="'+dfid+'"'+selected+'>'+$(this).html()+'</option>';
			});

			$('.jpp-quickfilter').append('<li><select id="jppAssigneeSelect"'+selectdata+' style="-webkit-appearance: menulist-button;height: 26px;border: 1px solid #ddd;"><option value="">Select assignee...</option>'+assigneeOptions+'</select></li>');
			$jppAssigneeSelect = $('#jppAssigneeSelect');
			$jppAssigneeSelect.bind('change', function(){
				var id = $(this).val();
				var pre = $(this).data('pre');
				var loc = window.location.href.replace('&quickFilter='+pre, '');
				$(this).data('pre', $(this).val());
				window.location.href = loc + '&quickFilter='+id;
			});
		}

		if ($jppFixVersionSelect.length == 0) {
			var $fixVersionQuickFilters = $quickFilters.filter(function(){
				return $(this).attr('title').match(/fixVersion=(.*)/);
			});
			var fixVersionOptions = '';
			var selectdata = '';

			$.each($fixVersionQuickFilters, function(){
				$(this).hide();
				var selected = '';
				var dfid = $(this).data('filterId');
				if ($.inArray(dfid.toString(), currentFilterIds) > -1){
					selected = ' selected';
					selectdata = ' data-pre="'+dfid+'"';
				}
				fixVersionOptions += '<option value="'+dfid+'"'+selected+'>'+$(this).html()+'</option>';
			});

			$('.jpp-quickfilter').append('<li class="last"><select id="jppFixVersionSelect"'+selectdata+' style="-webkit-appearance: menulist-button;height: 26px;border: 1px solid #ddd;"><option value="">Select fix version...</option>'+fixVersionOptions+'</select></li>');
			$jppFixVersionSelect = $('#jppFixVersionSelect');
			$jppFixVersionSelect.bind('change', function(){
				var id = $(this).val();
				var pre = $(this).data('pre');
				var loc = window.location.href.replace('&quickFilter='+pre, '');
				$(this).data('pre', $(this).val());
				window.location.href = loc + '&quickFilter='+id;
			});
		}

		
		//console.log($assigneeQuickFilters);

		setTimeout(mainFunction, 500);
	};
	setTimeout(mainFunction, 500);
});