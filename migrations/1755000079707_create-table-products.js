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
  pgm.createTable("products", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    name: {
      type: "TEXT",
      notNull: true,
      unique: true,
    },
    description: {
      type: "TEXT",
      notNull: true,
    },
    price: {
      type: "INTEGER",
      notNull: true,
    },
    category_id: {
      type: "VARCHAR(50)",
      notNull: true,
    },
    stock: {
      type: "INTEGER",
      notNull: true,
      default: 1,
    },
    image_url: {
      type: "TEXT",
      notNull: false,
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

  pgm.addConstraint("products", "fk_category_id", {
    foreignKeys: {
      columns: "category_id",
      references: "categories(id)",
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
  pgm.dropTable("products");
};
