/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 7/17/12
 * Time: 1:58 PM
 * To change this template use File | Settings | File Templates.
 */
window.Results = Backbone.Model.extend({
    urlRoot:"../api/results",
    defaults:{
        "id":1
    },
});