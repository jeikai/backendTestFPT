const validator = {
    verifyEmail: (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    
    verifyPassword: (password) => {
      return password && password.length >= 6;
    }
  };
  
  module.exports = validator;