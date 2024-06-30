import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { PositionsModule } from './modules/positions/positions.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { MembersModule } from './modules/members/members.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { PrismaModule } from 'nestjs-prisma';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
