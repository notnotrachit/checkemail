const { google } = require("googleapis");
import { removeAccountFromEmail } from "./mongo";

const oauth2Client = new google.auth.OAuth2(
  process.env.AUTH_GOOGLE_ID,
  process.env.AUTH_GOOGLE_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);


async function getEmails(email, access_token, email_count) {
    if(email_count == null){
        email_count = 10;
    }
    const uri =
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults="+email_count;
    let num_of_emails = parseInt(email_count);
    let emails = [];

    let response = await fetch(uri, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    response = await response.json();

    if (response.error && response.error.code === 401) {
      removeAccountFromEmail(email);
      return "Invalid token";
    }

    for (let i = 0; i < num_of_emails; i++) {
        let email_response = await fetch(
          "https://gmail.googleapis.com/gmail/v1/users/me/messages/" +
            response.messages[i].id,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        email_response = await email_response.json();
        emails.push(email_response);
    }
    return emails;

}


export { getEmails };