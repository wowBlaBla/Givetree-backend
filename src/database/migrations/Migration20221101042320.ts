import { Migration } from "@mikro-orm/migrations";

export class Migration20221101042320 extends Migration {
  async up(): Promise<void> {
    this.addSql("alter table `users` modify `tax` tinyint(1) default true;");

    this.addSql("alter table `refresh_tokens` modify `is_revoked` json;");

    this.addSql(
      "alter table `collections` modify `network` enum('ethereum', 'polygon', 'celo', 'arbitrum', 'optimism') not null;",
    );

    this.addSql(
      "alter table `charity_property` change `phone` `business_number` varchar(255) null;",
    );

    this.addSql(
      "alter table `charity_property` modify `employee` int(11) not null;",
    );
  }
}
