//create a mockData of subscribers
const subscribers = [
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
const blogPosts = [
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
const nodemailer = require('nodemailer');

// Example transporter setup (use your real credentials in production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ayanferunsewe@gmail.com', // replace with your email
    pass: 'vkam wqet ibgh xukx' // replace with your password or app password
  }
});

//create a template for the email
const createEmailTemplate = (subscriber, blogPost) => {
  const formattedDate = new Date(blogPost.date).toLocaleDateString();
  const tagBadges = blogPost.tag.map(tag => `
    <span style="
      display: inline-block;
      background-color: #f8c6dc;
      color: #b0004b;
      font-size: 0.75em;
      font-weight: bold;
      padding: 5px 10px;
      border-radius: 20px;
      margin-right: 5px;
      margin-bottom: 5px;
    ">#${tag}</span>
  `).join('');

  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f8c6dc; border-radius: 10px; background-color: #fff0f5;">
      <div style="text-align: center; border-bottom: 2px solid #e91e63; padding-bottom: 10px;">
        <h2 style="color: #e91e63;">💌 Kaabo Newsletter</h2>
        <p style="font-size: 0.9em; color: #a44b68;">Fresh stories and updates for you</p>
      </div>

      <div style="padding: 20px 0;">
        <h3 style="color: #d81b60;">📰 ${blogPost.title}</h3>
        <p style="font-size: 0.95em; color: #a44b68;"><strong>Author:</strong> ${blogPost.author}</p>
        <p style="font-size: 0.9em; color: #a44b68;"><em>Published on: ${formattedDate}</em></p>
        
        <div style="margin: 15px 0;">
          ${tagBadges}
        </div>

        <hr style="border: none; border-top: 1px solid #f8c6dc; margin: 20px 0;">

        <p style="font-size: 1em; line-height: 1.6; color: #5e2b43;">
          Dear ${subscriber.name},<br><br>
          ${blogPost.content}
        </p>

        <p style="font-size: 0.95em; color: #5e2b43;">
          We hope this inspires you. Stay tuned for more updates from Kaabo!
        </p>

        <div style="margin-top: 30px; text-align: center;">
          <a href="https://kaabo.example.com" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #e91e63; color: white; text-decoration: none; border-radius: 5px;">Read More</a>
        </div>
      </div>

      <div style="border-top: 1px solid #f8c6dc; margin-top: 30px; padding-top: 10px; font-size: 0.8em; color: #a44b68; text-align: center;">
        <p>You are receiving this because you subscribed to Kaabo.</p>
        <p>If you'd prefer not to receive updates, <a href="#" style="color: #e91e63;">unsubscribe</a>.</p>
      </div>
    </div>
  `;
};


//define the users to receive the email
const usersToNotify = subscribers;

//create a function to send the email
const sendEmail = (to, subject, html) => {
  const mailOptions = {
    from: 'ayanferunsewe@gmail.com',
    to, 
    subject: subject,
    html 
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error while sending email:', error);
    }
    console.log('Email sent successfully:', info.response);
  });
};

// find the latest blog post
const latestBlogPost = blogPosts.reduce((latest, current) => {
  return new Date(current.date) > new Date(latest.date) ? current : latest;
});

// send the latest blog post to all subscribers who isSubscribed is true
subscribers
  .filter(subscriber => subscriber.isSubscribed)
  .forEach(subscriber => {
    const emailTemplate = createEmailTemplate(subscriber, latestBlogPost);
    sendEmail(subscriber.email, `Update from Kaabo: ${latestBlogPost.title}`, emailTemplate);
  });