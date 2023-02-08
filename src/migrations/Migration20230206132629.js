'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const { Migration } = require('@mikro-orm/migrations');

class Migration20230206132629 extends Migration {

  async up() {
    this.addSql('alter table "monitor" drop constraint "monitor_airspace_id_foreign";');

    this.addSql('alter table "monitor" alter column "airspace_id" drop default;');
    this.addSql('alter table "monitor" alter column "airspace_id" type uuid using ("airspace_id"::text::uuid);');
    this.addSql('alter table "monitor" alter column "airspace_id" drop not null;');
    this.addSql('alter table "monitor" alter column "name" type varchar(255) using ("name"::varchar(255));');
    this.addSql('alter table "monitor" alter column "name" drop not null;');
    this.addSql('alter table "monitor" add constraint "monitor_airspace_id_foreign" foreign key ("airspace_id") references "airspace" ("id") on update cascade on delete set null;');
  }

  async down() {
    this.addSql('alter table "monitor" drop constraint "monitor_airspace_id_foreign";');

    this.addSql('alter table "monitor" alter column "airspace_id" drop default;');
    this.addSql('alter table "monitor" alter column "airspace_id" type uuid using ("airspace_id"::text::uuid);');
    this.addSql('alter table "monitor" alter column "airspace_id" set not null;');
    this.addSql('alter table "monitor" alter column "name" type varchar(255) using ("name"::varchar(255));');
    this.addSql('alter table "monitor" alter column "name" set not null;');
    this.addSql('alter table "monitor" add constraint "monitor_airspace_id_foreign" foreign key ("airspace_id") references "airspace" ("id") on update cascade;');
  }

}
exports.Migration20230206132629 = Migration20230206132629;
