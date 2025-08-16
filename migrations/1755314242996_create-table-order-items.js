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
  pgm.createTable("order_items", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    product_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    order_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    product_name: {
      type: "TEXT",
      notNull: true,
    },
    quantity: {
      type: "INTEGER",
      notNull: true,
    },
    price: {
      type: "DECIMAL(10,2)",
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

  pgm.addConstraint("order_items", "fk_order_items_product_id", {
    foreignKeys: {
      columns: "product_id",
      references: "products(id)",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });

  pgm.addConstraint("order_items", "fk_order_items_order_id", {
    foreignKeys: {
      columns: "order_id",
      references: "orders(id)",
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
  pgm.dropTable("order_items");
};
