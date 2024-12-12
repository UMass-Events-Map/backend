import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ProfilesController (e2e)', () => {
  let app: INestApplication;
  const existingProfileId = 'd6a45ed0-b00d-4dec-9f38-08f3e3d520d1';
  const nonExistentProfileId = 'd6a45ed0-0000-4dec-9f38-08f3e3d52000';

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

  describe('/profiles/exists/:id (GET)', () => {
    it('should return true for existing profile', () => {
      return request(app.getHttpServer())
        .get(`/profiles/exists/${existingProfileId}`)
        .expect(200)
        .expect({
          exists: true,
        });
    });

    it('should return false for non-existent profile', () => {
      return request(app.getHttpServer())
        .get(`/profiles/exists/${nonExistentProfileId}`)
        .expect(200)
        .expect({
          exists: false,
        });
    });
  });
});
