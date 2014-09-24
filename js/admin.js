"use strict";
$('#gatekeeperForm') .ready(function () {

	$( "#gkTabs" ).tabs();
	
	var echo = function (msg) {
	        var c = $('#gk_settingsEcho');
	        if (!c.find('ol') .length) {
	            c.append('<ol></ol>');
	        }
	        $('<li>' + msg + '</li>') .appendTo('#gk_settingsEcho ol');
	};

	/********************************************************
	* MODE function
	*********************************************************/
	$('#selectMode').change( function(e) {

	   $('#gk_settingsError') .empty();


		var url = OC.generateUrl('apps/gatekeeper/api/settings/mode/');
		var s = $(e.target);
		var block = s.parent();

        block.removeClass('gk_changed gk_error gk_saved');
        block.addClass('gk_changed');

		var value = $('#selectMode option:selected').val();
		var tValue = $('#selectMode option:selected').text();
		$.post(url, {
                value: value
            }, function (result) {
                echo('OK:'+tValue);
                block.removeClass('gk_changed gk_error gk_saved');
                block.addClass('gk_saved');
                block.removeClass('gk_saved', 2000);

            }, 'json') .fail(function (jqXHR, textStatus, errorThrown) {

                block.removeClass('gk_changed gk_error gk_saved');
                block.addClass('gk_error');
                $('#gk_settingsError') .text(jqXHR.responseJSON.msg);
            });

        block.removeClass('gk_changed',3000);         
    });

	/********************************************************
	* search group function
	*********************************************************/
	var groupUrl = OC.generateUrl('apps/gatekeeper/api/settings/group');


	$('#searchGroupField').autocomplete({
		minLength: 2,
		delay: 500,
		source: function(request,response) {
			$.get(groupUrl, {term: request.term})
				.done( function(data, textStatus, jqXHR){
					response(data);
				})
		}
	});


  var loadGroupByMode = function(mode) {

    $('#gkLoadButton_'+mode).addClass('loading');

    var liOnClick = function(e){
      var anchor = $(e.target).parent();
      var li = anchor.parent();
      var anchorId = anchor.attr('id');
      var parts = anchorId.split('_');
      var grpId = parts[parts.length - 1 ];
      var mode = parts[parts.length - 2 ];

      li.removeClass('gk_changed gk_error gk_saved');
      li.addClass('gk_changed');

      $.post(groupUrl, {group: grpId, action: 'rm', mode: mode })
      .done(function(data){
        var name = li.find('span').text();
        echo('removed '+name+' from '+mode);
        li.removeClass('gk_changed gk_error gk_saved');
        li.addClass('gk_saved');
        li.removeClass('gk_saved', 2000);
        li.remove();
      })
      .fail(function(jqXHR,  textStatus, errorThrown){
        li.removeClass('gk_changed gk_error gk_saved');
        li.addClass('gk_error');
        $('#gk_settingsError') .text(jqXHR.responseJSON.msg);
      })
    }
    
    var list = $('#gkList_'+mode);
    $.get(groupUrl, { mode: mode} ).done(function(data){
      $('#gkLoadButton_'+mode).removeClass('loading');
      for (var i=0; i<data.length; i++) {
        var grp = data[i];
        var id = 'gk_action_'+mode+'_'+grp.id;
        //<a class="action delete"><img src="/core/core/img/actions/delete.svg" class="svg action"></a>
        var li = $('<li><a id="'+id+'" class="action delete"><img src="/core/core/img/actions/delete.svg" class="svg action"></a><span>'+grp.name+'</span></li>');
        li.appendTo(list);
        li.click(liOnClick);
      }
    })
    .fail(function(jqXHR,  textStatus, errorThrown){
      $('#gk_settingsError').text(textStatus);
    });

  }

  $('#gkLoadButton_whitelist').click(function(e) {
    loadGroupByMode('whitelist');
  });

  $('#gkLoadButton_blacklist').click(function(e) {
    loadGroupByMode('blacklist');
  });


});