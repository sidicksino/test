module.exports = function generateOTP() {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };
  