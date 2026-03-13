const mongoose = require('mongoose');
const Player = require('./models/Player');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const updateBumrahProfile = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    await Player.updateMany(
      { name: /Jasprit Bumrah/i },
      { 
        $set: { 
          image: '/players/bumrah/profile.png',
          nationality: 'Indian',
          dob: 'Dec 06, 1993',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm Fast',
          jerseyNumber: '93',
          description: "Jasprit Bumrah is a premier Indian fast bowler known for his unique action and ability to bowl devastating yorkers. He is a key asset across all formats of the game, having delivered match-winning performances in Test, ODI, and T20 international cricket."
        } 
      }
    );

    console.log('Successfully updated Jasprit Bumrah profile and professional details');
    mongoose.disconnect();
  } catch (err) {
    console.error('Error updating Jasprit Bumrah profile:', err);
  }
};

updateBumrahProfile();
