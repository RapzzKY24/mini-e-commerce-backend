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
  pgm.createTable("cart_items", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    product_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    cart_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    quantity: {
      type: "INTEGER",
      notNull: true,
      default: 1,
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

  pgm.addConstraint("cart_items", "fk_cart_items_product_id", {
    foreignKeys: {
      columns: "product_id",
      references: "products(id)",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  });

  pgm.addConstraint("cart_items", "fk_cart_items_cart_id", {
    foreignKeys: {
      columns: "cart_id",
      references: "carts(id)",
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
  pgm.dropTable("cart_items");
};
