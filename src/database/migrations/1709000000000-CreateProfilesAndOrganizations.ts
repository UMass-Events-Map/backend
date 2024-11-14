import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProfilesAndOrganizations1709000000000
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE public.profiles (
        id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE public.organizations (
        id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
        organization_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        address VARCHAR(255),
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Create foreign key for event_logs relationship
      ALTER TABLE public.event_logs
      ADD CONSTRAINT fk_event_logs_profile
      FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

      -- Create foreign key for profiles_organizations relationship
      ALTER TABLE public.profiles_organizations
      ADD CONSTRAINT fk_profiles_organizations_profile
      FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

      -- Enable RLS
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

      -- Create policy
      CREATE POLICY "Users can view own profile"
      ON public.profiles FOR ALL
      USING (auth.uid() = id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      -- Drop policies
      DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

      -- Drop foreign key constraints
      ALTER TABLE public.event_logs
      DROP CONSTRAINT IF EXISTS fk_event_logs_profile;

      ALTER TABLE public.profiles_organizations
      DROP CONSTRAINT IF EXISTS fk_profiles_organizations_profile;

      -- Drop tables
      DROP TABLE IF EXISTS public.organizations;
      DROP TABLE IF EXISTS public.profiles;
    `);
  }
}
