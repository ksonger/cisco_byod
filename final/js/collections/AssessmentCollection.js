/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 7/17/12
 * Time: 1:55 PM
 * To change this template use File | Settings | File Templates.
 */
window.AssessmentCollection = Backbone.Collection.extend({
    model: Assessment,
    url:"../api/assessments"
});