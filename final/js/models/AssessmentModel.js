/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 7/17/12
 * Time: 1:58 PM
 * To change this template use File | Settings | File Templates.
 */
window.Assessment = Backbone.Model.extend({
    urlRoot:"../api/assessments",
    defaults:{
        "categories":[],
        "id":1,
        "name":null,
        "total_answered":0,
        "total_questions":0
    },
    currentQuestion:0,
    currentCategory:0,
    setCurrentQuestion:function(num)    {
         this.currentQuestion = num;
        app.assessmentView.updateView();
    },
    getCurrentQuestion:function(num)    {
         return this.currentQuestion;
    },
    setCurrentCategory:function(num)    {
        this.currentCategory = num;
        app.assessmentView.updateView();
    },
    getCurrentCategory:function(num)    {
        return this.currentCategory;
    }
});