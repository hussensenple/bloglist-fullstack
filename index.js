const express = require('express');
const mongoose = require('mongoose');

const usersRouter = require('./controllers/users');
const blogsRouter = require('./controllers/blogs');
const loginRouter = require('./controllers/login'); 
const middleware = require('./utils/middleware'); 

const app = express();
app.use(express.json());
app.use(express.static('dist'))

app.use(middleware.tokenExtractor); 

const mongoUrl = 'mongodb://127.0.0.1:27017/bloglist';
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/login', loginRouter);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});