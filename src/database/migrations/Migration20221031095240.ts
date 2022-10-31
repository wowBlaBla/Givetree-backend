import { Migration } from "@mikro-orm/migrations";

export class Migration20221031095240 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      "alter table `refresh_tokens` modify `is_revoked` json not null;",
    );

    this.addSql(
      "alter table `charity_property` modify `employee` int(11) default 0;",
    );
  }
}
