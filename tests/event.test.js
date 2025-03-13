const request = require('supertest');
const app = require('../server'); 
jest.useFakeTimers(); 

let token; 
beforeAll(async () => {
    const response = await request(app).post('/auth/login').send({
        username: 'sania',
        password: '123456'
    });

    token = response.body.token;
});

describe('Authentication Routes', () => {
    it('should register a new user', async () => {
        const response = await request(app).post('/auth/register').send({
            username: 'sania',
            password: '123456'
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('User registered successfully');
    });

    it('should login and return a token', async () => {
        const response = await request(app).post('/auth/login').send({
            username: 'sania',
            password: '123456'
        });

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('token');
        token = response.body.token;
    });

    it('should not allow login with incorrect credentials', async () => {
        const response = await request(app).post('/auth/login').send({
            username: 'sania',
            password: '12345f'
        });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
    });
});

describe('Event Routes', () => {
    it('should create a new event', async () => {
        const response = await request(app)
            .post('/events/create')
            .set('Authorization', token)
            .send({
                name: 'Meeting',
                description: 'Project discussion',
                date: '2024-07-01',
                time: '12:00',
                category: 'Work',
                reminderMinutes: 30
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Event created successfully');
        expect(response.body.event).toHaveProperty('id');
    });

    it('should not create an event without required fields', async () => {
        const response = await request(app)
            .post('/events/create')
            .set('Authorization', token)
            .send({
                name: 'Meeting',
                date: '2024-07-01'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toBe('All fields are required');
    });

    it('should get all events for the user', async () => {
        const response = await request(app)
            .get('/events/view')
            .set('Authorization', token);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
    });

    it('should not allow access to events without a token', async () => {
        const response = await request(app).get('/events/view');
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Access Denied');
    });
});

describe('Event & Reminder Functionality', () => {
    let eventId;

    it('should create a new event with a reminder', async () => {
        const response = await request(app)
            .post('/events/create')
            .set('Authorization', token)
            .send({
                name: 'Doctor Appointment',
                description: 'Health Checkup',
                date: '2024-07-01',
                time: '15:00',
                category: 'Health',
                reminderMinutes: 1 
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Event created successfully');
        eventId = response.body.event.id;
    });
    

    it('should retrieve user events', async () => {
        const response = await request(app)
            .get('/events/view')
            .set('Authorization', token);

        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should not allow unauthorized access to events', async () => {
        const response = await request(app).get('/events/view');
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Access Denied');
    });
});
