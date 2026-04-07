const express = require('express');
const mongoose = require('mongoose');

const usersRouter = require('./controllers/users');
const blogsRouter = require('./controllers/blogs');

const app = express();
app.use(express.json());

const mongoUrl = 'mongodb://localhost/bloglist';
mongoose.connect(mongoUrl);

app.use('/api/users', usersRouter);
app.use('/api/blogs', blogsRouter);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});