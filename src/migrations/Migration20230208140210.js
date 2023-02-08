'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20230208140210 extends Migration {

  async up() {
    this.addSql('create table "gateway" ("id" bigserial primary key, "name" varchar(255) not null);');

    this.addSql('create table "site" ("id" uuid not null, "name" varchar(255) not null, "country" varchar(255) not null, "city" varchar(255) not null, "latitude" float not null, "longitude" float not null, constraint "site_pkey" primary key ("id"));');

    this.addSql('create table "user" ("id" uuid not null, "name" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "batch" ("id" uuid not null, "name" varchar(255) not null, "user_id" uuid not null, constraint "batch_pkey" primary key ("id"));');

    this.addSql('create table "airspace" ("id" uuid not null, "name" varchar(255) not null, "site_id" uuid not null, "batch_id" uuid null, constraint "airspace_pkey" primary key ("id"));');

    this.addSql('create table "monitor" ("id" bigserial primary key, "gateway_id" bigint null, "airspace_id" uuid null, "name" varchar(255) null);');

    this.addSql('create table "monitor_data" ("monitor_id" bigint not null, "date" timestamp not null, "temperature" float not null, "humidity" float not null, constraint "monitor_data_pkey" primary key ("monitor_id", "date"));');

    this.addSql('create table "user_site" ("user_id" uuid not null, "site_id" uuid not null, "role" varchar(255) not null default \'USER\', constraint "user_site_pkey" primary key ("user_id", "site_id"));');

    this.addSql('alter table "batch" add constraint "batch_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "airspace" add constraint "airspace_site_id_foreign" foreign key ("site_id") references "site" ("id") on update cascade;');
    this.addSql('alter table "airspace" add constraint "airspace_batch_id_foreign" foreign key ("batch_id") references "batch" ("id") on update cascade on delete set null;');

    this.addSql('alter table "monitor" add constraint "monitor_gateway_id_foreign" foreign key ("gateway_id") references "gateway" ("id") on update cascade on delete set null;');
    this.addSql('alter table "monitor" add constraint "monitor_airspace_id_foreign" foreign key ("airspace_id") references "airspace" ("id") on update cascade on delete set null;');

    this.addSql('alter table "monitor_data" add constraint "monitor_data_monitor_id_foreign" foreign key ("monitor_id") references "monitor" ("id") on update cascade;');

    this.addSql('alter table "user_site" add constraint "user_site_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "user_site" add constraint "user_site_site_id_foreign" foreign key ("site_id") references "site" ("id") on update cascade;');
  }

  async down() {
    this.addSql('alter table "monitor" drop constraint "monitor_gateway_id_foreign";');

    this.addSql('alter table "airspace" drop constraint "airspace_site_id_foreign";');

    this.addSql('alter table "user_site" drop constraint "user_site_site_id_foreign";');

    this.addSql('alter table "batch" drop constraint "batch_user_id_foreign";');

    this.addSql('alter table "user_site" drop constraint "user_site_user_id_foreign";');

    this.addSql('alter table "airspace" drop constraint "airspace_batch_id_foreign";');

    this.addSql('alter table "monitor" drop constraint "monitor_airspace_id_foreign";');

    this.addSql('alter table "monitor_data" drop constraint "monitor_data_monitor_id_foreign";');

    this.addSql('drop table if exists "gateway" cascade;');

    this.addSql('drop table if exists "site" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "batch" cascade;');

    this.addSql('drop table if exists "airspace" cascade;');

    this.addSql('drop table if exists "monitor" cascade;');

    this.addSql('drop table if exists "monitor_data" cascade;');

    this.addSql('drop table if exists "user_site" cascade;');
  }

}
exports.Migration20230208140210 = Migration20230208140210;
