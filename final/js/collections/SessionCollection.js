/**
 * Created with JetBrains WebStorm.
 * User: KSonger
 * Date: 7/5/12
 * Time: 11:34 AM
 * To change this template use File | Settings | File Templates.
 */
window.SessionCollection = Backbone.Collection.extend({
    model:Session,
    comparatorKey:"company",
    sortOrder:"forward",
    comparator:function(session) {
        var result;
            if(this.sortOrder == "forward")    {
                result =  session.get(this.comparatorKey).toLowerCase();
            }   else if(this.sortOrder == "reverse")    {
                var str = session.get(this.comparatorKey).toLowerCase().split("");
                str = _.map(str, function(letter) {
                    result =  String.fromCharCode(-(letter.charCodeAt(0)));
                });
                result =  str;
            }
        return result;
    },
    url:"../api/sessions"
});