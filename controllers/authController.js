const User = require('../models/User')
const bcrypt = require('bcrypt')
exports.register = async (req, res) => {
    const user = new User(req.body)
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user.password = hashedPassword;
        await user.save()
        res.status(201).json({ message: 'Usuario registrado exitosamente', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }
       
}
exports.login = async (req, res) => {
    try {
        const user = await User.findOne({email:req.body.email});
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const validarPassword = await bcrypt.compare(req.body.password, user.password)
        if (!password) {
            return res.status(400).json({ message: 'Password incorrecto intenta de nuevo' });
        }
        res.status(200).json({ message: 'Usuario logueado exitosamente', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al hacer loggin' });
    }
}