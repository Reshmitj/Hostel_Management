# Generated by Django 5.1.6 on 2025-03-04 23:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rooms', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='room',
            old_name='number',
            new_name='room_number',
        ),
        migrations.RemoveField(
            model_name='room',
            name='is_available',
        ),
        migrations.AddField(
            model_name='room',
            name='status',
            field=models.CharField(choices=[('available', 'Available'), ('occupied', 'Occupied'), ('maintenance', 'Under Maintenance')], default='available', max_length=15),
        ),
        migrations.AddField(
            model_name='room',
            name='type',
            field=models.CharField(choices=[('single', 'Single'), ('double', 'Double'), ('suite', 'Suite')], default='single', max_length=10),
        ),
        migrations.DeleteModel(
            name='Booking',
        ),
    ]
