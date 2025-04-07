# Generated by Django 5.1.6 on 2025-04-06 18:31

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
        ('rooms', '0002_rename_number_room_room_number_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='room',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='rooms.room'),
        ),
    ]
