const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// TODO: add API endpoints to interact with the smart contract

app.get('/', (req, res) => {
  res.send('Lottery backend running');
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
