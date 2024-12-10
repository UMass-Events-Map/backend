import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('EventsController (e2e)', () => {
    let app: INestApplication;
    const eventId = '16f65d29-080a-4618-a6ce-a90938319934';

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/events/:id (GET)', () => {
        it('should return event details with building information', () => {
            return request(app.getHttpServer())
                .get(`/events/${eventId}`)
                .expect(200)
                .expect((res) => {
                    // Test exact event data
                    expect(res.body).toMatchObject({
                        id: '16f65d29-080a-4618-a6ce-a90938319934',
                        name: 'The Secret Campus Art Show',
                        description: expect.any(String),
                        date: '2024-11-14',
                        time: '16:00:00',
                        building_id: '0688b324-a17b-44a4-896e-9a806a217890',
                        room_number: '201',
                        organization_id: null,
                        thumbnail: expect.stringContaining('hearstapps.com'),
                        attendance: 35,
                        created_at: expect.any(String),
                        updated_at: expect.any(String),
                    });

                    // Test building data structure
                    expect(res.body.building).toMatchObject({
                        id: '0688b324-a17b-44a4-896e-9a806a217890',
                        name: 'Fine Arts Center',
                        thumbnail: expect.stringContaining('citypointpartners.com'),
                        address: '151 Presidents Dr, Amherst, MA 01003',
                        latitude: 42.388236,
                        longitude: -72.525936,
                        created_at: expect.any(String),
                        updated_at: expect.any(String),
                    });

                    // Test nullable fields
                    expect(res.body.organization).toBeNull();
                    expect(Array.isArray(res.body.event_logs)).toBeTruthy();
                });
        });

        it('should return error for non-existent event', () => {
            return request(app.getHttpServer())
                .get('/events/0688b324-a17b-4444-896e-9a806a217890')
                .expect(200)
                .expect({
                    error: 'Event not found',
                });
        });
    });
}); 