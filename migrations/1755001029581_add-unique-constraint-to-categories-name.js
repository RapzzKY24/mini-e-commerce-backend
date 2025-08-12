exports.up = (pgm) => {
  pgm.addConstraint("categories", "unique_category_name", {
    unique: ["name"],
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint("categories", "unique_category_name");
};
