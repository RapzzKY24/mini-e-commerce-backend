const AuthorizationError = require("../../execptions/AuthorizationError");

const checkAdminRole = (req, h) => {
  const { role } = req.auth.credentials;

  if (role !== "admin") {
    throw new AuthorizationError(
      "Oops! Sepertinya Anda tidak memiliki izin untuk mengakses halaman ini."
    );
  }
  return h.continue;
};

module.exports = checkAdminRole;
