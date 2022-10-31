import { Migration } from "@mikro-orm/migrations";

export class Migration20221031174507 extends Migration {
  async up(): Promise<void> {
    this.addSql("alter table `users` modify `tax` tinyint(1) not null;");

    this.addSql(
      "create table `sales` (`id` int unsigned not null auto_increment primary key, `created_at` datetime not null, `updated_at` datetime not null, `collection` varchar(255) not null, `token_id` varchar(255) not null, `seller` varchar(255) not null, `network` enum('Ethereum', 'Polygon', 'Celo', 'Arbitrum', 'Optimism') not null) default character set utf8mb4 engine = InnoDB;",
    );

    this.addSql(
      "alter table `refresh_tokens` modify `is_revoked` json not null;",
    );

    this.addSql(
      "alter table `collections` modify `network` enum('ethereum', 'polygon', 'celo', 'arbitrum', 'optimism');",
    );

    this.addSql(
      "alter table `charity_property` modify `employee` int(11) default 0;",
    );
  }
}
