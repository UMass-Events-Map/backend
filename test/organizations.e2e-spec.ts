import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('OrganizationsController (e2e)', () => {
  let app: INestApplication;
  const profileId = 'd6a45ed0-b00d-4dec-9f38-08f3e3d520d1';
  const nonExistentProfileId = 'd6a45ed0-0000-4dec-9f38-08f3e3d520d1';

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

  describe('/organizations/profile/:id (GET)', () => {
    it('should return organizations for an existing profile', () => {
      return request(app.getHttpServer())
        .get(`/organizations/profile/${profileId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBeGreaterThan(0);

          const organization = res.body[0];
          expect(organization).toMatchObject({
            id: '6a0583c1-dc38-44e0-8a7a-9742ea90b61e',
            name: 'Chess Club',
            email: 'chess@umass.edu',
            description: 'Chess Club meets every friday',
            image_url:
              'https://upload.wikimedia.org/wikipedia/commons/6/6f/ChessSet.jpg',
            address: expect.stringContaining(
              'University of Massachusetts Amherst',
            ),
            verified: false,
          });
        });
    });

    it('should return empty array for profile with no organizations', () => {
      return request(app.getHttpServer())
        .get(`/organizations/profile/${nonExistentProfileId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBeTruthy();
          expect(res.body.length).toBe(0);
        });
    });
  });
});
