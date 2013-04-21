/**
 * Created with JetBrains PhpStorm.
 * User: KSonger
 * Date: 8/21/12
 * Time: 2:59 PM
 * To change this template use File | Settings | File Templates.
 */
window.AnswerView = Backbone.View.extend({

    initialize:function () {

    },
    events:{
        "change input":"change",
        "keyup textarea":"change"
    },

    change:function (event) {
        event.preventDefault();
        event.stopPropagation();
        
        var target = event.target;
        var deselect = false;
        for(var i=0;i<this.options.question.selectedAnswers.length;i++)    {
            // check for deselection
            if(this.options.question.selectedAnswers[i].id == target.id && target.type == 'checkbox')   {
                // deselect
                deselect = true;
                this.options.question.selectedAnswers.splice(i, 1);
                break;
            }
        }

        if(!deselect)   {
            var replace = false;
            var aObj = {id:target.id, type:target.type, group:this.model.group, question_id:this.options.question.model.id, value:target.value, score:$(target).attr("score"), answered_by:this.options.question.selectedInterviewee};
            // what type of answer is this?
            if(target.type == 'radio' || target.type == 'textarea')  {
                // single select, let's make sure we replace any existing ss answer for this question with the new selection
                if(this.options.question.selectedAnswers.length > 0)    {
                    for(var j=0;j<this.options.question.selectedAnswers.length;j++)    {
                        if(this.options.question.selectedAnswers[j].type == 'radio' && target.type == 'radio')    {
                            // this is the target
                            replace = true;
                            this.options.question.selectedAnswers[j] = aObj;
                            break;
                        }
                        if(this.options.question.selectedAnswers[j].type == 'textarea' && target.type == 'textarea')   {
                            replace = true;
                            this.options.question.selectedAnswers[j] = aObj;
                            break;
                        }
                    }
                }
            }
            if(!replace)    {
                this.options.question.selectedAnswers.push(aObj);
            }
        }

        this.options.question.change();
        $("#assessment_main").scrollTop(app.assessmentView.savedScroll);
        return false;
    },
    setValue:function(obj)  {
        if(obj.type == 'radio' || obj.type == 'checkbox')    {
            $(this.el).find("#"+obj.id).attr('checked', true);
        }   else if(obj.type == 'textarea') {
            $(this.el).find("#"+obj.id).val(obj.value);
        }
    },
    render:function (eventName) {
        this.template = _.template(tpl.get("answer_"+this.model.type.toLowerCase()));
        $(this.el).html(this.template(this.model));
        $(this.el).css({"align":"center", "text-align":"center", "display":"inline-block", "width":"100%", "height":"100%"});
        return this;
    }
});