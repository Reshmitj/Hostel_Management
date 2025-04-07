# Generated by Django 5.1.6 on 2025-04-06 20:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('rooms', '0002_rename_number_room_room_number_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='GuestBooking',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('guest_email', models.EmailField(max_length=254)),
                ('purpose', models.CharField(max_length=255)),
                ('booked_on', models.DateTimeField(auto_now_add=True)),
                ('room', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='rooms.room')),
            ],
        ),
    ]
