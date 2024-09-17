export interface MailSenderBody {
  receiver_email: string;
  reciever_fullname: string;
  subject: string;
  text?: any;
}

export interface MailSenderAdminBody {
  receiver_email: string;
  subject: string;
  text?: any;
}
