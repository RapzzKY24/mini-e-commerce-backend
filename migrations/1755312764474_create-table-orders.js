/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createTable("orders", {
    id: {
      primaryKey: true,
      type: "VARCHAR(50)",
    },
    user_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    total_amount: {
      type: "DECIMAL(10,2)",
      notNull: true,
    },
    status: {
      type: "TEXT",
      notNull: true,
      default: "PENDING",
    },
    shipping_address: {
      type: "TEXT",
      notNull: true,
    },
    created_at: {
      type: "TEXT",
      notNull: true,
    },
    updated_at: {
      type: "TEXT",
      notNull: true,
    },
  });

  pgm.addConstraint("orders", "fk_orders_user_id", {
    foreignKeys: {
      columns: "user_id",
      references: "users(id)",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("orders");
};
