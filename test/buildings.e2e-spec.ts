import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('BuildingsController (e2e)', () => {
    let app: INestApplication;
    const buildingId = '0688b324-a17b-44a4-896e-9a806a217890';

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

    describe('/buildings/:id/events (GET)', () => {
        it('should return events for a specific building', () => {
            return request(app.getHttpServer())
                .get(`/buildings/${buildingId}/events`)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBeTruthy();
                    expect(res.body.length).toBeGreaterThan(0);

                    // Test first event in the array
                    const event = res.body[0];
                    expect(event).toMatchObject({
                        id: '16f65d29-080a-4618-a6ce-a90938319934',
                        name: 'The Secret Campus Art Show',
                        description: expect.any(String),
                        date: '2024-11-14',
                        time: '16:00:00',
                        building_id: buildingId,
                        room_number: '201',
                        organization_id: null,
                        thumbnail: expect.stringContaining('hearstapps.com'),
                        attendance: 35,
                        created_at: expect.any(String),
                        updated_at: expect.any(String),
                    });

                    // Test building data in the event
                    expect(event.building).toMatchObject({
                        id: buildingId,
                        name: 'Fine Arts Center',
                        thumbnail: expect.stringContaining('citypointpartners.com'),
                        address: '151 Presidents Dr, Amherst, MA 01003',
                        latitude: 42.388236,
                        longitude: -72.525936,
                        created_at: expect.any(String),
                        updated_at: expect.any(String),
                    });

                    // Test nullable fields
                    expect(event.organization).toBeNull();
                    expect(Array.isArray(event.event_logs)).toBeTruthy();
                });
        });

        it('should return empty array for building with no events', () => {
            return request(app.getHttpServer())
                .get('/buildings/0688b324-a17b-4444-896e-9a806a217890/events')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBeTruthy();
                    expect(res.body.length).toBe(0);
                });
        });
    });
}); 