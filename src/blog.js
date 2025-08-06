//create a mockData of subscribers
var subscribers = [
    {
        id: 'SUB001',
        name: 'Khalifa Abdul',
        email: 'khalifabdul016@gmail.com',
        isSubscribed: false,
        subscriptionDate: '2025-07-15',
        subscriptionPreferences: ['technology']
    },
    {
        id: 'SUB002',
        name: 'Ayanfe Runsewe',
        email: 'runshgirl@gmail.com',
        isSubscribed: true,
        subscriptionDate: '2025-07-16',
        subscriptionPreferences: ['all']
    },
    {
        id: 'SUB003',
        name: 'Chinwe Nwankwo',
        email: 'chinwe.nwankwo@example.com',
        isSubscribed: false,
        subscriptionDate: '2025-07-17',
        subscriptionPreferences: null
    }
];
//create a mockData of blog posts
var blogPosts = [
    {
        id: 'POST001',
        title: 'Welcome to Kaabo!',
        author: 'Grace Olamide',
        date: '2025-07-20',
        content: 'We are excited to launch our new blog. Stay tuned for updates and stories from our community.',
        tag: ['announcement', 'community']
    },
    {
        id: 'POST002',
        title: 'How to Subscribe',
        author: 'Emmanuel Okon',
        date: '2025-07-22',
        content: 'Learn how to subscribe to our newsletter and never miss an update from Kaabo.',
        tag: ['how-to', 'subscription']
    },
    {
        id: 'POST003',
        title: 'Meet the Team',
        author: 'Chinwe Nwankwo',
        date: '2025-07-24',
        content: 'Get to know the passionate people behind Kaabo and our mission to connect communities.',
        tag: ['team', 'community']
    },
    {
        id: 'POST004',
        title: 'Typescript and Node.js',
        author: 'Ayanfeoluwa Runsewe',
        date: '2025-07-25',
        content: 'Discover how we use TypeScript and Node.js to build scalable applications at Kaabo. Learn how we use TypeScript and Node.js to build scalable applications at Kaabo.',
        tag: ['technology', 'typescript', 'nodejs']
    }
];
//create an email service to send emails (using nodemailer)
var nodemailer = require('nodemailer');
// Example transporter setup (use your real credentials in production)
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // replace with your email
        pass: process.env.EMAIL_PASSWORD // replace with your email password or use environment variable
    }
});
//create a template for the email
var createEmailTemplate = function (subscriber, blogPost) {
    var formattedDate = new Date(blogPost.date).toLocaleDateString();
    var tagBadges = blogPost.tag.map(function (tag) { return "\n    <span style=\"\n      display: inline-block;\n      background-color: #f8c6dc;\n      color: #b0004b;\n      font-size: 0.75em;\n      font-weight: bold;\n      padding: 5px 10px;\n      border-radius: 20px;\n      margin-right: 5px;\n      margin-bottom: 5px;\n    \">#".concat(tag, "</span>\n  "); }).join('');
    return "\n    <div style=\"font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f8c6dc; border-radius: 10px; background-color: #fff0f5;\">\n      <div style=\"text-align: center; border-bottom: 2px solid #e91e63; padding-bottom: 10px;\">\n        <h2 style=\"color: #e91e63;\">\uD83D\uDC8C Kaabo Newsletter</h2>\n        <p style=\"font-size: 0.9em; color: #a44b68;\">Fresh stories and updates for you</p>\n      </div>\n\n      <div style=\"padding: 20px 0;\">\n        <h3 style=\"color: #d81b60;\">\uD83D\uDCF0 ".concat(blogPost.title, "</h3>\n        <p style=\"font-size: 0.95em; color: #a44b68;\"><strong>Author:</strong> ").concat(blogPost.author, "</p>\n        <p style=\"font-size: 0.9em; color: #a44b68;\"><em>Published on: ").concat(formattedDate, "</em></p>\n        \n        <div style=\"margin: 15px 0;\">\n          ").concat(tagBadges, "\n        </div>\n\n        <hr style=\"border: none; border-top: 1px solid #f8c6dc; margin: 20px 0;\">\n\n        <p style=\"font-size: 1em; line-height: 1.6; color: #5e2b43;\">\n          Dear ").concat(subscriber.name, ",<br><br>\n          ").concat(blogPost.content, "\n        </p>\n\n        <p style=\"font-size: 0.95em; color: #5e2b43;\">\n          We hope this inspires you. Stay tuned for more updates from Kaabo!\n        </p>\n\n        <div style=\"margin-top: 30px; text-align: center;\">\n          <a href=\"https://kaabo.example.com\" target=\"_blank\" style=\"display: inline-block; padding: 10px 20px; background-color: #e91e63; color: white; text-decoration: none; border-radius: 5px;\">Read More</a>\n        </div>\n      </div>\n\n      <div style=\"border-top: 1px solid #f8c6dc; margin-top: 30px; padding-top: 10px; font-size: 0.8em; color: #a44b68; text-align: center;\">\n        <p>You are receiving this because you subscribed to Kaabo.</p>\n        <p>If you'd prefer not to receive updates, <a href=\"#\" style=\"color: #e91e63;\">unsubscribe</a>.</p>\n      </div>\n    </div>\n  ");
};
//define the users to receive the email
var usersToNotify = subscribers;
//create a function to send the email
var sendEmail = function (to, subject, html, fromTitle) {
    if (fromTitle === void 0) { fromTitle = 'Kaabo Newsletter'; }
    var mailOptions = {
        from: "".concat(fromTitle, " <ayanferunsewe@gmail.com>"),
        to: to,
        subject: subject,
        html: html
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log('Error while sending email:', error);
        }
        console.log('Email sent successfully:', info.response);
    });
};
// find the latest blog post
var latestBlogPost = blogPosts.reduce(function (latest, current) {
    return new Date(current.date) > new Date(latest.date) ? current : latest;
});
// send the latest blog post to all subscribers who isSubscribed is true
usersToNotify
    .filter(function (subscriber) { return subscriber.isSubscribed; })
    .forEach(function (subscriber) {
    var emailTemplate = createEmailTemplate(subscriber, latestBlogPost);
    sendEmail(subscriber.email, "Update from Kaabo: ".concat(latestBlogPost.title), emailTemplate, latestBlogPost.title // pass the blog post title as the "from" name
    );
});
