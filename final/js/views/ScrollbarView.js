 window.ScrollbarView = Backbone.View.extend({

     initialized:false,
     hInt:null,
     n:0,
     startY:0,
     target:null,
     container:null,
     nativeScroll:null,
     contentHeight:null,
     boxHeight:null,
     scrollbarHandle:null,
     scrollPosition:null,
     currentScrollPosition:0,
     currentTargetHeight:0,
     contentPosition:null,
     isScrollingWithMouse:false,
     isScrollingWithMenu:false,
     scrollBarHandlePosition:null,
     position:null,
     scroll_class:null,
     win:jQuery(document),
     scrollEventHandler:null,
     scrollPressHandler:null,
     scrollStopHandler:null,

    initialize:function () {
        var scr = this;
        (function(view) {
          scr.sInt = window.setInterval(function() { view.measure(); }, 100);
      })(this);

    },

    render:function()   {
        this.target = this.options.target;
        this.container = this.options.container;
        this.scroll_class = this.options.scroll_class;
        this.scroll_id = this.options.scroll_id;
        return this;
    },

    show:function() {
        try{
            window.clearInterval(this.hInt);
        }   catch(e)    {

        }
        TweenLite.to(this.scrollBarHandle,.2, {css:{alpha:.8}, ease:Sine.easeOut});
        this.hInt = window.setTimeout(this.hide, 1500);
    },

    hide:function() {
        TweenLite.to(app.assessmentView.mainScroll.scrollBarHandle,.2, {css:{alpha:0}, ease:Sine.easeOut});
    },

    scrollTo:function(val)  {
        this.isScrollingWithMenu = true;
        $("#assessment_main").scrollTop(val);
        this.isScrollingWithMenu = false;
    },

    measure:function()  {
        if($(this.container).height() > 200)    {
            var scr = this;

            var element = jQuery(scr.container);
            if(!scr.initialized)    {
                this.$el = jQuery('<div/>', {
                    id:"scrollBarRail"
                }).appendTo($(scr.container));
                this.$el.attr({"id": scr.scroll_id, "class": scr.rail_class});
                this.$el.hover(
                    function () {
                        scr.show();
                    },
                    function () {
                        scr.hide();
                    }
                );
                $(scr.target).hover(
                    function () {
                        scr.show();
                    },
                    function () {
                        scr.hide();
                    }
                );
                if(scr.scrollBarHandle == null) {
                    scr.scrollBarHandle = jQuery('<div/>', {});
                    scr.scrollBarHandle.attr({"class": scr.scroll_class});
                    scr.scrollBarHandle.appendTo(scr.$el);
                    scr.n = parseInt(scr.scrollBarHandle.css("top").replace("px", ""));
                }
                // Disabling text selection in IE
                scr.scrollBarHandle.bind("selectstart", function () {
                    return false;
                });
            }
            scr.$el.css({"left":($(scr.container).width() - scr.scrollBarHandle.width() + 1) + "px", height:element.height()+"px"});

            // Getting some numbers
            if(scr.nativeScroll == null)    {
                 scr.nativeScroll = element.find(scr.target);
            }           
            scr.contentHeight = scr.nativeScroll.get(0).scrollHeight - element.height();
            scr.boxHeight = element.height() - scr.scrollBarHandle.height();
            if(scr.contentHeight > element.height())   {
                scr.scrollBarHandle.css({"visibility":"visible"});
            }   else    {
                scr.scrollBarHandle.css({"visibility":"hidden"});
            }
            if(scr.scrollBarHandlePosition == null)    {
                scr.scrollBarHandlePosition = 0;
            }

                        // Moving the scroll handle when scrolling with mouse, arrow keys,
                        // page up, page down, etc.


            if(scr.scrollEventHandler == null) {
                scr.scrollEventHandler = scr.nativeScroll.bind("scroll", function () {
                    scr.position = scr.nativeScroll.scrollTop() / scr.contentHeight;
                    scr.scrollPosition = (scr.position * scr.boxHeight) + scr.n;
                    scr.scrollBarHandle.css("top", scr.scrollPosition + "px");

                    // THIS COULD BE WHERE ANDROID IS FAILING
                    if (!scr.isScrollingWithMouse) {
                        scr.currentScrollPosition = scr.scrollPosition - scr.n;
                    }
                    if(!scr.isScrollingWithMenu)    {
                        app.assessmentView.assessmentAccordion.updateMenu(scr.nativeScroll.scrollTop());
                    }
                    scr.show();
                });
            }
                        // Scrolling the native scroll when moving the handle with the mouse


            if(scr.scrollPressHandler == null)  {
                scr.scrollPressHandler = scr.scrollBarHandle.bind("mousedown", function (e) {
                    scr.startY = e.clientY;
                    scr.isScrollingWithMouse = true;
                    $("#assessment_nav").find("#list").getNiceScroll().hide();

                    var mousemove = function (e) {
                        scr.scrollPosition = (e.clientY - scr.startY) + (scr.currentScrollPosition);
                        scr.contentPosition = scr.scrollPosition / scr.boxHeight;
                        scr.nativeScroll.scrollTop(scr.contentHeight * scr.contentPosition);
                    };

                    scr.win.bind("mousemove", mousemove);

                    scr.win.bind("mouseup", function () {
                        scr.currentScrollPosition = Math.ceil((scr.nativeScroll.scrollTop() / scr.contentHeight) * scr.boxHeight);
                        scr.win.unbind("mousemove", mousemove);
                        scr.isScrollingWithMouse = false;
                        if(!scr.isScrollingWithMenu)    {
                            app.assessmentView.assessmentAccordion.updateMenu(scr.nativeScroll.scrollTop());
                        }
                        wh = 0;
                        $(window).resize();
                        if(app.assessmentView.nav_expanded)    {
                            $("#assessment_nav").find("#list").getNiceScroll().show();
                        }
    
                    });

                    return false;
                });
            }
            
            if(scr.scrollStopHandler == null)   {
                scr.scrollStopHandler = scr.nativeScroll.bind('scrollstop', function(){
                    app.assessmentView.savedScroll = scr.nativeScroll.scrollTop();
                    //if(!scr.isScrollingWithMenu)    {
                        //app.assessmentView.assessmentAccordion.updateMenu(scr.nativeScroll.scrollTop());
                        //acc.updateInterviewee(app.assessmentList.currentQuestion);
                    //}
                });
            }
            
            scr.initialized = true;
            window.clearInterval(scr.sInt);
            scr.hide();
        }
    }

});