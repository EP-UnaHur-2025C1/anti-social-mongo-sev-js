const { Types } = require('mongoose');

const validarObjectId = (req, res, next) => {
  const { id } = req.params; 

    if (!Types.ObjectId.isValid(id)) {
        return res.status(400).json({ mensaje: "ID inválido. Debe ser un ObjectId válido de MongoDB." });
    }

    next(); // Continúa con la ejecución si el ID es válido
};

module.exports = validarObjectId;