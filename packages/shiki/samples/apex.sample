public class EmailManager {

    public static void sendMail(String address, String subject, String body) {
        Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        String[] toAddresses = new String[] {address};
        mail.setToAddresses(toAddresses);
        mail.setSubject(subject);
        mail.setPlainTextBody(body);
        Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });
    }

}

String address = 'YOUR_EMAIL_ADDRESS';
String subject = 'Speaker Confirmation';
String body = 'Thank you for speaking at the conference.';
EmailManager.sendMail(address, subject, body);

// From http://ccoenraets.github.io/salesforce-developer-workshop/Creating-an-Apex-Class.html
