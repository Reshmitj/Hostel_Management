# Generated by Django 5.1.6 on 2025-04-06 20:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('guest_booking', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='guestbooking',
            name='guest_name',
            field=models.CharField(default='Guest', max_length=100),
            preserve_default=False,
        ),
    ]
