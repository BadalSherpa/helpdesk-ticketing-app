const express = require('express');
const cors = require('cors');
const ticketRoutes = require('./routes/ticketRoute');

//port configuration
const PORT = process.env.PORT || 5000;

//consider app as backend server
const app = express();

app.use(cors());

app.use(express.json());

app.use('/', ticketRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
