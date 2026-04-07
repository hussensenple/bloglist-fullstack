const jwt = require('jsonwebtoken');
const User = require('../models/user');

const SECRET = 'GIS_SUPER_SECRET_KEY';

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7); 
  } else {
    request.token = null;
  }
  next(); 
};

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }

  try {
    const decodedToken = jwt.verify(request.token, SECRET);
    
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' });
    }
    
    request.user = await User.findById(decodedToken.id);
    next();
  } catch (error) {
    return response.status(401).json({ error: 'token invalid or expired' });
  }
};

module.exports = { tokenExtractor, userExtractor, SECRET };