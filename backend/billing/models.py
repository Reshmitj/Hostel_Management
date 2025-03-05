from django.db import models
from authentication.models import CustomUser

class Invoice(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_on = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Invoice for {self.student.username} - ${self.amount}"
