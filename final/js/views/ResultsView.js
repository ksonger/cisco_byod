window.ResultsView = Backbone.View.extend({

    openElement:null,
    activeScreen:null,
    sections:{},

    initialize:function () {
        this.template = _.template(tpl.get('results'));
    },

    onEnter:function()  {

    },

    onExit:function()   {
        this.sections[$(this.openElement).find("#section_id").val()].hideScreen();
    },

    render:function () {
        this.$el.html('');
        this.$el.html(this.template(this.model.attributes));
        this.$el.attr("id", "results");
        this.addEventHandlers();
        this.$el.find(".results_nav_item").last().attr('class', 'results_nav_item_last');
        this.createScreens();
        app.startInterval();
        return this;
    },

    createScreens:function()    {
        for(var i=0;i<this.model.attributes.sections.length;i++)    {
            var scr = new ResultsScreenView({model:this.model.attributes.sections[i]});
            if($(window).width() > app.desktopWidth)    {
                scr.size = "desktop";
            }
            if($(window).width() <= app.desktopWidth && $(window).width() > app.phoneWidth)    {
                scr.size = "tablet";
            }
            if($(window).width() <= app.phoneWidth)    {
                scr.size = "phone";
            }
            scr.render().$el.appendTo(this.$el.find("#results_main"));
            this.sections[this.model.attributes.sections[i].id] = scr;
            if(i == 0)   {
                scr.showScreen();
                this.activeScreen = scr;
            }   else    {
                scr.hideScreen();
            }
        }
    },

    addEventHandlers:function() {
        this.$el.find("#home_button_cell").click(function (e) {
            e.preventDefault();
            app.setState(app.sessionView);
            app.startInterval();
        });
        var res = this;

        this.$el.find('#results_nav_item_div').each(function (index) {
            if(index == 0)  {
                res.openElement = $(this);
                $(this).attr("class", "results_nav_item_active");
            }
            $(this).click(function () {
                var isSameElement = (res.openElement == this);
                if (res.openElement != null) {   
                    if (!isSameElement) {
                        $(res.openElement).attr("class", "results_nav_item_inactive");
                        res.sections[$(res.openElement).find("#section_id").val()].hideScreen();
                    }
                }
                res.openElement = this; 
                if(!isSameElement)  {
                    $(this).attr("class", "results_nav_item_active");
                    res.sections[$(this).find("#section_id").val()].showScreen();
                }
            });
            $(this).hover(
                function () {
                    if ($(this).attr("class") == "results_nav_item_inactive") {
                        $(this).attr("class", "results_nav_item_hover");
                    }
                },
                function () {
                    if ($(this).attr("class") == "results_nav_item_hover") {
                        $(this).attr("class", "results_nav_item_inactive");
                    }
                }
            );
        });
    }
});