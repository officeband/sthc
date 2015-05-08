/**
 * 
 */

function stickyTableWindowOnScroll() {
	$(window).on('scroll',function(){
		var st = $(this).scrollTop();
		var sl = $(this).scrollLeft();
		$('.stickyTableRowCol').each(function(){
			var stickyTableName = $(this).attr('stickyTableName');
			$fakeRowColTable = $('.stickyFakeRowColTable[stickyTableName="'+stickyTableName+'"]');
			$fakeRowTable = $('.stickyFakeRowTable[stickyTableName="'+stickyTableName+'"]');
			$fakeColTable = $('.stickyFakeColTable[stickyTableName="'+stickyTableName+'"]');
			var absTop = getAbsTop($(this));
			if (st >= absTop) {
				var absLeft = getAbsLeft($(this));
				$fakeRowTable.css('left', absLeft + (-1 * sl) + 'px');
				$fakeRowTable.show();
			}else{
				$fakeRowTable.hide();
			}
			var absLeft = getAbsLeft($(this));
			if (sl >= absLeft) {
				var absTop = getAbsTop($(this));
				$fakeColTable.css('top', absTop + (-1 * st) + 'px');
				$fakeColTable.show();
			}else{
				$fakeColTable.hide();
			}
			if (st >= absTop && sl >= absLeft) {
				$fakeRowColTable.show();
			} else {
				$fakeRowColTable.hide();
			}
		});
	});

}

function stickyTable($e) {
	$e.find('.stickyTableRowCol').each(function(){
    	$(this).css('width',$(this).css('width'));
    	var keepTDHeight;
		$(this).find('.stickyRow').find('td').each(function(){
	    	$(this).css('width',$(this).css('width'));
	    	if (!keepTDHeight) {
	    		// In IE, using $(this).css('height',$(this).css('height')) to change one TD's height 
	    		// will increase other TDs' height, so we have to keep the same height.
	    		keepTDHeight = $(this).css('height');
	    	}
	    	$(this).css('height',keepTDHeight);		
		});
		$(this).find('.stickyCol').each(function(){
	    	$(this).css('width',$(this).css('width'));
	    	$(this).css('height',$(this).css('height'));		
		});
		
		var $fakeRowTable = $('<table><tbody></tbody></table>');
		$fakeRowTable.attr('style', $(this).attr('style'));
		$fakeRowTable.attr('class', $(this).attr('class'));
		$fakeRowTable.attr('cellspacing', $(this).attr('cellspacing'));
		$fakeRowTable.attr('cellpadding', $(this).attr('cellpadding'));
		$fakeRowTable.attr('stickyTableName', $(this).attr('stickyTableName'));
		$fakeRowTable.removeClass('stickyTableRowCol');
		var $fakeColTable = $fakeRowTable.clone();
		var $fakeRowColTable = $fakeRowTable.clone();
		
		$fakeRowTable.addClass('stickyFakeRowTable');
		$fakeRowTable.css({
			'display':'none',
			'position':'fixed',
			'top':'0px'
		});
		
		$fakeColTable.addClass('stickyFakeColTable');
		$fakeColTable.css({
			'display':'none',
			'position':'fixed',
			'left':'0px',
			'width':''
		});
		
		$fakeRowColTable.addClass('stickyFakeRowColTable');
		$fakeRowColTable.css({
			'display':'none',
			'position':'fixed',
			'left':'0px',
			'top':'0px',
			'width':'',
			'z-index':'1001'
		});
		
		$fakeRowTable.find('tbody').append($(this).find('.stickyRow').clone());
		$fakeRowTable.find('.stickyRow').removeClass('stickyRow');
		$(this).parent().prepend($fakeRowTable);

		var $fakeColTableBody = $fakeColTable.find('tbody');
		$(this).find('.stickyCol').each(function(){
			$thisTR = $(this).parent();
			$cloneTD = $(this).clone();
			$cloneTD.wrap('<tr></tr>');
			$cloneTR = $cloneTD.parent();
			$cloneTR.attr('style', $thisTR.attr('style'));
			$cloneTR.attr('class', $thisTR.attr('class'));
			$cloneTR.removeClass('stickyRow');
			$cloneTD.removeClass('stickyCol');
			$cloneTD.css({
				'border-right-color':'red'
			});
			$fakeColTableBody.append($cloneTR);
			if ($thisTR.hasClass('stickyRow')) {
				$fakeRowColTable.find('tbody').append($cloneTR.clone());
				$fakeRowColTable.find('TD').each(function(){
					$(this).css({
						'border-bottom-color':'red'
					});
				});
			}
			
			// for checkbox interaction....
			var $oriCheck = $(this).find('input[type=checkbox]');
			var $cloneCheck = $cloneTD.find('input[type=checkbox]');
			if($oriCheck[0]){$oriCheck[0].fakeClone = $cloneCheck[0];}
			$cloneCheck.attr('onclick','');
			$cloneCheck.on('click',function(){
				$oriCheck.click();
			});
			$oriCheck.on('click',function(){
				$cloneCheck.prop('checked',$(this).prop('checked'));
			});
			
		});

		$(this).parent().prepend($fakeColTable);

		$fakeRowTable.find('TD').each(function(){
			$(this).css({
				'border-bottom-color':'red'
			});
		});
		$(this).parent().prepend($fakeRowColTable);
	});
}
function getAbsTop($e) {
	var r = 0;
	while( $e.prop('nodeName')!='HTML' ){
		r += $e.offset().top;
		$e = $e.offsetParent();
	}
	return r;
}
function getAbsLeft($e) {
	var r = 0;
	while( $e.prop('nodeName')!='HTML' ){
		r += $e.offset().left;
		$e = $e.offsetParent();
	}
	return r;
}
