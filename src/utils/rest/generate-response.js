const generateResponse = (message, data = {}, status = 'SUCCESS') => {
  const response = {
    data,
    message,
    status,
  };
  return response;
};

module.exports = generateResponse;
