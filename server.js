const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');

const db= require('./db');
const userRoutes = require('./routes/userRoutes');
const meRoutes = require('./routes/profileRoutes');
const resetPasswordRoute = require('./routes/resetPassordRoute');
const eventRouter = require('./routes/events');
const authRoutes = require('./routes/googleAuth');
const swaggerSpec = require('./swagger/swaggerConfig');
const venueRouters = require('./routes/venueRoutes');
const sectionRouters = require('./routes/sectionRoutes');
const seatRoutes = require('./routes/seatRoutes');

const app = express();

dotenv.config();
require('./config/passport');
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/dashboard', (req, res) =>{
  res.send("welcome to Agura App")
})

// User
app.use('/api/user', userRoutes);
app.use('/api/me', meRoutes);
app.use('/api/resetPassword', resetPasswordRoute);

// Venue
app.use('/api/venue', venueRouters);

// Section
app.use('/api/section', sectionRouters);

// Routes
app.use('/api/seats', seatRoutes);

// Event
app.use('/events', eventRouter);

// google auth
app.use('/auth', authRoutes);

// Swagger only for Google OAuth
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
});