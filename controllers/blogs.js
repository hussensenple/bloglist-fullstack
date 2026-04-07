const express = require('express');
const Blog = require('../models/blog');
const User = require('../models/user');

const blogsRouter = express.Router();

blogsRouter.get('/', async (request, response) => {
  try {
    const searchTerm = request.query.search; 
    const authorTerm = request.query.author; 
    const sortBy = request.query.sortBy;
    const order = request.query.order;
    const page = parseInt(request.query.page) || 1;   
    const limit = parseInt(request.query.limit) || 10;

    let filter = {}; 
    if (searchTerm) {
      filter.title = { $regex: searchTerm, $options: 'i' };
    }
    if (authorTerm) {
      filter.author = { $regex: authorTerm, $options: 'i' };
    }

    let sortOptions = {};
    if (sortBy) {
      const allowedSortFields = ['likes'];
      if (!allowedSortFields.includes(sortBy)) {
        return response.status(400).json({ error: 'unsupported sort field' });
      }
      
      const sortOrder = order === 'desc' ? -1 : 1;
      sortOptions[sortBy] = sortOrder;
    }

    const skip = (page - 1) * limit;

    const blogs = await Blog.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .populate('user', { username: 1, name: 1 });

    const totalMatchingBlogs = await Blog.countDocuments(filter);
    const totalPages = Math.ceil(totalMatchingBlogs / limit);

    response.json({
      data: blogs,
      meta: {
        currentPage: page,
        pageSize: blogs.length,
        totalMatchingBlogs: totalMatchingBlogs,
        totalPages: totalPages
      }
    });

  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});


blogsRouter.post('/', async (request, response) => {
  const body = request.body;
  const user = await User.findOne();

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id 
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.patch('/:id/like', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' });
    }

    blog.likes = blog.likes + 1;
    const updatedBlog = await blog.save();
    response.status(200).json(updatedBlog);

  } catch (error) {
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'malformed id' });
    }
    response.status(500).json({ error: error.message });
  }
});

module.exports = blogsRouter;