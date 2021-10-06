
/* jQuery Visible Plugin Including */

(function($) {

  /**
   * Copyright 2012, Digital Fusion
   * Licensed under the MIT license.
   * http://teamdf.com/jquery-plugins/license/
   *
   * @author Sam Sehnert
   * @desc A small plugin that checks whether elements are within
   *     the user visible viewport of a web browser.
   *     only accounts for vertical position, not horizontal.
   */

  $.fn.visible = function(partial) {
    
      var $t            = $(this),
          $w            = $(window),
          viewTop       = $w.scrollTop(),
          viewBottom    = viewTop + $w.height(),
          _top          = $t.offset().top,
          _bottom       = _top + $t.height(),
          compareTop    = partial === true ? _bottom : _top,
          compareBottom = partial === true ? _top : _bottom;
    
    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));

  };
    
})(jQuery);


/* jQuery Flickrfeed Plugin Including */

/*
* Copyright (C) 2009 Joel Sutherland
* Licenced under the MIT license
* http://www.newmediacampaigns.com/page/jquery-flickr-plugin
*
* Available tags for templates:
* title, link, date_taken, description, published, author, author_id, tags, image*
*/

(function($){$.fn.jflickrfeed=function(settings,callback){settings=$.extend(true,{flickrbase:'http://api.flickr.com/services/feeds/',feedapi:'photos_public.gne',limit:20,qstrings:{lang:'en-us',format:'json',jsoncallback:'?'},cleanDescription:true,useTemplate:true,itemTemplate:'',itemCallback:function(){}},settings);var url=settings.flickrbase+settings.feedapi+'?';var first=true;for(var key in settings.qstrings){if(!first)
url+='&';url+=key+'='+settings.qstrings[key];first=false;}
return $(this).each(function(){var $container=$(this);var container=this;$.getJSON(url,function(data){$.each(data.items,function(i,item){if(i<settings.limit){if(settings.cleanDescription){var regex=/<p>(.*?)<\/p>/g;var input=item.description;if(regex.test(input)){item.description=input.match(regex)[2]
if(item.description!=undefined)
item.description=item.description.replace('<p>','').replace('</p>','');}}
item['image_s']=item.media.m.replace('_m','_s');item['image_t']=item.media.m.replace('_m','_t');item['image_m']=item.media.m.replace('_m','_m');item['image']=item.media.m.replace('_m','');item['image_b']=item.media.m.replace('_m','_b');delete item.media;if(settings.useTemplate){var template=settings.itemTemplate;for(var key in item){var rgx=new RegExp('{{'+key+'}}','g');template=template.replace(rgx,item[key]);}
$container.append(template)}
settings.itemCallback.call(container,item);}});if($.isFunction(callback)){callback.call(container,data);}});});}})(jQuery);


/* jQuery Modal window plugin including */

if (!jQuery) { throw new Error("Bootstrap requires jQuery") }

+function ($) { "use strict";

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(window.jQuery);


/* ========================================================================
 * Bootstrap: modal.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#modals
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })
    this.$element.trigger(e)
    if (this.isShown || e.isDefaultPrevented()) return
    this.isShown = true
    this.escape()
    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))
    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')
      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }
      that.$element.show()
      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }
      that.$element
        .addClass('in')
        .attr('aria-hidden', false)
      that.enforceFocus()
      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })
      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()
    e = $.Event('hide.bs.modal')
    this.$element.trigger(e)
    if (!this.isShown || e.isDefaultPrevented()) return
    this.isShown = false
    this.escape()
    $(document).off('focusin.bs.modal')
    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')
    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''
    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate
      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)
      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))
      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow
      this.$backdrop.addClass('in')
      if (!callback) return
      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()
    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')
      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()
    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(window.jQuery);


/* NATION theme script initializing */
$(document).ready(function() {

	if ($.fn.cssOriginal!=undefined) $.fn.css = $.fn.cssOriginal;
	
	/* Initialize Document Smooth Scroll for Chrome */ 
	var ie = (function(){

		var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');

		while (
			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
			all[0]
		);

		return v > 4 ? v : undef;

	}());

	if ( ie > 9 || !ie) { $.smoothScroll(); }
	
	if(Function('/*@cc_on return document.documentMode===10@*/')()){
		document.documentElement.className+=' ie10';
	}
	
	$(".footer-twitter-feed .twitter-row-divider:last").css("display","none");
		
		
	//Flickr Feed
	/* $('#flickr-feed').jflickrfeed({
		limit:8,
		qstrings:{ id: '52617155@N08' },
		itemTemplate: 
			'<li>' +
			'<a href="{{image_b}}"><img src="{{image_s}}" alt="{{title}}" /></a>' +
			'</li>'
	}); */
		
		
	//Smooth scrolling
	$("#back-to-top").click(function(event){		
		event.preventDefault();
		$('html,body').animate({scrollTop:$(this.hash).offset().top}, 500);
	});
		
		
	/* Booking PRO Calendars initializing */
	$('#frontend').DOPFrontendBookingCalendarPRO({'ID': "0","DataURL":"php/load.php"});
	$('#frontend2').DOPFrontendBookingCalendarPRO({'ID': "1","DataURL":"php/load.php"});
	$('#frontend3').DOPFrontendBookingCalendarPRO({'ID': "2","DataURL":"php/load.php"});
	$('#frontend4').DOPFrontendBookingCalendarPRO({'ID': "3","DataURL":"php/load.php"});
	$('#frontend5').DOPFrontendBookingCalendarPRO({'ID': "4","DataURL":"php/load.php"});
	$('#frontend6').DOPFrontendBookingCalendarPRO({'ID': "5","DataURL":"php/load.php"});
	$('#frontend7').DOPFrontendBookingCalendarPRO({'ID': "6","DataURL":"php/load.php"});
	$('#frontend8').DOPFrontendBookingCalendarPRO({'ID': "7","DataURL":"php/load.php"});
	$('#frontend9').DOPFrontendBookingCalendarPRO({'ID': "8","DataURL":"php/load.php"});

	$('#frontend-check-in').DOPFrontendBookingCalendarPRO({'ID': "0","DataURL":"php/load.php"});
	$('#frontend-check-out').DOPFrontendBookingCalendarPRO({'ID': "0","DataURL":"php/load.php"});
		
		
	//Date picker for check-in and check-out dates on reservation page
	$("#booking-wrap #check-in-date").focus(function(){
		if ($(this).val()=='check-in date' ) $(this).val(''); 
		$('#frontend-check-in').css('display','block');
		$('#frontend-check-out').css('display','none');
		if ($("#check-out-date").val()=='' ) $("#check-out-date").val('check-out date');
	});

	$("#booking-wrap #check-out-date").focus(function(){
		if ($(this).val()=='check-out date' ) $(this).val(''); 
		$('#frontend-check-out').css('display','block');
		$('#frontend-check-in').css('display','none');
		if ($("#check-in-date").val()=='' ) $("#check-in-date").val('check-in date');
	});
		
	$("#booking-wrap #number-of-room").focus(function(){
		if ($(this).val()=='number of room') $(this).val('');
	}).blur(function(){
		if ($(this).val()=='') $(this).val('number of room');
	});
		
	$("#check-in-date, .main-reservation-form #check-in").click(function(e){
		e.stopPropagation();
	});
		
	$("#check-out-date, .main-reservation-form #check-out").click(function(e){
		e.stopPropagation();
	});
		
		
	// Modal window initializing
	$("#one-bedroom-check, .overlay-checkavail, .overlay-checkavail2, .overlay-checkavail3, .overlay-checkavail4, .overlay-checkavail5, .overlay-checkavail6, .overlay-checkavail7, .overlay-checkavail8, .overlay-checkavail9").click(function(){
		$(this).parents(".rooms-list-item-wrap").find("#myModal").modal();
	});
				
	$("#booking-wrap, .main-reservation-form").on("mouseover",'.DOPFrontendBookingCalendarPRO_Day.curr_month.available',function(){
		$(this).find(".header").attr('style','background-color:#444 !important;border-color:#444 !important;');
		$(this).find(".content").attr('style','border-color:#444 !important;');
	}).on("mouseout",'.DOPFrontendBookingCalendarPRO_Day.curr_month.available',function(){
		$(this).find(".header").attr('style','background-color:#68ba68 !important;border-color:#68ba68 !important;');
		$(this).find(".content").attr('style','border-color:#68ba68 !important;');
	});
		
	var checkin=0;
	var checkinDate ="";
	
	function convertMonth(month) {
		nmonth="";
		if (month=="January") { 
			nmonth="01";
		} else if (month=="February") {
			nmonth="02"
		} else if (month=="March") {
			nmonth="03"
		} else if (month=="April") {
			nmonth="04"
		} else if (month=="May") {
			nmonth="05"
		} else if (month=="June") {
			nmonth="06"
		} else if (month=="July") {
			nmonth="07"
		} else if (month=="August") {
			nmonth="08"
		} else if (month=="September") {
			nmonth="09"
		} else if (month=="October") {
			nmonth="10"
		} else if (month=="November") {
			nmonth="11"
		} else if (month=="December") {
			nmonth="12"
		}
		return nmonth;
	}
	
	$("#booking-wrap").on("click",'#frontend-check-in .DOPFrontendBookingCalendarPRO_Day.curr_month.available',function(e){
		e.stopPropagation();
		checkin=$(this).find(".header .day").html();
		checkinDate=$(this).closest(".DOPFrontendBookingCalendarPRO_Container").find(".DOPFrontendBookingCalendarPRO_Navigation .month_year").html();
		
		checkinYear=checkinDate.match(/\d{4}/);
		checkinMonth=checkinDate.match(/[A-Za-z]*/);
		checkinMonth=convertMonth(checkinMonth);
		
		$("#check-in-date").val(checkinMonth+"/"+checkin+"/"+checkinYear);
		$("#frontend-check-in").css("display","none");
	}).on("click",'#frontend-check-out .DOPFrontendBookingCalendarPRO_Day.curr_month.available',function(e){
		e.stopPropagation();
		checkout=$(this).find(".header .day").html();
		checkoutDate=$(this).closest(".DOPFrontendBookingCalendarPRO_Container").find(".DOPFrontendBookingCalendarPRO_Navigation .month_year").html();
		
		checkoutYear=checkoutDate.match(/\d{4}/);
		checkoutMonth=checkoutDate.match(/[A-Za-z]*/);
		checkoutMonth=convertMonth(checkoutMonth);
		
		$("#check-out-date").val(checkoutMonth+"/"+checkout+"/"+checkoutYear);
		$("#frontend-check-out").css("display","none");
	});
				
				
	//Backend calendar for backend initializing
	$('#backend').DOPBackendBookingCalendarPRO({'ID': "0","DataURL":"../php/load.php", "SaveURL":"../php/save.php"});
	$('#backend2').DOPBackendBookingCalendarPRO({'ID': "1","DataURL":"../php/load.php", "SaveURL":"../php/save.php"});
	$('#backend3').DOPBackendBookingCalendarPRO({'ID': "2","DataURL":"../php/load.php", "SaveURL":"../php/save.php"});
	$('#backend4').DOPBackendBookingCalendarPRO({'ID': "3","DataURL":"../php/load.php", "SaveURL":"../php/save.php"});
	$('#backend5').DOPBackendBookingCalendarPRO({'ID': "4","DataURL":"../php/load.php", "SaveURL":"../php/save.php"});
	$('#backend6').DOPBackendBookingCalendarPRO({'ID': "5","DataURL":"../php/load.php", "SaveURL":"../php/save.php"});
	$('#backend7').DOPBackendBookingCalendarPRO({'ID': "6","DataURL":"../php/load.php", "SaveURL":"../php/save.php"});
	$('#backend8').DOPBackendBookingCalendarPRO({'ID': "7","DataURL":"../php/load.php", "SaveURL":"../php/save.php"});
	$('#backend9').DOPBackendBookingCalendarPRO({'ID': "8","DataURL":"../php/load.php", "SaveURL":"../php/save.php"});
	
		
	//Lightbox plugin for Galleries
	if (document.getElementById("is-gallery")) {
		$(".gallery-wrap .gallery-image-wrap a").lightBox();
	}
	
	
	//Toggle widget initializing
	var allPanels = $('.accordion-widget > .accordion-content').hide();
    $('.accordion-widget > .accordion-content.show').show();
	$('.toggle > .accordion-header > a').click(function() {
		if ( $(this).parent().next().is(":hidden") ) {
			$(this).parent().next().slideDown();
			$(this).children('span').attr('class','icon-minus').css('background-color','#de543e');
			$(this).parent().css({"border-bottom":"none"});
			$(this).css({"color":"#de543e"});
			$(this).parent().next().css('border-bottom','1px dotted #ddd');
		} else {
			$(this).parent().next().slideUp();
			$(this).css({"color":"#000"});
			$(this).children('span').attr('class','icon-minus').css('background-color','#000');
			$(this).children('span').attr('class','icon-plus');
			$(this).parent().css('border-bottom','1px dotted #ddd');
			$(this).parent().next().css('border-bottom','none');
		}
		
		return false;
	}); 
	
	$('.toggle > .accordion-header.show > a').click();
	
	
	//Accordion widget initializing
	$('.accordion > .accordion-header > a').click(function() {
		if ( $(this).parent().next().is(":hidden") ) {
			$(".accordion > .accordion-content").slideUp();
			$(".accordion > .accordion-header > a ").css('color','#000').children('span').attr('class','icon-plus').css('background-color','#000')
			
			$(this).parent().next().slideDown();
			$(this).children('span').attr('class','icon-minus').css('background-color','#de543e');
			$(this).parent().css({"border-bottom":"none"});
			$(this).css({"color":"#de543e"});
			$(this).parent().next().css('border-bottom','1px dotted #ddd');
		} 		
		return false;
	});
	
	$('.accordion > .accordion-header.show > a').click();
  
	//Tabs widget initializing
    $("#tabs-content > div").hide(); 
    $("#tabs li:first a").attr("id","current").parent().attr("id","current");
    $("#tabs-content > div:first").fadeIn();
    
    $("#tabs a").on("click",function(e) {
        e.preventDefault();
        if ($(this).attr("id") == "current"){
			return       
        } else {             
			$("#tabs-content > div").hide();
			$("#tabs a").attr("id","").parent().attr("id","");
			$(this).attr("id","current").parent().attr("id","current");
			$($(this).attr('name')).fadeIn();
        }
    }); 
	
	
	//Navigation menu dropdown initializing
	$("#top-navigation-menu > li, #top-language-select > .dropdown > li").on("mouseenter",function(){
        $(this).addClass("hover");
        $(this).find(".sub_menu").css('visibility', 'visible');
    }).on("mouseleave",function(){
        $(this).removeClass("hover");
        $(this).find(".sub_menu").css('visibility', 'hidden');
    });
	$("ul.dropdown li ul li:has(ul)").find("a:first").append(" &raquo; ");
	
	$("#top-navigation-menu > li > .sub_menu > li:has(ul)").on("mouseenter",function(){
        $(this).addClass("hover");
        $(this).find(".sub_menu2").css('visibility', 'visible');
    }).on("mouseleave",function(){
        $(this).removeClass("hover");
        $(this).find(".sub_menu2").css('visibility', 'hidden');
    });
	
	$("#top-navigation-menu > li").on("mouseenter",function(){
        $(this).find(".top-navigation-content-wrap").css('color','#de543e').find(".icon-angle-down").css('color','#de543e');
		$(this).find(".under-title").css('color','#de543e')
    }).on("mouseleave",function(){
        $(this).find(".top-navigation-content-wrap").css('color','#333').find(".icon-angle-down").css('color','#333');
		$(this).find(".under-title").css('color','#777')
	});
	
	$( "#top-navigation-menu li .top-navigation-content-wrap" ).last().css({"border-right":"0","margin-right":"0","padding-right":"0"});
	
	
	// Search dropdown initializing
	$("#top-search .icon-search").on("click",function(e){
		if ( $(this).parent().find("#top-search-window-wrap").css('display')== 'none' ) {
			 e.stopPropagation();
			$(this).parent().find("#top-search-window-wrap").css('display','block');
		} else {
			 e.stopPropagation();
			$(this).parent().find("#top-search-window-wrap").css('display','none').children('input').val("search..");
		}
	});
	$("#top-search-window-wrap input").on("click",function(){ 
		if ($(this).val() == "search..") {
			$(this).val("")
		}
	});
	
	
	// Show element with animation while scrolling page down
	var win = $(window);
	var mods = $(".module");
	var sideMods = $(".module-side");
	var bottomMods = $(".module-bottom");
	
	win.scroll(function(event) {
		mods.each(function(i, el) {
			var el = $(el);
			if (el.visible(true)) {
				el.addClass("come-in"); 
			} 
		});
		sideMods.each(function(i, el) {
			var el = $(el);
			if (el.visible(true)) {
				el.addClass("come-side"); 
			} 
		});
		bottomMods.each(function(i, el) {
			var el = $(el);
			if (el.visible(true)) {
				el.addClass("come-bottom"); 
			} 
		});
	});
	
	
	// Create overlay for room 
	$(".rooms-list-item-image-wrap").on("mouseenter",function() {
		$(this).find(".rooms-list-item-price").addClass('anim-disable').css("display","none");
		$(this).find(".room-main-list-overlay").css("display","block");
		var centeringHeight = $(this).find(".room-main-list-overlay").height()/2-$(this).find(".room-overlay-content").height()/2;
		var centeringWidth = $(this).find(".room-main-list-overlay").width()/2-$(this).find(".room-overlay-content").width()/2;
		$(this).find(".room-overlay-content").css("top",centeringHeight-20).css("left",centeringWidth).animate({"top":centeringHeight},500);
		$(this).find(".room-main-list-overlay").animate({opacity:"0.9"},500);
	}).on("mouseleave", function() {
		$(this).find(".room-main-list-overlay").animate({opacity:"0"},500, function() {
			$(this).find(".room-main-list-overlay").css("display","none");	
		});
		$(this).find(".rooms-list-item-price").css("display","inline-block");
	});
	
	
	// Create overlay for main news
	$(".main-blog-post-image-wrap").on("mouseenter",function() {
		$(this).find(".rooms-list-item-price").addClass('anim-disable').css("display","none");
		$(this).find(".room-main-list-overlay").css("display","block");
		var centeringHeight = $(this).find(".room-main-list-overlay").height()/2-$(this).find(".room-overlay-content").height()/2;
		var centeringWidth = $(this).find(".room-main-list-overlay").width()/2-$(this).find(".room-overlay-content").width()/2;
		$(this).find(".room-overlay-content").css("top",centeringHeight-20).css("left",centeringWidth).animate({"top":centeringHeight},500);
		$(this).find(".room-main-list-overlay").animate({opacity:"0.9"},500);
	}).on("mouseleave", function() {
		$(this).find(".room-main-list-overlay").animate({opacity:"0"},500, function() {
			$(this).find(".room-main-list-overlay").css("display","none");	
		});
		$(this).find(".rooms-list-item-price").css("display","inline-block");
	});
	
	
	// Create overlay for blog post
	$(".blog-image-wrap").on("mouseenter",function(){
		$(this).find(".blog-overlay").css("display","block");
		var centeringHeight = $(this).find(".blog-overlay").height()/2-$(this).find(".blog-overlay-content").height()/2;
		var centeringWidth = $(this).find(".blog-overlay").width()/2-$(this).find(".blog-overlay-content").width()/2;
		$(this).find(".blog-overlay-content").css("top",centeringHeight-20).css("left",centeringWidth).animate({"top":centeringHeight},500);
		$(this).find(".blog-overlay").animate({opacity:"0.9"},500);
	}).on("mouseleave", function() {
		$(this).find(".blog-overlay").animate({opacity:"0"},500, function() {
			$(this).find(".blog-overlay").css("display","none");	
		});
	});
	
	
	// Create overlay for gallery
	$(".gallery-item-wrap").on("mouseenter",function() {
		$(this).find(".room-main-list-overlay").css("display","block");
		var centeringHeight = $(this).find(".room-main-list-overlay").height()/2-$(this).find(".room-overlay-content").height()/2;
		var centeringWidth = $(this).find(".room-main-list-overlay").width()/2-$(this).find(".room-overlay-content").width()/2;
		$(this).find(".room-overlay-content").css("top",centeringHeight-20).css("left",centeringWidth).animate({"top":centeringHeight},500);
		$(this).find(".room-main-list-overlay").animate({opacity:"0.9"},500);
	}).on("mouseleave", function() {
		$(this).find(".room-main-list-overlay").animate({opacity:"0"},500, function() {
			$(this).find(".room-main-list-overlay").css("display","none");	
		});
		$(this).find(".rooms-list-item-price").css("display","inline-block");
	});
	
	
	//Blog single page form handling
	$(".blog-single #name-comments-field, .contact-page #name-comments-field").on("focus",function() {
		if ( $(this).val() == 'enter name') $(this).val('');
	}).on("blur", function(){
		if ( $(this).val() == '') $(this).val('enter name');
	});
	$(".blog-single #email-comments-field, .contact-page #email-comments-field ").on("focus",function() {
		if ( $(this).val() == 'enter email') $(this).val('');
	}).on("blur", function(){
		if ( $(this).val() == '') $(this).val('enter email');
	});
	$(".blog-single #text-comments-field").on("click",function() {
		if ( $(this).val() == 'enter comment text here') $(this).val('');
	}).on("blur", function(){
		if ( $(this).val() == '') $(this).val('enter comment text here');
	});
	
	
	//Footer subscribe form handling 
	$("#footer-subscribe-email-field").on("click",function() {
		if ( $(this).val() == 'email address') $(this).val('');
	}).on("blur", function(){
		if ( $(this).val() == '') $(this).val('email address');
	});
	
	
	//Contact page form handling
	$(".contact-page #phone-comments-field").on("click",function() {
		if ( $(this).val() == 'enter phone') $(this).val('');
	}).on("blur", function(){
		if ( $(this).val() == '') $(this).val('enter phone');
	});
	
	$(".contact-page #text-comments-field").on("click",function() {
		if ( $(this).val() == 'enter your message here...') $(this).val('');
	}).on("blur", function(){
		if ( $(this).val() == '') $(this).val('enter your message here...');
	});
	
	
	//Sidebar search handling
	$("#sidebar-search").on("click",function() {
		if ( $(this).val() == 'Search ...') $(this).val('');
	}).on("blur", function(){
		if ( $(this).val() == '') $(this).val('Search ...');
	});
	
	
	//Slider for reservation page
	$('.reservation-page-slider').revolution({
		delay:9000,
		startheight:450,
		startwidth:960,
		hideThumbs:0,
		thumbWidth:120,						// Thumb With and Height and Amount (only if navigation Type set to thumb !)
		thumbHeight:60,
		thumbAmount:3,
		navigationType:"bullet",			// bullet, thumb, none
		navigationArrows:"nexttobullets",	// nexttobullets, solo (old name verticalcentered), none
		navigationStyle:"round-old",			// round,square,navbar,round-old,square-old,navbar-old, or any from the list in the docu (choose between 50+ different item), custom
		navigationHAlign:"center",			// Vertical Align top,center,bottom
		navigationVAlign:"bottom",			// Horizontal Align left,center,right
		navigationHOffset:20,
		navigationVOffset:20,
		touchenabled:"on",					// Enable Swipe Function : on/off
		onHoverStop:"on",					// Stop Banner Timet at Hover on Slide on/off
		shadow:0,
		fullWidth:"off"						// Turns On or Off the Fullwidth Image Centering in FullWidth Modus
	});
	

	//If submit button on contact page is clicked prepare data end send to contact.php
	$('.contact-page #submit-button').click(function () {        

		//Get the data from all the fields
		var name = $('#name-comments-field');
		var email = $('#email-comments-field');
		var phone = $('#phone-comments-field');
		
		contactPhoneValue = '';
		
		if (phone.val() != '' && phone.val() != 'enter phone') {
			contactPhoneValue=phone.val();
		}
		
		var comment = $('#text-comments-field');
 
		//Simple validation to make sure user entered something
		//If error found, add hightlight class to the text field
		if (name.val()== '' || name.val()=='enter name') {
			name.addClass('hightlight');
			return false;
		} else name.removeClass('hightlight');
         
		if (email.val()=='' || email.val()=='enter email') {
			email.addClass('hightlight');
			return false;
		} else email.removeClass('hightlight');
         
		if (comment.val()=='' || comment.val()=='enter your message here...') {
			comment.addClass('hightlight');
			return false;
		} else comment.removeClass('hightlight');
         
		//Organize the data properly
		var data = 'name=' + name.val() + '&email=' + email.val() + '&phone_number='
		+ contactPhoneValue + '&message='  + encodeURIComponent(comment.val());
         
		//Disabled all the text fields
		$('.text').attr('disabled','true');

		//Show the loading sign
		$('.loading').show();
         
		//Start the ajax
		$.ajax({
			url: "contact.php", 
			type: "GET",        
			data: data,     
			cache: false,
             
			success: function (html) {              
				if (html==1) {                  
					$('form').fadeOut('slow');                 
					$('.form-intro-text').fadeOut('slow');
					$('.done').fadeIn('slow');
				} else alert('Sorry, unexpected error. Please try again later.');               
			}       
		});
         
		return false;
	}); 
	
	
	//If submit button on reservation form is clicked prepare data and send it to reservation.php
	$('.main-reservation-form #book-now-button').click(function() {        

		//Get the data from all the fields
		var name = $('#name-field');
		var surname = $('#surname-field');
		var email = $('#email-field');
		
		var phone = $('#phone-field');
		
		phoneValue='';
		additionalTextValue='';
		
		if (phone.val() != '' && phone.val() != 'enter your phone') {
			phoneValue=phone.val();
		}
		
		
		var roomType = $('#room-type');
		var reservationCheckIn = $('#check-in');
		var reservationCheckOut = $('#check-out');
		var reservationRoomNumber = $('#number-of-room');
		var reservationAdult = $('#adult-persons');
		var reservationChild = $('#child-persons');
		
		var creditCard = $('#credit-card-field');
		var cardHolder = $('#card-holder-field');
		var cvvCode = $('#cvv2-field')
		
		var additionalText = $('#additional-request-text');
		
		if (additionalText.val() != '' && additionalText.val() != "Want to clarify something? Enter your questions here and we'll reply to you!") {
			additionalTextValue=additionalText.val();
		}
		
		var reservationSum = $('#total-sum-calculate');
		
 
		//Simple validation to make sure user entered something
		//If error found, add hightlight class to the text field
		if (reservationCheckIn.val()=='' || reservationCheckIn.val()=='check-in date') {
			reservationCheckIn.addClass('hightlight');
			return false;
		} else reservationCheckIn.removeClass('hightlight');
		
		if (reservationCheckOut.val()=='' || reservationCheckOut.val()=='check-out date') {
			reservationCheckOut.addClass('hightlight');
			return false;
		} else reservationCheckOut.removeClass('hightlight');
		
		if (reservationRoomNumber.val()=='' || reservationRoomNumber.val()=='No. of room') {
			reservationRoomNumber.addClass('hightlight');
			return false;
		} else reservationRoomNumber.removeClass('hightlight');
		
		if (name.val()=='' || name.val()=='enter your name') {
			name.addClass('hightlight');
			return false;
		} else name.removeClass('hightlight');
        
		if (surname.val()=='' || surname.val()=='enter your surname') {
			surname.addClass('hightlight');
			return false;
		} else surname.removeClass('hightlight');
		
		if (email.val()=='' || email.val()=='enter your email') {
			email.addClass('hightlight');
			return false;
		} else email.removeClass('hightlight');
		
		if (creditCard.val()=='' || creditCard.val()=='XXXX-XXXX-XXXX-XXXX') {
			creditCard.addClass('hightlight');
			return false;
		} else creditCard.removeClass('hightlight');
		
		if (cardHolder.val()=='' || cardHolder.val()=='credit card holder name and surname') {
			cardHolder.addClass('hightlight');
			return false;
		} else cardHolder.removeClass('hightlight');
		
		if (cvvCode.val()=='' || cvvCode.val()=='XXX') {
			cvvCode.addClass('hightlight');
			return false;
		} else cvvCode.removeClass('hightlight');
         
		//Organize the data properly
		var data = 'name=' + name.val() + '&email=' + email.val() + '&surname=' + surname.val() + '&phone='
		+ phoneValue + '&room-type=' + roomType.val() + '&check-in=' + reservationCheckIn.val() + '&check-out=' + reservationCheckOut.val() 
		+ '&room-number=' + reservationRoomNumber.val() + '&adult-persons=' + reservationAdult.val() + '&child-persons=' + reservationChild.val() 
		+ '&credit-number=' + creditCard.val() + '&card-holder=' + cardHolder.val() + '&cvv-code=' + cvvCode.val() 
		+ '&additional-text='  + encodeURIComponent(additionalTextValue) + '&total-sum=' + reservationSum.html();
         
		//Disabled all the text fields
		$('.text').attr('disabled','true');

		//Show the loading sign
		$('.loading').show();
         
		//Start the ajax
		$.ajax({
			url: "reservation.php", 
			type: "GET",        
			data: data,     
			cache: false,
             
			success: function (html) {              
				if (html==1) {                  
					$('#general-info-wrap').fadeOut('slow');                 
					$('.done').fadeIn('slow');
					$("html, body").animate({ scrollTop: 0 }, "slow");
					
				} else alert('Sorry, unexpected error. Please try again later.');               
			}       
		});
         
		return false;
	});
	
	$.globalVar = { 
		id:0,
		sum:0
	};
	
	$('.form-date-picker-in#reservation-frontend'+$.globalVar.id).DOPFrontendBookingCalendarPRO({'ID': $.globalVar.id, "DataURL":"php/load.php", "Reinitialize":"true"}); 
	$('.form-date-picker-out#reservation-frontend'+$.globalVar.id).DOPFrontendBookingCalendarPRO({'ID': $.globalVar.id, "DataURL":"php/load.php", "Reinitialize":"true"}); 
	
	
	//Initialize Booking Calendar and place date in correct format after user pickup some date in it for reservation form
	$(".reservation-form-field-select").change(function(){
		$.globalVar.sum=0;

		$.globalVar.id = $(this).children(":selected").attr("id");
		$('.form-date-picker-in').css("display","none");
		$('.form-date-picker-out').css("display","none");
		
		if ($("#check-out").val()=='' ) $("#check-out").val('check-out date');
		if ($("#check-in").val()=='' ) $("#check-in").val('check-in date');
		
		$('.form-date-picker-in#reservation-frontend'+$.globalVar.id).DOPFrontendBookingCalendarPRO({'ID': $.globalVar.id, "DataURL":"php/load.php", "Reinitialize":"true"}); 
		$('.form-date-picker-out#reservation-frontend'+$.globalVar.id).DOPFrontendBookingCalendarPRO({'ID': $.globalVar.id, "DataURL":"php/load.php", "Reinitialize":"true"}); 
	
		if ($("#check-out").val() != '' && $("#check-out").val() != 'check-out date' && $("#check-in").val() != '' && $("#check-in").val() != 'check-in date') {
			$.globalVar.sum=0;
			$.ajax({
				url: "php/load.php",
				type: "POST",
				data: { dopbcp_calendar_id: $.globalVar.id },
					dataType: 'json',
					cache: false
			}).done(function( resObj ) {
				var firstDate=parseDate($("#check-in").val());
				var lastDate=parseDate($("#check-out").val());
				var curDate;
				$.each(resObj, function(index, element) {
					if (element.status=="available") {
						curDate=parseDate(index, true, true); 		
						if (curDate.getTime() >= firstDate.getTime() && curDate.getTime() <= lastDate.getTime()) {
							$.globalVar.sum=Number($.globalVar.sum)+Number(element.price);
						}
					}
				});
				$("#total-sum-calculate,.second-sum, .third-sum").html(" "+$.globalVar.sum+"$");
			});
		}
	
	});
	
	
	//Date picker for check-in and check-out in reservation forms
	$(".main-reservation-form #check-in").click(function(){
		$('.form-date-picker-out').css('display','none');
		$('.form-date-picker-in').css('display','none');
		$('.form-date-picker-in#reservation-frontend'+$.globalVar.id).css('display','block');
		if ($(this).val()=='check-in date' ) $(this).val(''); 
		if ($("#check-out").val()=='' ) $("#check-out").val('check-out date');
	});
	
	$(".main-reservation-form #check-out").click(function(){
		$('.form-date-picker-out').css('display','none');
		$('.form-date-picker-in').css('display','none');
		$('.form-date-picker-out#reservation-frontend'+$.globalVar.id).css('display','block');
		if ($(this).val()=='check-out date' ) $(this).val(''); 
		if ($("#check-in").val()=='' ) { 
			$("#check-in").val('check-in date');
		} 	
	});
	
	
	// Reservation form element handling
	$("#check-out-date").focus(function(){
		if ($(this).val()=='check-out date' ) $(this).val(''); 
		$('#frontend-check-out').css('display','block');
		$('#frontend-check-in').css('display','none');
		if ($("#check-in-date").val()=='' ) $("#check-in-date").val('check-in date');
	});
	
	$("#number-of-room").focus(function(){ 
		if ($(this).val()=='No. of room') $(this).val('');
	}).blur(function(){
		if ($(this).val()=='' ) $(this).val('No. of room');
	});
	
	$("#name-field").focus(function(){ 
		if ($(this).val()=='enter your name') $(this).val('');
	}).blur(function(){
		if ($(this).val()=='' ) $(this).val('enter your name');
	});
	
	$("#surname-field").focus(function(){ 
		if ($(this).val()=='enter your surname') $(this).val('');
	}).blur(function(){
		if ($(this).val()=='' ) $(this).val('enter your surname');
	});
	
	$("#email-field").focus(function(){ 
		if ($(this).val()=='enter your email') $(this).val('');
	}).blur(function(){
		if ($(this).val()=='' ) $(this).val('enter your email');
	});
	
	$("#phone-field").focus(function(){ 
		if ($(this).val()=='enter your phone') $(this).val('');
	}).blur(function(){
		if ($(this).val()=='' ) $(this).val('enter your phone');
	});
	
	$("#credit-card-field").focus(function(){ 
		if ($(this).val()=='XXXX-XXXX-XXXX-XXXX') $(this).val('');
	}).blur(function(){
		if ($(this).val()=='' ) $(this).val('XXXX-XXXX-XXXX-XXXX');
	});
	
	$("#credit-card-field").focus(function(){ 
		if ($(this).val()=='XXXX-XXXX-XXXX-XXXX') $(this).val('');
	}).blur(function(){
		if ($(this).val()=='' ) $(this).val('XXXX-XXXX-XXXX-XXXX');
	});
	
	$("#card-holder-field").focus(function(){ 
		if ($(this).val()=='credit card holder name and surname') $(this).val('');
	}).blur(function(){
		if ($(this).val()=='' ) $(this).val('credit card holder name and surname');
	});
	
	$("#cvv2-field").focus(function(){ 
		if ($(this).val()=='XXX') $(this).val('');
	}).blur(function(){
		if ($(this).val()=='' ) $(this).val('XXX');
	});
	
	$("#additional-request-text").focus(function(){ 
		if ($(this).val()=="Want to clarify something? Enter your questions here and we'll reply to you!") $(this).val('');
	}).blur(function(){
		if ($(this).val()=='' ) $(this).val("Want to clarify something? Enter your questions here and we'll reply to you!");
	});
	
	
	//Calculate overal booking cost for reservation form
	$(".main-reservation-form").on("click",'.form-date-picker-in .DOPFrontendBookingCalendarPRO_Day.curr_month.available',function(e){
		e.stopPropagation();
		checkin=$(this).find(".header .day").html();
		checkinDate=$(this).closest(".DOPFrontendBookingCalendarPRO_Container").find(".DOPFrontendBookingCalendarPRO_Navigation .month_year").html();
		
		checkinYear=checkinDate.match(/\d{4}/);
		checkinMonth=checkinDate.match(/[A-Za-z]*/);
		checkinMonth=convertMonth(checkinMonth);
		
		$("#check-in").val(checkinMonth+"/"+checkin+"/"+checkinYear);
		$(".form-date-picker-in").css("display","none");
		if ($("#check-out").val() != '' && $("#check-out").val() != 'check-out date') {
			$.globalVar.sum=0;
			$.ajax({
				url: "php/load.php",
				type: "POST",
				data: { dopbcp_calendar_id: $.globalVar.id },
					dataType: 'json',
					cache: false
			}).done(function( resObj ) {
				var firstDate=parseDate($("#check-in").val());
				var lastDate=parseDate($("#check-out").val());
				var curDate;
				$.each(resObj, function(index, element) {
					if (element.status=="available") {
						curDate=parseDate(index, true, true); 		
						if (curDate.getTime() >= firstDate.getTime() && curDate.getTime() <= lastDate.getTime()) {
							$.globalVar.sum=Number($.globalVar.sum)+Number(element.price);
						}
					}
				});
				$("#total-sum-calculate,.second-sum, .third-sum").html(" "+$.globalVar.sum+"$");
			});
		}
	}).on("click",'.form-date-picker-out .DOPFrontendBookingCalendarPRO_Day.curr_month.available',function(e){
		e.stopPropagation();
		checkin=$(this).find(".header .day").html();
		checkinDate=$(this).closest(".DOPFrontendBookingCalendarPRO_Container").find(".DOPFrontendBookingCalendarPRO_Navigation .month_year").html();
		
		checkinYear=checkinDate.match(/\d{4}/);
		checkinMonth=checkinDate.match(/[A-Za-z]*/);
		checkinMonth=convertMonth(checkinMonth);
		
		$("#check-out").val(checkinMonth+"/"+checkin+"/"+checkinYear);
		$(".form-date-picker-out").css("display","none");
		if ($("#check-in").val() != '' && $("#check-in").val() != 'check-out date') {
			$.globalVar.sum=0;
			$.ajax({
				url: "php/load.php",
				type: "POST",
				data: { dopbcp_calendar_id: $.globalVar.id },
					dataType: 'json',
					cache: false
			}).done(function( resObj ) {
				var firstDate=parseDate($("#check-in").val());
				var lastDate=parseDate($("#check-out").val());
				var curDate;
				$.each(resObj, function(index, element) {
					if (element.status=="available") {
						curDate=parseDate(index, true, true); 		
						if (curDate.getTime() >= firstDate.getTime() && curDate.getTime() <= lastDate.getTime()) {
							$.globalVar.sum=Number($.globalVar.sum)+Number(element.price);
						}
					}
				});
				$("#total-sum-calculate,.second-sum, .third-sum").html(" "+$.globalVar.sum+"$");
			});
		}
	});
	
	function parseDate(input,strip,calendar) {
		if (strip) {
			var parts = input.split('-');
		} else {
			var parts = input.split('/');
		}
		if (calendar) {
			return new Date(parts[0], parts[1]-1, parts[2]);
		} else {
			return new Date(parts[2], parts[0]-1, parts[1] );
		}
	}
	
	
	//Hide Datepickers if user click outside of it
	$('html').on("click", function() {
		if ($("#frontend-check-in").css("display")=="block") {
			$("#frontend-check-in").css("display","none");
			if ($("#check-in-date").val()=='') {
				$("#check-in-date").val("check-in date");
			}
		}
			
		if ($("#frontend-check-out").css("display")=="block") {
			$("#frontend-check-out").css("display","none");
			if ($("#check-out-date").val()=='') {
				$("#check-out-date").val("check-out date");
			}
		}
			
		if ($(".form-date-picker-in#reservation-frontend"+$.globalVar.id).css("display")=="block") {
			$(".form-date-picker-in#reservation-frontend"+$.globalVar.id).css("display","none");
			if ($(".main-reservation-form #check-in").val()=='') {
				$(".main-reservation-form #check-in").val("check-in date");
			}
		}
			
		if ($(".form-date-picker-out#reservation-frontend"+$.globalVar.id).css("display")=="block") {
			$(".form-date-picker-out#reservation-frontend"+$.globalVar.id).css("display","none");
			if ($(".main-reservation-form #check-out").val()=='') {
				$(".main-reservation-form #check-out").val("check-out date");
			}
		}
	});
	
	var roomNumber=0;
	$(".main-reservation-form #number-of-room").keyup(function(){
		roomNumber=parseInt($(this).val(),10)*$.globalVar.sum;
		$("#total-sum-calculate, .second-sum, .third-sum").html(" "+roomNumber+"$");
	});
	
	
	// Change order of some elements for mobile device 
	if ( $("#mobile-navigation-menu").css("display")=='block' ) {
		$("#second-par-wrap .right-aboutus-column").insertBefore("#second-par-wrap .left-aboutus-column");
		$("#headcontainer").insertAfter("#logocontainer");
	}
	
	$("#mobile-navigation-menu .icon-reorder").on("click",function(){
		if ($(this).parents("#mobile-navigation-menu").find("#mobile-navigation-menu-list").css("display")=="none") {
			$(this).parents("#mobile-navigation-menu").find("#mobile-navigation-menu-list").css("display","block");
		} else {
			$(this).parents("#mobile-navigation-menu").find("#mobile-navigation-menu-list").css("display","none");
		}
	});

	
	//---- Main google maps initializing ----
	if (document.getElementById("gmaps")) {
		var myOptions1 = { 
			//Coordinates of the map's center
			center: new google.maps.LatLng(40.710670, -73.999604), 
			//Zoom level
			zoom: 15,
			//Type of map (possible values .ROADMAP, .HYBRID, .SATELLITE, .TERRAIN)
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		//Define the map and select the element in which it will be displayed
		var map1 = new google.maps.Map(document.getElementById("gmaps"),myOptions1);
		var marker1 = new google.maps.Marker({
			//Coordinate of the marker's location
			position: new google.maps.LatLng(40.710670, -73.999604),
			map: map1,
			//Text that will be displayed when the mouse hover on the marker
			title:"Nation Hotel"
		});
		
		if (document.getElementById("is-contact-page")) {
			var contentString = "<div id='contact-info-window'>225 South West 37th Street, New York</div>";
			
			var infowindow = new google.maps.InfoWindow({
				content: contentString
			});
			
			infowindow.open(map1,marker1);
		}
	}
	
	
	// Function for read cookie
	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}	
		return null;
	}
	
	// Style switcher initialize 
		$('#style-switcher').on("click",function(){ 
		
			if ($('#style-form').css("display")=='none') {
				$('#style-form').show();
				$('#style-switcher').css({'left':'135px','padding-left':'13px'}); 
			} else {
				$('#style-form').hide();
				if ( readCookie('layout') != 'boxed' ) {
					$('#style-switcher').css({'left':'0px','padding-left':'13px'}); 
				} else {
					$('#style-switcher').css({'left':'0px','padding-left':'13px'}); 
				}
			}
		});
	
		$("#layout-select").change(function(){
			if ( $(this).val() == 'boxed' ) {
				$("link[href^='css/style']").attr('href','css/style_boxed_image.css');
				$("#style-switcher").css({'padding-left':'12px'});
				document.cookie="layout=boxed";
				location.reload();
			} else if ( $(this).val() == 'wide' ) {
				$("link[href^='css/style']").attr('href','css/style.css');
				$("#style-switcher").css({'padding-left':'12px'});
				document.cookie="layout=wide";
				location.reload();
			}
		});
	
		var switcher_layout = readCookie('layout');
		
		$("#bg-image1").click(function(){
			if ( switcher_layout == 'boxed') {
				$("link[href^='css/style']").attr('href','css/style_boxed_image.css');
				$("body").css('background-image','url(images/background-image1.jpg)');
				document.cookie="background=bg1";
				location.reload();
			} else {
				alert('You should switch to boxed layout first.');
			}
		});
	
		$("#bg-image2").click(function(){
			if ( switcher_layout == 'boxed') {
				$("link[href^='css/style']").attr('href','css/style_boxed_image.css');
				$("body").css('background-image','url(images/background-image2.jpg)');
				document.cookie="background=bg2";
				location.reload();
			} else {
				alert('You should switch to boxed layout first.');
			}
		});
	
		$("#bg-pattern1").click(function(){
			if ( switcher_layout == 'boxed') {
				$("link[href^='css/style']").attr('href','css/style_pattern.css');
				$("body").css('background-image','url(images/tileable_wood_texture.png)');
				document.cookie="background=bgp1";
				location.reload();
			} else {
				alert('You should switch to boxed layout first.');
			}
		});
	
		$("#bg-pattern4").click(function(){
			if ( switcher_layout == 'boxed') {
				$("link[href^='css/style']").attr('href','css/style_boxed_wood.css');
				document.cookie="background=bgp4";
				location.reload();
			} else {
				alert('You should switch to boxed layout first.');
			}
		});
	
		$("#bg-pattern3").click(function(){
			if ( switcher_layout == 'boxed') {
				$("link[href^='css/style']").attr('href','css/style_boxed_grunge.css');
				document.cookie="background=bgp3";
				location.reload();
			} else {
				alert('You should switch to boxed layout first.');
			}
		});
	
		$("#bg-pattern2").click(function(){
			if ( switcher_layout == 'boxed') {
				$("link[href^='css/style']").attr('href','css/style_boxed_wall.css');
				document.cookie="background=bgp2";
				location.reload();
			} else {
				alert('You should switch to boxed layout first.');
			}
		});
	
		var background_cookie = readCookie('background');
	
		$("#red-color").click(function(){
			$("#main-header-wrap").css('background-image','url(images/header-bg.png)');
			$(".sub-menu").css('background-image','url(images/submenu-bg.png)');
			$("#header-text").css('border-bottom','1px dotted #e85c76');
			$("#footer-wrap, #copyright-wrap").css('background-image','url(images/caption-bg.png)');
			$(".slider-caption11, .slider-caption12, .slider-caption21, .slider-caption22, .slider-caption31, .slider-caption32").css('background-color','#39cf76');
			document.cookie="color=red";
		});
	
		$("#pink-color").click(function(){
			$("#main-header-wrap, .sub-menu").css('background-image','url(images/header-bg2.png)');
			$("#header-text").css('border-bottom','1px dotted #f974ac');
			$("#footer-wrap, #copyright-wrap").css('background-image','url(images/caption-bg2.png)');
			$(".slider-caption11, .slider-caption12, .slider-caption21, .slider-caption22, .slider-caption31, .slider-caption32").css('background-color','#69C6B9');
			document.cookie="color=pink";
		});
	
		$("#purple-color").click(function(){
			$("#main-header-wrap, .sub-menu").css('background-image','url(images/header-bg3.png)');
			$("#header-text").css('border-bottom','1px dotted #9e9be6');
			$("#footer-wrap, #copyright-wrap").css('background-image','url(images/caption-bg3.png)');
			$(".slider-caption11, .slider-caption12, .slider-caption21, .slider-caption22, .slider-caption31, .slider-caption32").css('background-color','#39cf76');
			document.cookie="color=purple";
		});
	
		var color_cookie = readCookie('color');
		
		
		if ( switcher_layout == 'boxed' ) {
			$("link[href^='css/style']").attr('href','css/style_boxed_image.css');
			$("#layout-select option[value='boxed']").attr('selected','selected');
			$("#style-switcher").css({'padding-left':'10px'});
			if ( $(window).width() > 1060 && $(window).width() < 1290 ) { $("#wrapper").css("width","1060px"); }
			if ( $(window).width() > 1290 ) { $("#wrapper").css("width","1320px"); }	
		} else if ( switcher_layout == 'wide' ) {
			$("link[href^='css/style']").attr('href','css/style.css');
			$("#layout-select option[value='wide']").attr('selected','selected');
			$("#style-switcher").css({'padding-left':'10px'});
		} 
	
		if ( background_cookie == 'bg1' && switcher_layout == 'boxed' ) {
			$("link[href^='css/style']").attr('href','css/style_boxed_image.css');
			$("body").css('background-image','url(images/background-image1.jpg)');
			$("#back-to-top").css('border-color','#fff').children('span').css('color','#fff');
		} else if ( background_cookie == 'bg2' && switcher_layout == 'boxed' ) {
			$("link[href^='css/style']").attr('href','css/style_boxed_image.css');
			$("body").css('background-image','url(images/background-image2.jpg)');
			$("#back-to-top").css('border-color','#fff').children('span').css('color','#fff');
	
		} else if ( background_cookie == 'bgp1' && switcher_layout == 'boxed' ) {
			$("link[href^='css/style']").attr('href','css/style_pattern.css');
			$("body").css('background-image','url(images/tileable_wood_texture.png)');
		} else if ( background_cookie == 'bgp4' && switcher_layout == 'boxed' ) {
			$("link[href^='css/style']").attr('href','css/style_pattern.css');
			$("body").css('background-image','url(images/bgnoise_lg.png)');
		} else if ( background_cookie == 'bgp3' && switcher_layout == 'boxed' ) {
			$("link[href^='css/style']").attr('href','css/style_pattern.css');
			$("body").css('background-image','url(images/squairy_light.png)');
		} else if ( background_cookie == 'bgp2' && switcher_layout == 'boxed' ) {
			$("link[href^='css/style']").attr('href','css/style_pattern.css');
			$("body").css('background-image','url(images/subtle_white_feathers.png)');
		}
	
		if ( color_cookie == "red" ) {
			$("#main-header-wrap").css('background-image','url(images/header-bg.png)');
			$(".sub-menu").css('background-image','url(images/submenu-bg.png)');
			$("#header-text").css('border-bottom','1px dotted #e85c76');
			$("#footer-wrap, #copyright-wrap").css('background-image','url(images/caption-bg.png)');
			$(".slider-caption11, .slider-caption12, .slider-caption21, .slider-caption22, .slider-caption31, .slider-caption32").css('background-color','#39cf76');
		} else if ( color_cookie == "pink" ) {
			$("#main-header-wrap, .sub-menu").css('background-image','url(images/header-bg2.png)');
			$("#header-text").css('border-bottom','1px dotted #f974ac');
			$("#footer-wrap, #copyright-wrap").css('background-image','url(images/caption-bg2.png)');
			$(".slider-caption11, .slider-caption12, .slider-caption21, .slider-caption22, .slider-caption31, .slider-caption32").css('background-color','#69C6B9');
		} else if ( color_cookie == "purple" ) {
			$("#main-header-wrap, .sub-menu").css('background-image','url(images/header-bg3.png)');
			$("#header-text").css('border-bottom','1px dotted #9e9be6');
			$("#footer-wrap, #copyright-wrap").css('background-image','url(images/caption-bg3.png)');
			$(".slider-caption11, .slider-caption12, .slider-caption21, .slider-caption22, .slider-caption31, .slider-caption32").css('background-color','#39cf76');
		}
		
	
	/* Main Slider Initializing */
	var api = $('.banner').revolution({
		delay:16000,
		startwidth:1224,
		startheight:600,
		navigationType:"bullet",			// bullet, thumb, none
		navigationArrows:"solo",			// nexttobullets, solo (old name verticalcentered), none
		navigationStyle:"round-old",		// round,square,navbar,round-old,square-old,navbar-old, or any from the list in the docu (choose between 50+ different item), custom
		navigationHAlign:"center",			// Vertical Align top,center,bottom
		navigationVAlign:"bottom",			// Horizontal Align left,center,right
		touchenabled:"on",					// Enable Swipe Function : on/off
		onHoverStop:"on",					// Stop Banner Timet at Hover on Slide on/off
		shadow:0,
		fullwidth:"off"
	});

});

