const request = require('supertest');
const app = require('../server'); // Import the app for testing without starting the server
const http = require('http'); // Import http to create a server instance
const server = http.createServer(app); // Create a server instance

describe('Event API', () => {
    let authToken = ""; // To store token after login

    beforeAll(async () => {
        // Register a user (if authentication is needed)
        await request(server) // Use the server instance for requests
            .post('/auth/register')
            .send({ username: "sania", password: "123456" });

        // Login and get the token
        const loginRes = await request(server) // Use the server instance for requests
            .post('/auth/login')
            .send({ username: "sania", password: "123456" });

        authToken = loginRes.body.token;
    });

    it('should create an event successfully', async () => {
        const res = await request(server) // Use the server instance for requests
            .post('/events/create')
            .send({
                name: "Meeting",
                description: "Project discussion",
                date: "2025-03-20",
                time: "14:00",
                category: "Meetings",
                reminderMinutes: 30
            })
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(201);
        expect(res.body.event.name).toBe("Meeting");
    });

    it('should fail to create an event with missing fields', async () => {
        const res = await request(server) // Use the server instance for requests
            .post('/events/create')
            .send({ name: "Meeting" }) // Missing required fields
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(400);
        expect(res.body.message).toBe("All fields are required");
    });

    it('should fetch all events', async () => {
        const res = await request(server) // Use the server instance for requests
            .get('/events/view')
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('should set a reminder for an event', async () => {
        const res = await request(server) // Use the server instance for requests
            .post('/events/create')
            .send({
                name: "Doctor Appointment",
                description: "Dentist visit",
                date: "2025-03-21",
                time: "09:00",
                category: "Appointments",
                reminderMinutes: 15
            })
            .set("Authorization", `Bearer ${authToken}`);

        expect(res.status).toBe(201);
        expect(res.body.event.reminderMinutes).toBe(15);
    });

    it('should return 401 if token is missing', async () => {
        const res = await request(server) // Use the server instance for requests
            .get('/events/view');

        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Unauthorized");
    });
});
