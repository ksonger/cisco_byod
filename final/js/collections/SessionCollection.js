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
        //return session.get(this.comparatorKey).toLowerCase();
            if(this.sortOrder == "forward")    {
                return session.get(this.comparatorKey).toLowerCase();
            }   else if(this.sortOrder == "reverse")    {
                var str = session.get(this.comparatorKey).toLowerCase().split("");
                str = _.map(str, function(letter) {
                    return String.fromCharCode(-(letter.charCodeAt(0)));
                });
                return str;
            }
    },
    url:"../api/sessions"
});