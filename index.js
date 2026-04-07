const express = require('express');
const mongoose = require('mongoose');
const usersRouter = require('./controllers/users'); 

const app = express();
app.use(express.json()); 

// الاتصال بقاعدة البيانات
const mongoUrl = 'mongodb://localhost/bloglist';
mongoose.connect(mongoUrl);

app.use('/api/users', usersRouter);

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});