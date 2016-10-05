/*
* When each Feed is saved, counts of likes, comments and trend will be calculated.
*/
Parse.Cloud.afterSave("Feed", function(request, response)
{
    var feed = request.object;
    var likes = feed.get("likes");
    var comment = feed.get("comments");
     
    feed.set("likeCount", likes.length);
    feed.set("commentCount", comment.length);
    feed.set("trendCount", likes.length + comment.length);
 
    feed.save();
});
 
 
// send email using mandrill
Parse.Cloud.define("sendMail", function(request, response) {
    var Mandrill = require('mandrill');
    Mandrill.initialize('85-09idZlAJbzVaZ_05v-g');
 
    Mandrill.sendEmail({
        message: {
            text: request.params.text,
            subject: request.params.subject,
            from_email: request.params.fromEmail,
            to: [
                {
                    email: request.params.toEmail,
                }
            ]
            },
        async: true
    },{
        success: function(httpResponse) {
        console.log(httpResponse);
        response.success("success");
    },
        error: function(httpResponse) {
        console.error(httpResponse);
        response.error("fail");
    }
    });
});
 
// Send email using MailGun
Parse.Cloud.define("mailSend", function(request, response){
    var Mailgun = require('mailgun');
    Mailgun.initialize('sandbox896a38cfd6e8464f891957dd52259be3.mailgun.org', 'key-b3a0451c01d6b81b9b8716a1ea52caa5');
    Mailgun.sendEmail({
        to: request.params.toEmail,
        from: request.params.fromEmail,
        subject: request.params.subject,
        text: request.params.text,
        html: '<html><body style="text-align:left;"><img border="0" src="' + request.params.imageUrlKey + '" width="400" height="300">' +'<br/>' +'<br/>'
            + request.params.text + '<br/>'
            + request.params.street + '<br/>'
            + request.params.country + '<br/>'
            + request.params.phoneNumber + '<br/>' + '<br/>'
            + request.params.price +'</body></html>'
    }, {
            success: function(httpResponse){
                console.log(httpResponse);
                response.success("Email sent successfully!");
            },
            error: function(httpResponse){
                console.log(httpResponse);
                response.error("Email failed");
            }
    });
});
 
Parse.Cloud.define("mailSendwithText", function(request, response){
    var Mailgun = require('mailgun');
    Mailgun.initialize('sandbox896a38cfd6e8464f891957dd52259be3.mailgun.org', 'key-b3a0451c01d6b81b9b8716a1ea52caa5');
    Mailgun.sendEmail({
        to: request.params.toEmail,
        from: request.params.fromEmail,
        subject: request.params.subject,
        text: request.params.text
    }, {
            success: function(httpResponse){
                console.log(httpResponse);
                response.success("Email sent successfully!");
            },
            error: function(httpResponse){
                console.log(httpResponse);
                response.error("Email failed");
            }
    });
});
 
// update other user's info
Parse.Cloud.define("editUser", function(request, response) {
    var userId = request.params.userId;
    var flagged = request.params.flagged;
    var banned = request.params.banned;
    var blocked = request.params.blocked;
 
    var User = Parse.Object.extend('_User'),
        user = new User({ objectId: userId });
 
    user.set('flagged', flagged);
    user.set('banned', banned);
    user.set('blocked', blocked);
 
    Parse.Cloud.useMasterKey();
    user.save().then(function(user) {
        response.success(user);
    }, function(error) {
        response.error(error)
    });
});
 
Parse.Cloud.define("sendEmailTemplate", function(request, response) { 
    console.log("to : " + request.params.toEmail);
    var Mandrill = require('cloud/mandrillTemplateSend.js'); 
 
    Mandrill.initialize('85-09idZlAJbzVaZ_05v-g'); 
 
    Mandrill.sendTemplate ({ 
        template_name: "SportWorldPassportTemplate01",//request.params.templateName, 
        template_content: [], 
        message: { 
            text: request.params.text, 
            subject: request.params.subject, 
            from_email: request.params.fromEmail, 
            to: request.params.toEmail, 
            merge : true, 
            merge_language : "mailchimp", 
            global_merge_vars : [{ 
                "name":"content", 
                "content" : request.params.text 
            }], 
            important: true
        }, 
        async: true
    }, { 
        success: function(httpResponse) { 
        console.log(httpResponse); 
        response.success("success"); 
    }, 
    error: function(httpResponse) { 
        console.error(httpResponse); 
        response.error("fail"); 
    } 
    });
});