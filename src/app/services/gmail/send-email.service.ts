import { Injectable } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SendEmailService {

  constructor(private auth: AuthService) { }

  public prepareEmail(sender: any, receiver: any, conCopia: any, subjec: any, content: any) {

    const to          = 'To: '   + receiver;
    const cc          = 'Cc: '   + conCopia;
    const from        = 'From: ' + sender;
    const subject     = 'Subject: ' + subjec;
    const contentType = 'Content-Type: text/html; charset=ISO-8859-1';
    const mime        = 'MIME-Version: 1.0';

    let message = '';
    message +=   to             + '\r\n';
    message +=   cc             + '\r\n';
    message +=   from           + '\r\n';
    message +=   subject        + '\r\n';
    message +=   contentType    + '\r\n';
    message +=   mime           + '\r\n';
    message +=    '\r\n'        + content;

    const base64EncodedEmail = btoa(message).replace(/\+/g, '-').replace(/\//g, '_');

    const request = this.auth.sendMessage(base64EncodedEmail);

    request.execute(function(err, res) {
      if (err.message) {
        return console.error('The API returned an error: ' + err.message);
      }
      console.log(res)
      return res;
    });
};
}
