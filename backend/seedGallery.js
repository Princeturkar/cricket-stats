const mongoose = require('mongoose');
const Player = require('./models/Player');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const updateGalleries = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');

    // Update Rohit Sharma
    await Player.updateMany(
      { name: /Rohit Sharma/i },
      { 
        gallery: [
          '/players/rohit/action_1.png',
          '/players/rohit/celebration_1.png',
          '/player_action.png',
          '/player_training.png'
        ] 
      }
    );
    console.log('Updated Rohit Sharma galleries');

    // Update Virat Kohli
    await Player.updateMany(
      { name: /Virat Kohli/i },
      { 
        gallery: [
          '/players/virat/action_1.png',
          '/players/virat/celebration_1.png',
          '/player_action.png',
          '/player_training.png'
        ] 
      }
    );
    console.log('Updated Virat Kohli galleries');

    // Update MS Dhoni
    await Player.updateMany(
      { name: /MS Dhoni/i },
      { 
        gallery: [
          '/players/msd/action_1.png',
          '/players/msd/celebration_1.png',
          '/players/msd/training.png',
          '/player_fielding.png'
        ] 
      }
    );
    console.log('Updated MS Dhoni galleries');

    // Update Hardik Pandya
    await Player.updateMany(
      { name: /Hardik Pandya/i },
      { 
        gallery: [
          '/players/hardik/action_1.png',
          '/players/hardik/celebration_1.png',
          '/players/hardik/training.png',
          '/player_fielding.png'
        ] 
      }
    );
    console.log('Updated Hardik Pandya galleries');

    // Update KL Rahul
    await Player.updateMany(
      { name: /KL Rahul/i },
      { 
        gallery: [
          '/players/klrahul/action_1.png',
          '/players/klrahul/celebration_1.png',
          '/players/klrahul/training.png',
          '/player_fielding.png'
        ] 
      }
    );
    console.log('Updated KL Rahul galleries');

    // Update Jasprit Bumrah
    await Player.updateMany(
      { name: /Jasprit Bumrah/i },
      { 
        gallery: [
          '/players/bumrah/action_1.png',
          '/players/bumrah/celebration_1.png',
          '/players/bumrah/training.png',
          '/players/bumrah/fielding.png'
        ] 
      }
    );
    console.log('Updated Jasprit Bumrah galleries');

    // Update others with generic high-quality images
    await Player.updateMany(
      { name: { $not: /Rohit Sharma|Virat Kohli|MS Dhoni|Hardik Pandya|KL Rahul|Jasprit Bumrah/i } },
      {
        gallery: [
          '/player_action.png',
          '/player_celebration.png',
          '/player_training.png',
          '/player_fielding.png'
        ]
      }
    );
    console.log('Updated other players with generic gallery');

    mongoose.disconnect();
  } catch (err) {
    console.error('Error updating galleries:', err);
  }
};

updateGalleries();
