


export const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err);

  // Error de JSON mal formado
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "JSON inválido",
    });
  }

  // Error de MongoDB (duplicado - email ya registrado)
  if (err.code === 11000) {
    return res.status(400).json({
      message: "Dato duplicado (ej: email ya registrado)",
    });
  }

  // Error de validación (ej: Mongoose)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      message: messages.join(", "),
    });
  }

  // Error de JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Token inválido",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token expirado",
    });
  }
if (err.errors) {
  return res.status(400).json({
    message: "Errores de validación",
    errors: err.errors.map(e => e.msg),
  });
}
  // Si el error ya tiene status (custom)
  const statusCode = err.status || 500;

  return res.status(statusCode).json({
    message: err.message || "Error interno del servidor",
  });
};