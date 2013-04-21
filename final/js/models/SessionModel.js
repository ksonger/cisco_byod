window.Session = Backbone.Model.extend({
    urlRoot:"../api/sessions",
    defaults:{
        "id":null,
        "status":"open",
        "company":"",
        "modified":[],
        "main_contact":"",
        "main_contact_fname":"",
        "main_contact_lname":"",
        "main_contact_role":"",
        "interviewees":"",
        "assessment_id":"",
        "notes":"",
        responses:""
    }
});

