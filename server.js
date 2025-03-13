const express = require('express');
const dotenv = require('dotenv');
const cron = require('node-cron');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

dotenv.config();
const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);

let reminders = [];

const scheduleReminders = () => {
    const task = cron.schedule('* * * * *', () => { 
        const now = new Date();
        reminders.forEach(reminder => {
            if (new Date(reminder.time) <= now) {
                console.log(`Reminder: ${reminder.eventName} is happening soon!`);
                reminders = reminders.filter(r => r !== reminder);
            }
        });
    });
    return task;
};

const reminderTask = scheduleReminders();

const PORT = process.env.PORT || 5000;
const server=app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, server , reminderTask}; 