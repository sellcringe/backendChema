import { NestFactory } from '@nestjs/core';
import { FilesModule } from './files.module';
import { ConfigService } from "@nestjs/config";
import { SharedService } from "@app/shared/services/shared/shared.service";

async function bootstrap() {
  const app = await NestFactory.create(FilesModule);
  const configService = app.get(ConfigService);
  const sharedService = app.get(SharedService);

  const queue = configService.get('RABBITMQ_FILES_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(queue));
  app.startAllMicroservices();
}
bootstrap();
