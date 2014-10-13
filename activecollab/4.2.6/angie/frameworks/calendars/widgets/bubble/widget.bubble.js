(function($){$.fn.bubble=function(param){return this.each(function(){if($.isPlainObject(param)){this.settings=$.extend({pointTo:null,parent:$("body"),autoOpen:true,width:300,height:null,onClose:null,url:null,onSuccess:null,preventCloseOn:null,id:"bubble_trigger_"+Math.round(new Date().getTime()/1000),title:App.lang("Title")},param);this.settings.attrId="bubble-id";this.settings.style={background_color:"#FFFFFF",border_color:"#B3B3B3",horizontal:{width:20,height:10},vertical:{width:10,height:20},rounded:10};var parent=this.settings.parent;if(!(parent instanceof jQuery)){throw new Error("Parent is not a valid jquery object.")}if(this.settings.autoOpen){open.apply(this)}}else{if(param==="close"){close.apply(this)}else{if(param==="open"){open.apply(this)}else{if(param==="show"){show.apply(this)}else{if(param==="hide"){hide.apply(this)}}}}}})};function open(){var _this=this;var trigger=$(this);var settings=this.settings;var parent=settings.parent;var old_trigger=$("[bubble-id='"+settings.id+"']");if(old_trigger.length){old_trigger.bubble("close")}this.instance=null;var parentDefaultPosition=parent.css("position");if(parentDefaultPosition!="absolute"&&parentDefaultPosition!="relative"){parent.css("position","relative")}var bubble=make_bubble.apply(this);this.instance=bubble;bubble.appendTo(parent);trigger.scrollParent().bind("scroll.bubble_events",function(e){reposition.apply(_this)});reposition.apply(this);load_content.apply(this);focus_on_point.apply(this);initialize_close_handler.apply(this);initialize_resize_handler.apply(this);initialize_link_handler.apply(this);trigger.attr(settings.attrId,settings.id);$.data(trigger[0],"bubble",true);this.instance.on("resize.bubble_events",function(){reposition.apply(_this)})}function make_bubble(){var settings=this.settings;var render="";render+='<div class="bubble">';render+='<div class="bubble_container">';render+='<div class="bubble_title">'+settings.title+"</div>";render+='<div class="bubble_data"></div>';render+='<ul class="bubble_options">';render+='<li class="bubble_close">&nbsp;</li>';render+="</ul>";render+="</div>";render+='<div class="bubble_pointer_wrapper">';render+='<canvas class="bubble_pointer"></canvas>';render+="</div>";render+="</div>";var bubble=$(render);bubble.find("div.bubble_container").css("border-radius",settings.style.rounded);if(settings.width){bubble.css("width",settings.width+"px")}if(settings.height){bubble.css("height",settings.height+"px")}bubble.css("z-index",App.getZIndex());return bubble}function close(){var trigger=$(this);var settings=this.settings;if(!this.instance){return false}this.instance.remove();this.instance=null;trigger.removeAttr(settings.attrId);$.removeData(trigger[0],"bubble");$("*").unbind(".bubble_events");if(settings.onClose){App.Wireframe.Events.trigger(settings.onClose,[this])}return true}function show(){var instance=this.instance;instance.show()}function hide(){var instance=this.instance;instance.hide()}function load_content(){var _this=this;if(!this.instance){return false}var bubble=this.instance;var settings=this.settings;if(!(bubble instanceof jQuery)){throw new Error(App.lang("Bubble not initialized"))}if(settings.url){$.ajax({url:App.extendUrl(settings.url,{async:1,on_calendar:1}),type:"GET",beforeSend:function(){bubble.find("div.bubble_data").empty().addClass("loading")},success:function(response){bubble.find("div.bubble_data").removeClass("loading").html(response);reposition.apply(_this)}})}bubble.on("submit","form",function(e){e.preventDefault();var form=$(this);var url=App.extendUrl($(this).attr("action"),{async:1});$.ajax({url:url,type:"POST",data:form.serialize(),beforeSend:function(){App.Wireframe.LoadingIndicator.show();close.apply(_this)},success:function(response){App.Wireframe.LoadingIndicator.hide();if(settings.onSuccess){App.Wireframe.Events.trigger(settings.onSuccess,[response])}}});return false})}function reposition(){var settings=this.settings;var parent=settings.parent;if(!this.instance){return false}var trigger=$(this);if(settings.pointTo&&settings.pointTo instanceof jQuery&&!$.isEmptyObject(settings.pointTo)){var point=settings.pointTo}else{var point=trigger}var bubble=this.instance;var bubble_container=bubble.children("div.bubble_container");var bubble_pointer_wrapper=bubble.children("div.bubble_pointer_wrapper");var bubble_pointer=bubble_pointer_wrapper.find("canvas.bubble_pointer");bubble_container.css("border-color",settings.style.border_color);var position_options=["right","left","top","bottom"];var ctx=bubble_pointer.get(0).getContext("2d");var no_free_space=true;bubble.css("padding",0);$.each(position_options,function(index,value){switch(value){case"top":var width=settings.style.horizontal.width;var height=settings.style.horizontal.height;var padding=height;var space_vertical=point.offset().top-padding-bubble.height();if(space_vertical<=parent.offset().top){return true}var pointer_point=(point.offset().left+(point.outerWidth()/2))-(width/2);var new_bubble_offset_left=pointer_point-settings.style.rounded;var difference=(new_bubble_offset_left+bubble.outerWidth())-(parent.offset().left+parent.innerWidth());var pointer_position=settings.style.rounded;if(difference>0){pointer_position+=difference;new_bubble_offset_left-=difference}if((pointer_position+width)>=(bubble.innerWidth()-settings.style.rounded)){return true}bubble.css("padding-bottom",padding);bubble_pointer.attr("width",width).attr("height",height);ctx.fillStyle=settings.style.background_color;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(width/2,height);ctx.lineTo(width,0);ctx.lineTo(0,0);ctx.fill();ctx.strokeStyle=settings.style.border_color;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(width/2,height);ctx.lineTo(width,0);ctx.stroke();bubble_pointer_wrapper.css("left",pointer_position).css("top",bubble.height()-1);bubble.offset({top:space_vertical,left:new_bubble_offset_left});no_free_space=false;break;case"right":var width=settings.style.vertical.width;var height=settings.style.vertical.height;var padding=width;var space_horizontal=point.offset().left+point.outerWidth()+padding+bubble.outerWidth();if(space_horizontal>=(parent.offset().left+parent.innerWidth())){return true}var pointer_point=(point.offset().top+(point.outerHeight()/2))-(height/2);var new_bubble_offset_top=pointer_point-settings.style.rounded;var difference=(new_bubble_offset_top+bubble.outerHeight())-(parent.offset().top+parent.innerHeight());var pointer_position=settings.style.rounded;if(difference>0){pointer_position+=difference;new_bubble_offset_top-=difference}if((pointer_position+height)>=(bubble.innerHeight()-settings.style.rounded)){return true}bubble.css("padding-left",padding);bubble_pointer.attr("width",width).attr("height",height);ctx.fillStyle=settings.style.background_color;ctx.beginPath();ctx.moveTo(width,0);ctx.lineTo(0,height/2);ctx.lineTo(width,height);ctx.lineTo(width,0);ctx.fill();ctx.strokeStyle=settings.style.border_color;ctx.beginPath();ctx.moveTo(width,0);ctx.lineTo(0,height/2);ctx.lineTo(width,height);ctx.stroke();bubble_pointer_wrapper.css("left",1).css("top",pointer_position);bubble.offset({top:new_bubble_offset_top,left:point.offset().left+point.outerWidth()});no_free_space=false;break;case"bottom":var width=settings.style.horizontal.width;var height=settings.style.horizontal.height;var padding=height;var space_vertical=point.offset().top-padding-bubble.height();if(space_vertical<=parent.offset().top){return true}var pointer_position=(point.offset().left+(point.outerWidth()/2))-(width/2);var new_bubble_offset_left=pointer_position-settings.style.rounded;var difference=(new_bubble_offset_left+bubble.outerWidth())-(parent.offset().left+parent.innerWidth());if(difference>0){pointer_position+=difference;new_bubble_offset_left-=difference}if((pointer_position+width)>=(bubble.innerWidth()-settings.style.rounded)){return true}bubble.css("padding-top",padding);bubble_pointer.attr("width",width).attr("height",height);ctx.fillStyle=settings.style.background_color;ctx.beginPath();ctx.moveTo(0,height);ctx.lineTo(width/2,height);ctx.lineTo(width,0);ctx.lineTo(0,height);ctx.fill();ctx.strokeStyle=settings.style.border_color;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(width/2,height);ctx.lineTo(width,0);ctx.stroke();bubble_pointer_wrapper.css("left",pointer_position).css("top",1);bubble.offset({top:point.offset().top+point.outerHeight(),left:new_bubble_offset_left});no_free_space=false;break;case"left":var width=settings.style.vertical.width;var height=settings.style.vertical.height;var padding=width;var space_horizontal=point.offset().left-padding-bubble.width();if(space_horizontal<=parent.offset().left){return true}var pointer_point=(point.offset().top+(point.outerHeight()/2))-(height/2);var new_bubble_offset_top=pointer_point-settings.style.rounded;var difference=(new_bubble_offset_top+bubble.outerHeight())-(parent.offset().top+parent.innerHeight());var pointer_position=settings.style.rounded;if(difference>0){pointer_position+=difference;new_bubble_offset_top-=difference}if((pointer_position+height)>=(bubble.innerHeight()-settings.style.rounded)){return true}bubble.css("padding-right",padding);bubble_pointer.attr("width",width).attr("height",height);ctx.fillStyle=settings.style.background_color;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(width,height/2);ctx.lineTo(0,height);ctx.lineTo(0,0);ctx.fill();ctx.strokeStyle=settings.style.border_color;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(width,height/2);ctx.lineTo(0,height);ctx.stroke();bubble_pointer_wrapper.css("left",bubble.width()-1).css("top",pointer_position);bubble.offset({top:new_bubble_offset_top,left:space_horizontal});no_free_space=false;break}return no_free_space})}function initialize_close_handler(){var _this=this;var settings=_this.settings;var prevent_close_classes=new Array(".bubble");if(settings.preventCloseOn){var custom_prevent_close=settings.preventCloseOn.split(",");$.each(custom_prevent_close,function(index,value){prevent_close_classes.push(value.trim())})}var all=$("*");all.bind("keydown.bubble_events",function(e){if(e.keyCode==27){close.apply(_this)}});all.bind("click.bubble_events",function(e){var target=$(e.target);var has_class=false;$.each(prevent_close_classes,function(index,value){if(target.is(value)){has_class=true;return false}});if(target.parents(prevent_close_classes.join(", ")).length||has_class){return true}close.apply(_this)});_this.instance.find("li.bubble_close").bind("click.bubble_events",function(){close.apply(_this);return false})}function initialize_resize_handler(){var _this=this;var window_object=$(window);window_object.resize(function(){reposition.apply(_this)})}function initialize_link_handler(){var _this=this;var bubble=this.instance;bubble.find(".bubble_link").on("click.bubble_events",function(e){var target=$(e.target);if(target.is("a.bubble_link")){var url=$(this).attr("href");if(url){close.apply(_this);App.Wireframe.Content.setFromUrl(url)}return false}})}function focus_on_point(){var settings=this.settings;var point=settings.pointTo;var scrollable_parent=point.scrollParent();var offset_top=scrollable_parent.offset().top;scrollable_parent.scrollTo((point.offset().top)-offset_top)}}(jQuery));