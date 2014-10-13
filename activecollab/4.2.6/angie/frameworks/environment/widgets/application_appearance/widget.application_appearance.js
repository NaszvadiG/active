(function($){App.widgets.ApplicationAppearance=function(){var wrapper;var options;var scheme_list;var scheme_details;var scheme_details_title;var scheme_details_rename_button;var scheme_details_preview;var scheme_details_preview_background_color;var scheme_details_preview_outer_color;var scheme_details_preview_inner_color;var scheme_details_preview_link_color;var scheme_details_form;var scheme_details_field_background_color;var scheme_details_field_container_background_color;var scheme_details_field_inner_color;var scheme_details_field_container_inner_color;var scheme_details_field_outer_color;var scheme_details_field_container_outer_color;var scheme_details_field_link_color;var scheme_details_field_container_link_color;var scheme_details_edit_buttons;var scheme_details_button_remove_scheme;var scheme_details_button_save_scheme;var scheme_details_set_active_scheme_wrapper;var scheme_details_button_set_active_scheme;var scheme_details_save_progress;var scheme_preview;var scheme_preview_canvas;var scheme_preview_layer_1;var scheme_preview_layer_2;var scheme_preview_layer_3;var scheme_preview_page_background;var scheme_preview_page_content;var scheme_preview_page_breadcrumbs;var scheme_preview_page_active_tab;var scheme_preview_page_title;var scheme_preview_page_object_list_background;var scheme_preview_page_selection;var render_scheme_list_item=function(scheme_id,scheme){return'<li scheme_id="'+scheme_id+'" class="scheme"><span class="scheme_name">'+App.clean(App.excerpt(scheme.name,22))+'</span><span class="scheme_colors"><span class="scheme_background_color" style="background-color: '+scheme.background_color+'"></span><span class="scheme_outer_color" style="background-color: '+scheme.outer_color+'"></span><span class="scheme_inner_color" style="background-color: '+scheme.inner_color+'"></span><span class="scheme_link_color" style="background-color: '+scheme.link_color+'"></span></span></li>'};var saving=false;var current_scheme_id=false;var render_scheme_list=function(){var schemes=options.schemes;if(!schemes||$.isEmptyObject(schemes)){return true}$.each(schemes,function(scheme_id,scheme){scheme_list.append(render_scheme_list_item(scheme_id,scheme))});scheme_list.append('<li class="add_new">'+App.lang("Add new")+"</li>");scheme_list.on("click","li.scheme",function(){focus_scheme($(this).attr("scheme_id"));return false});scheme_list.on("click","li.add_new",function(){var scheme_add_new=$(this);var scheme_name=prompt(App.lang("Please enter color scheme name"));if(!scheme_name){return false}var new_scheme_id=App.slug(scheme_name);var new_scheme=jQuery.extend({},options.default_scheme,{name:scheme_name,read_only:false,"new":true});if(options.schemes[new_scheme_id]){App.Wireframe.Flash.error("Theme with that name already exists");return false}scheme_add_new.before(render_scheme_list_item(new_scheme_id,new_scheme));options.schemes[new_scheme_id]=new_scheme;focus_scheme(new_scheme_id);save_scheme(new_scheme_id);return false});scheme_list.find('li[scheme_id="'+options.active_scheme_id+'"]').addClass("active")};var get_save_data=function(scheme_id){var scheme=options.schemes[scheme_id];var save_data={submitted:"submitted"};save_data.id=scheme_id;save_data.name=scheme.name;save_data.background_color=scheme_details_field_background_color.val();save_data.outer_color=scheme_details_field_outer_color.val();save_data.inner_color=scheme_details_field_inner_color.val();save_data.link_color=scheme_details_field_link_color.val();return save_data};var save_scheme=function(scheme_id){var scheme=options.schemes[scheme_id];var is_new=scheme["new"];var save_url=is_new?options.add_scheme_url:options.edit_scheme_url.replace("--SCHEME-ID--",scheme_id);var edit_buttons_visible=scheme_details_edit_buttons.is(":visible");var set_active_scheme_visible=scheme_details_set_active_scheme_wrapper.is(":visible");var progress_height=0;progress_height+=edit_buttons_visible?scheme_details_edit_buttons.height():0;progress_height+=set_active_scheme_visible?scheme_details_set_active_scheme_wrapper.height():0;scheme_details_edit_buttons.hide();scheme_details_set_active_scheme_wrapper.hide();scheme_details_save_progress.show().css("height",progress_height+"px");saving=true;$.ajax({url:save_url,type:"post",data:get_save_data(scheme_id),complete:function(response){saving=false;if(edit_buttons_visible){scheme_details_edit_buttons.show()}if(set_active_scheme_visible){scheme_details_set_active_scheme_wrapper.show()}scheme_details_save_progress.hide()},success:function(response){options.schemes[scheme_id]=response;if(response.read_only){scheme_details_edit_buttons.hide()}var row_in_list=scheme_list.find('li[scheme_id="'+scheme_id+'"]');$(render_scheme_list_item(scheme_id,response)).addClass("selected").insertAfter(row_in_list);row_in_list.remove();if(is_new){App.Wireframe.Flash.success("Successfully added new color scheme")}else{App.Wireframe.Flash.success("Color scheme successfully updated")}}})};var rename_scheme=function(scheme_id){var scheme=options.schemes[scheme_id];var rename_url=options.rename_scheme_url.replace("--SCHEME-ID--",scheme_id);var new_name=prompt(App.lang("Enter new scheme name"),scheme.name);if(!new_name){return false}var new_id=App.slug(new_name);var edit_buttons_visible=scheme_details_edit_buttons.is(":visible");var set_active_scheme_visible=scheme_details_set_active_scheme_wrapper.is(":visible");var progress_height=0;progress_height+=edit_buttons_visible?scheme_details_edit_buttons.height():0;progress_height+=set_active_scheme_visible?scheme_details_set_active_scheme_wrapper.height():0;scheme_details_edit_buttons.hide();scheme_details_set_active_scheme_wrapper.hide();scheme_details_save_progress.show().css("height",progress_height+"px");saving=true;$.ajax({url:rename_url,type:"post",data:{submitted:"submitted",new_id:new_id,new_name:new_name},complete:function(response){saving=false;if(edit_buttons_visible){scheme_details_edit_buttons.show()}if(set_active_scheme_visible){scheme_details_set_active_scheme_wrapper.show()}scheme_details_save_progress.hide()},success:function(response){if(options.schemes[scheme_id]){delete options.schemes[scheme_id]}options.schemes[new_id]=response;if(response.read_only){scheme_details_edit_buttons.hide()}var row_in_list=scheme_list.find('li[scheme_id="'+scheme_id+'"]');if(row_in_list.length){row_in_list.attr("scheme_id",new_id);row_in_list.find("span.scheme_name").html(response.name)}current_scheme_id=new_id;scheme_details_title.html(response.name);App.Wireframe.Flash.success("Scheme renamed")}})};var delete_scheme=function(scheme_id){var edit_buttons_visible=scheme_details_edit_buttons.is(":visible");var set_active_scheme_visible=scheme_details_set_active_scheme_wrapper.is(":visible");var progress_height=0;progress_height+=edit_buttons_visible?scheme_details_edit_buttons.height():0;progress_height+=set_active_scheme_visible?scheme_details_set_active_scheme_wrapper.height():0;scheme_details_edit_buttons.hide();scheme_details_set_active_scheme_wrapper.hide();scheme_details_save_progress.show().css("height",progress_height+"px");saving=true;$.ajax({url:options.delete_scheme_url.replace("--SCHEME-ID--",scheme_id),type:"post",data:{submitted:"submitted"},complete:function(response){saving=false;if(edit_buttons_visible){scheme_details_edit_buttons.show()}if(set_active_scheme_visible){scheme_details_set_active_scheme_wrapper.show()}scheme_details_save_progress.hide()},success:function(response){scheme_list.find('li[scheme_id="'+scheme_id+'"]').remove();if(options.active_scheme_id==scheme_id){scheme_list.find("li.active").removeClass("active");scheme_list.find('li[scheme_id="default"]').addClass("active");focus_scheme("default")}else{focus_scheme(options.active_scheme_id)}App.Wireframe.Flash.success("Scheme deleted")}})};var set_as_default_scheme=function(scheme_id){var edit_buttons_visible=scheme_details_edit_buttons.is(":visible");var set_active_scheme_visible=scheme_details_set_active_scheme_wrapper.is(":visible");var progress_height=0;progress_height+=edit_buttons_visible?scheme_details_edit_buttons.height():0;progress_height+=set_active_scheme_visible?scheme_details_set_active_scheme_wrapper.height():0;scheme_details_edit_buttons.hide();scheme_details_set_active_scheme_wrapper.hide();scheme_details_save_progress.show().css("height",progress_height+"px");saving=true;$.ajax({url:options.set_as_default_scheme_url.replace("--SCHEME-ID--",scheme_id),type:"post",data:get_save_data(scheme_id),complete:function(response){saving=false;if(edit_buttons_visible){scheme_details_edit_buttons.show()}if(set_active_scheme_visible){scheme_details_set_active_scheme_wrapper.show()}scheme_details_save_progress.hide()},success:function(response){options.schemes[scheme_id]=response;if(response.read_only){scheme_details_edit_buttons.hide()}var row_in_list=scheme_list.find('li[scheme_id="'+scheme_id+'"]');$(render_scheme_list_item(scheme_id,response)).addClass("selected").insertAfter(row_in_list);row_in_list.remove();scheme_list.find("li.active").removeClass("active");scheme_list.find('li[scheme_id="'+scheme_id+'"]').addClass("active");options.active_scheme_id=scheme_id;App.Wireframe.Flash.success("Scheme set as default")}})};var focus_scheme=function(scheme_id){var scheme=options.schemes[scheme_id];if(!scheme){return false}current_scheme_id=scheme_id;scheme_list.find("li").removeClass("selected");scheme_list.find('li[scheme_id="'+scheme_id+'"]').addClass("selected");scheme_details_title.html(App.clean(scheme.name));set_background_color(scheme.background_color);set_outer_color(scheme.outer_color);set_inner_color(scheme.inner_color);set_link_color(scheme.link_color);if(scheme.read_only){scheme_details_edit_buttons.hide();scheme_details_field_container_background_color.colorField("disable");scheme_details_field_container_outer_color.colorField("disable");scheme_details_field_container_inner_color.colorField("disable");scheme_details_field_container_link_color.colorField("disable");scheme_details_rename_button.removeClass("not_read_only").addClass("read_only").hide()}else{scheme_details_edit_buttons.show();scheme_details_field_container_background_color.colorField("enable");scheme_details_field_container_outer_color.colorField("enable");scheme_details_field_container_inner_color.colorField("enable");scheme_details_field_container_link_color.colorField("enable");scheme_details_rename_button.addClass("not_read_only").removeClass("read_only").show()}};var set_background_color=function(color){scheme_details_preview_background_color.css("background-color",color);scheme_preview_page_background.css("background-color",color);scheme_details_field_container_background_color.colorField("set_color",color)};var set_outer_color=function(color){scheme_details_preview_outer_color.css("background-color",color);scheme_preview_page_active_tab.css("background-color",color);scheme_preview_page_breadcrumbs.css("background-color",color);scheme_details_field_container_outer_color.colorField("set_color",color)};var set_inner_color=function(color){scheme_details_preview_inner_color.css("background-color",color);scheme_preview_page_object_list_background.css("background-color",color);scheme_details_field_container_inner_color.colorField("set_color",color)};var set_link_color=function(color){scheme_details_preview_link_color.css("background-color",color);scheme_details_field_container_link_color.colorField("set_color",color);scheme_preview_page_selection.css("background-color",color)};var render_scheme_details=function(){scheme_details=$('<div class="application_appearance_widget_scheme_details"></div>').appendTo(wrapper);scheme_details_title=$('<div class="application_appearance_widget_scheme_details_title">Details Title</div>').appendTo(scheme_details);scheme_details_rename_button=$('<div class="application_appearance_widget_scheme_details_rename"></div>').appendTo(scheme_details).click(function(){rename_scheme(current_scheme_id);return false});scheme_details_preview=$('<div class="application_appearance_widget_scheme_details_preview"></div>').appendTo(scheme_details);scheme_details_preview_background_color=$('<div class="application_appearance_widget_scheme_details_preview_background_color"></div>').appendTo(scheme_details_preview);scheme_details_preview_outer_color=$('<div class="application_appearance_widget_scheme_details_preview_outer_color"></div>').appendTo(scheme_details_preview);scheme_details_preview_inner_color=$('<div class="application_appearance_widget_scheme_details_preview_inner_color"></div>').appendTo(scheme_details_preview);scheme_details_preview_link_color=$('<div class="application_appearance_widget_scheme_details_preview_link_color"></div>').appendTo(scheme_details_preview);scheme_details_form=$('<form method="post" action="#"></form>').appendTo(scheme_details);var scheme_details_background_color=$('<div class="control_holder"></div>').appendTo(scheme_details_form);var scheme_details_label_background_color=$('<label class="main_label">'+App.lang("Page Color")+":</label>").appendTo(scheme_details_background_color);scheme_details_field_container_background_color=$('<div class="control_container"></div>').appendTo(scheme_details_background_color);scheme_details_field_container_background_color.colorField({name:"background_color",value:"#dddddd",on_change:function(color){set_background_color("#"+color)}});scheme_details_field_background_color=scheme_details_field_container_background_color.find("input:first");var scheme_details_outer_color=$('<div class="control_holder"></div>').appendTo(scheme_details_form);var scheme_details_label_outer_color=$('<label class="main_label">'+App.lang("Outer Color")+":</label>").appendTo(scheme_details_outer_color);scheme_details_field_container_outer_color=$('<div class="control_container"></div>').appendTo(scheme_details_outer_color);scheme_details_field_container_outer_color.colorField({name:"outer_color",value:"#dddddd",on_change:function(color){set_outer_color("#"+color)}});scheme_details_field_outer_color=scheme_details_field_container_outer_color.find("input:first");var scheme_details_inner_color=$('<div class="control_holder"></div>').appendTo(scheme_details_form);var scheme_details_label_inner_color=$('<label class="main_label">'+App.lang("Inner Color")+":</label>").appendTo(scheme_details_inner_color);scheme_details_field_container_inner_color=$('<div class="control_container"></div>').appendTo(scheme_details_inner_color);scheme_details_field_container_inner_color.colorField({name:"inner_color",value:"#dddddd",on_change:function(color){set_inner_color("#"+color)}});scheme_details_field_inner_color=scheme_details_field_container_inner_color.find("input:first");var scheme_details_link_color=$('<div class="control_holder"></div>').appendTo(scheme_details_form);var scheme_details_label_link_color=$('<label class="main_label">'+App.lang("Link Color")+":</label>").appendTo(scheme_details_link_color);scheme_details_field_container_link_color=$('<div class="control_container"></div>').appendTo(scheme_details_link_color);scheme_details_field_container_link_color.colorField({name:"link_color",value:"#dddddd",on_change:function(color){set_link_color("#"+color)}});scheme_details_field_link_color=scheme_details_field_container_link_color.find("input:first");scheme_details_edit_buttons=$('<div class="application_appearance_widget_scheme_details_edit_buttons"></div>').appendTo(scheme_details);scheme_details_button_remove_scheme=$("<button>"+App.lang("Save scheme")+"</button>").appendTo(scheme_details_edit_buttons).click(function(){save_scheme(current_scheme_id);return false});scheme_details_button_save_scheme=$("<button>"+App.lang("Delete scheme")+"</button>").appendTo(scheme_details_edit_buttons).click(function(){delete_scheme(current_scheme_id);return false});scheme_details_set_active_scheme_wrapper=$('<div class="application_appearance_widget_scheme_details_set_active_scheme_wrapper"></div>').appendTo(scheme_details);scheme_details_button_set_active_scheme=$('<button class="default">'+App.lang("Use this scheme")+"</button>").appendTo(scheme_details_set_active_scheme_wrapper).click(function(){set_as_default_scheme(current_scheme_id);return false});scheme_details_save_progress=$('<div class="application_appearance_widget_scheme_details_save_indicator"></div>').appendTo(scheme_details).hide()};var render_scheme_preview=function(){scheme_preview=$('<div class="application_appearance_widget_scheme_preview"></div>').appendTo(wrapper);scheme_preview_canvas=$('<div class="application_appearance_widget_scheme_preview_canvas"></div>').appendTo(scheme_preview);scheme_preview_layer_1=$('<div class="application_appearance_widget_scheme_preview_layer application_appearance_widget_scheme_preview_layer_1"></div>').appendTo(scheme_preview_canvas);scheme_preview_layer_2=$('<div class="application_appearance_widget_scheme_preview_layer application_appearance_widget_scheme_preview_layer_2"></div>').appendTo(scheme_preview_canvas);scheme_preview_layer_3=$('<div class="application_appearance_widget_scheme_preview_layer application_appearance_widget_scheme_preview_layer_3"></div>').appendTo(scheme_preview_canvas);scheme_preview_page_background=$('<div class="application_appearance_widget_scheme_preview_page_background"></div>').appendTo(scheme_preview_layer_2);scheme_preview_page_content=$('<div class="application_appearance_widget_scheme_preview_page_content"></div>').appendTo(scheme_preview_layer_2);scheme_preview_page_breadcrumbs=$('<div class="application_appearance_widget_scheme_preview_page_breadcrumbs"></div>').appendTo(scheme_preview_layer_2);scheme_preview_page_active_tab=$('<div class="application_appearance_widget_scheme_preview_page_active_tab"></div>').appendTo(scheme_preview_layer_2);scheme_preview_page_title=$('<div class="application_appearance_widget_scheme_preview_page_title"></div>').appendTo(scheme_preview_layer_2);scheme_preview_page_object_list_background=$('<div class="application_appearance_widget_scheme_preview_page_object_list_background"></div>').appendTo(scheme_preview_layer_2);scheme_preview_page_selection=$('<div class="application_appearance_widget_scheme_preview_page_selection"></div>').appendTo(scheme_preview_layer_2).css("opacity","0.7")};return{init:function(wrapper_id,initial_options){wrapper=$("#"+wrapper_id).addClass("application_appearance_widget");options=initial_options;scheme_list=$('<ul class="application_appearance_widget_scheme_list"></ul>').appendTo(wrapper);render_scheme_list();render_scheme_details();render_scheme_preview();focus_scheme(options.active_scheme_id)}}}()}(jQuery));