import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AssessmentModule } from './assessment/assessment.module';
import { CourseModule } from './course/course.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './guard/jwt.strategy';

@Module({
  imports: [
    AuthModule, 
    AssessmentModule, 
    CourseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService:ConfigService) => ({
          secret: configService.get('JWT_SECRET')
      }),
      inject: [ConfigService]
    }),
    MongooseModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory: async (config:ConfigService) => ({
        uri:config.get<string>('MONGO_USERS_URL')
      })
    }),
    ConfigModule.forRoot(
      {
        envFilePath:'.env',
        isGlobal:true
      }
      ),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy],
})
export class AppModule {}
