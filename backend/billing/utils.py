from django.core.mail import send_mail

def send_invoice_email(user, amount):
    subject = "Hostel Payment Confirmation"
    message = f"Dear {user.username},\n\nYour invoice of ${amount} has been generated successfully. Thank you for using our hostel services.\n\nRegards,\nHostel Management"
    from_email = "noreply@hostelapp.com"
    recipient_list = [user.email]

    send_mail(subject, message, from_email, recipient_list)
