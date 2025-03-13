let events = [];

const scheduleReminder = (event) => {
    const currentTime = new Date();
    const timeUntilReminder = event.reminderTime - currentTime;

    if (timeUntilReminder > 0) {
        setTimeout(() => {
            console.log(`🔔 Reminder: ${event.name} is happening soon!`);
        }, timeUntilReminder);
    }
};

exports.createEvent = (req, res) => {
    const { name, description, date, time, category, reminderMinutes } = req.body;
    if (!name || !date || !time || !category) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const username = req.user.username;

    const eventDateTime = new Date(`${date}T${time}:00`);
    const reminderTime = new Date(eventDateTime.getTime() - reminderMinutes * 60000);

    const event = {
        id: events.length + 1,
        name,
        description,
        date,
        time,
        category,
        reminderMinutes,
        reminderTime,
        username
    };

    events.push(event);
    scheduleReminder(event);

    res.json({ message: "Event created successfully", event });
};

exports.getEvents = (req, res) => {
    const username = req.user.username;
    const filteredEvents = events.filter(event => event.username === username);
    res.json(filteredEvents);
};
