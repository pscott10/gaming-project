//set up express server
const express = require('express');
const reportRoutes = require('./routes/reports');

const app = express();
app.use(express.json());

app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});