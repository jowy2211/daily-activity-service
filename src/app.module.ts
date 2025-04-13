import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PositionsModule } from './modules/positions/positions.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { MembersModule } from './modules/members/members.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { PrismaModule } from 'nestjs-prisma';
import { FileStorageModule } from './modules/file-storage/file-storage.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    PositionsModule,
    ProjectsModule,
    MembersModule,
    ActivitiesModule,
    FileStorageModule,
    DashboardModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
