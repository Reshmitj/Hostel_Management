from django.db import models

class VisitorLog(models.Model):
    name = models.CharField(max_length=255)
    purpose = models.TextField()
    logged_on = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.purpose}"
