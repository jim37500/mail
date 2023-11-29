# mail
## Demo
[![Demo](https://github.com/jim37500/mail/blob/main/mail%20demo.png)](https://www.youtube.com/watch?v=1-SeFGoOd8c&t=1s)

## Getting Started
- In your terminal, cd into the mail directory.
- Run python manage.py makemigrations mail to make migrations for the mail app.
- Run python manage.py migrate to apply migrations to your database.

## Specification
### Send Mail 
- Once the email has been sent, load the user’s sent mailbox.

### Mailbox
- When a user visits their Inbox, Sent mailbox, or Archive, load the appropriate mailbox.

### View Email
- When a user clicks on an email, the user should be taken to a view where they see the content of that email.

### Archive and Unarchive
Allow users to archive and unarchive emails that they have received.
- When viewing an Inbox email, the user will be presented with a button that lets them archive the email. When viewing an Archive email, the user will be presented with a button that lets them unarchive the email. This requirement does not apply to emails in the Sent mailbox.

### Reply 
Allow users to reply to an email.
- When viewing an email, the user will be presented with a “Reply” button that lets them reply to the email.
- When the user clicks the “Reply” button, they will be taken to the email composition form.
- 




