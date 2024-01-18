const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;
const app = express();

// Use cookie-parser middleware
app.use(cookieParser());

// TO DO:Configuration of ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get('/', (req, res) => {
  res.send('app working...');
});

const taskRoutes = require('./routes/task.route.js');
const userRoutes = require('./routes/user.route.js');

// Routes

app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log('listening on port ' + port);
});
