BEGIN TRANSACTION;

-- ===================================
-- Tables for Authentication & Permissions
-- ===================================

CREATE TABLE "auth_group" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" VARCHAR(150) NOT NULL UNIQUE
);

CREATE TABLE "auth_group_permissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "group_id" INTEGER NOT NULL REFERENCES "auth_group" ("id") DEFERRABLE INITIALLY DEFERRED,
    "permission_id" INTEGER NOT NULL REFERENCES "auth_permission" ("id") DEFERRABLE INITIALLY DEFERRED
);

CREATE TABLE "auth_permission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content_type_id" INTEGER NOT NULL REFERENCES "django_content_type" ("id") DEFERRABLE INITIALLY DEFERRED,
    "codename" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255) NOT NULL
);

-- Inserting Permissions
INSERT INTO "auth_permission" VALUES (1,1,'add_logentry','Can add log entry');
INSERT INTO "auth_permission" VALUES (2,1,'change_logentry','Can change log entry');
INSERT INTO "auth_permission" VALUES (3,1,'delete_logentry','Can delete log entry');
INSERT INTO "auth_permission" VALUES (4,1,'view_logentry','Can view log entry');
INSERT INTO "auth_permission" VALUES (5,2,'add_permission','Can add permission');
INSERT INTO "auth_permission" VALUES (6,2,'change_permission','Can change permission');
INSERT INTO "auth_permission" VALUES (7,2,'delete_permission','Can delete permission');
INSERT INTO "auth_permission" VALUES (8,2,'view_permission','Can view permission');

-- ===================================
-- User Table
-- ===================================

CREATE TABLE "authentication_customuser" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "password" VARCHAR(128) NOT NULL,
    "last_login" DATETIME NULL,
    "is_superuser" BOOL NOT NULL,
    "username" VARCHAR(150) NOT NULL UNIQUE,
    "first_name" VARCHAR(150) NOT NULL,
    "last_name" VARCHAR(150) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "is_staff" BOOL NOT NULL,
    "is_active" BOOL NOT NULL,
    "date_joined" DATETIME NOT NULL,
    "role" VARCHAR(10) NOT NULL
);

-- Inserting Sample Users
INSERT INTO "authentication_customuser" VALUES (4, 'hashed_password_1', NULL, 0, 'admin1', '', '', 'admin@gmail.com', 0, 1, '2025-03-04 04:36:43', 'admin');
INSERT INTO "authentication_customuser" VALUES (5, 'hashed_password_2', NULL, 0, 'guest', '', '', 'guest@gmail.com', 0, 1, '2025-03-04 04:37:22', 'guest');
INSERT INTO "authentication_customuser" VALUES (6, 'hashed_password_3', NULL, 0, 'visitor', '', '', 'visitor@gmail.com', 0, 1, '2025-03-04 04:37:50', 'visitor');
INSERT INTO "authentication_customuser" VALUES (7, 'hashed_password_4', NULL, 0, 'test', '', '', 'test@gmail.com', 0, 1, '2025-03-04 22:52:33', 'student');
INSERT INTO "authentication_customuser" VALUES (8, 'hashed_password_5', NULL, 0, 's1', '', '', 's1@gmail.com', 0, 1, '2025-03-05 00:10:36', 'student');

-- ===================================
-- Rooms Table
-- ===================================

CREATE TABLE "rooms_room" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "room_number" VARCHAR(10) NOT NULL UNIQUE,
    "status" VARCHAR(15) NOT NULL,
    "type" VARCHAR(10) NOT NULL
);

-- Inserting Sample Rooms
INSERT INTO "rooms_room" VALUES (1, '101', 'available', 'single');
INSERT INTO "rooms_room" VALUES (2, '102', 'available', 'double');
INSERT INTO "rooms_room" VALUES (3, '121', 'occupied', 'suite');

-- ===================================
-- Billing Invoices Table
-- ===================================

CREATE TABLE "billing_invoice" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" DECIMAL NOT NULL,
    "created_on" DATE NOT NULL,
    "student_id" BIGINT NOT NULL REFERENCES "authentication_customuser" ("id") DEFERRABLE INITIALLY DEFERRED
);

-- ===================================
-- Visitor Logs Table
-- ===================================

CREATE TABLE "visitors_visitorlog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" VARCHAR(255) NOT NULL,
    "purpose" TEXT NOT NULL,
    "logged_on" DATETIME NOT NULL
);

-- Inserting Sample Visitor Logs
INSERT INTO "visitors_visitorlog" VALUES (1, 'Test Visitor', 'Check-in', '2025-03-04 23:56:49');

-- ===================================
-- Django Sessions Table
-- ===================================

CREATE TABLE "django_session" (
    "session_key" VARCHAR(40) NOT NULL PRIMARY KEY,
    "session_data" TEXT NOT NULL,
    "expire_date" DATETIME NOT NULL
);

-- ===================================
-- Indexes & Constraints
-- ===================================

CREATE UNIQUE INDEX "auth_permission_codename" ON "auth_permission" ("content_type_id", "codename");
CREATE UNIQUE INDEX "authentication_customuser_username" ON "authentication_customuser" ("username");
CREATE UNIQUE INDEX "rooms_room_number" ON "rooms_room" ("room_number");

-- ===================================
-- Django Migrations Data
-- ===================================

CREATE TABLE "django_migrations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "app" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "applied" DATETIME NOT NULL
);

-- Inserting Migration History
INSERT INTO "django_migrations" VALUES (1,'contenttypes','0001_initial','2025-03-04 03:23:12');
INSERT INTO "django_migrations" VALUES (2,'contenttypes','0002_remove_content_type_name','2025-03-04 03:23:12');
INSERT INTO "django_migrations" VALUES (3,'auth','0001_initial','2025-03-04 03:23:12');
INSERT INTO "django_migrations" VALUES (4,'auth','0002_alter_permission_name_max_length','2025-03-04 03:23:12');
INSERT INTO "django_migrations" VALUES (5,'auth','0003_alter_user_email_max_length','2025-03-04 03:23:12');
INSERT INTO "django_migrations" VALUES (6,'authentication','0001_initial','2025-03-04 03:23:12');
INSERT INTO "django_migrations" VALUES (7,'admin','0001_initial','2025-03-04 03:23:12');
INSERT INTO "django_migrations" VALUES (8,'sessions','0001_initial','2025-03-04 03:23:12');
INSERT INTO "django_migrations" VALUES (9,'billing','0001_initial','2025-03-04 16:43:27');
INSERT INTO "django_migrations" VALUES (10,'rooms','0001_initial','2025-03-04 16:43:27');
INSERT INTO "django_migrations" VALUES (11,'visitors','0001_initial','2025-03-04 16:43:27');

-- Resetting SQLite Sequences
DELETE FROM "sqlite_sequence";
INSERT INTO "sqlite_sequence" VALUES ('django_migrations', 24);
INSERT INTO "sqlite_sequence" VALUES ('authentication_customuser', 8);
INSERT INTO "sqlite_sequence" VALUES ('rooms_room', 4);
INSERT INTO "sqlite_sequence" VALUES ('visitors_visitorlog', 1);

COMMIT;
