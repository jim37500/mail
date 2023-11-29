document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  document.querySelector('#compose-form').addEventListener('submit', (event) => {
    event.preventDefault();
    send_email();
  })


  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    console.log(emails);
    const emailsDiv = document.querySelector('#emails-view');
    emails.forEach(email => {
      bg = email.read ? 'bg-light' : 'bg-white';
      div = document.createElement('div');
      div.classList.add('border', 'p-2', 'd-flex', 'email-div', bg);
      div.innerHTML = `<strong class="pr-3">${email.sender}</strong>${email.subject}<span class="ml-auto">${email.timestamp}</span>`
      emailsDiv.append(div);
      div.addEventListener('click', () => {
        load_email(email, mailbox);
      })
    })
  })
  .catch(error => {
    console.log('Error:', error);
  })
}

function send_email() {
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result);
    load_mailbox('sent');
  })
  .catch(error => {
    console.log('Error:', error);
  })
}

function load_email(email, mailbox) {
  document.querySelector('#email-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  fetch(`/emails/${email.id}`) 
  .then(response => response.json())
  .then(mail => {
    const archived = mail.archived ? 'Unarchived': 'Archived';
    document.querySelector('#email-view').innerHTML=`
      <p><strong>From: </strong>${mail.sender}</p>
      <p><strong>To: </strong>${mail.recipients}</p>
      <p><strong>Subject: </strong>${mail.subject}</p>
      <p><strong>Timestamp: </strong>${mail.timestamp}</p>
      <button class="btn btn-sm btn-outline-primary" id="reply">Reply</button>
      <button class="btn btn-sm btn-outline-primary" id="archive">${archived}</button>
      <hr>
      <p>${mail.body}</p>
    `

    document.querySelector('#archive').addEventListener('click', () => {
      archived_email(mail);
    })
    document.querySelector('#reply').addEventListener('click', () => {
      reply_email(mail);
    })
    if (mailbox === 'inbox') {
      fetch(`emails/${mail.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          read: true
        })
      })
    }
  })
  .catch(error => {
    console.log('Error:', error);
  })
}

function archived_email(email) {
  let is_archived = email.archived ? false : true
  fetch(`/emails/${email.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: is_archived
    })
  })
  .then(() => {
    load_mailbox('inbox');
  })
  .catch(error => {
    console.log('Error:', error);
  })
}


function reply_email(email) {
  compose_email()
  const re = email.subject.slice(0, 2) === 'Re' ? '' : 'Re: ';
  document.querySelector('#compose-recipients').value = `${email.sender}`;
  document.querySelector('#compose-subject').value = re + email.subject;
  document.querySelector('#compose-body').value = `On ${email.timestamp} ${email.sender} wrote: ${email.body}`;
}