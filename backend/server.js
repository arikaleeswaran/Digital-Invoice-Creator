const app = require('./api/index');
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));


// This is to run in locally.
// The vercel will run the index file from api/ to run locally this will be used.