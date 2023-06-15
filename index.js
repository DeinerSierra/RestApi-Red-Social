const express = require('express')
const app = express();
const dotenv = require('dotenv')
const helmet = require('helmet')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { default: mongoose } = require('mongoose');
dotenv.config()
const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const postRoutes = require('./routes/post')

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conexión exitosa a MongoDB');
    // Aquí puedes realizar tus operaciones en la base de datos
  })
  .catch((error) => {
    console.error('Error al conectarse a MongoDB:', error);
});
//middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet())
app.use(morgan("common"))

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
const port = process.env.PORT
app.listen(port,()=>{
    console.log(`Server running in port ${port} `)
})