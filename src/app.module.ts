import { Module } from "@nestjs/common";
import { MediaController } from "./media/media.controller";
import { QueueService } from "./queue/queue.service";
import { TranscodeService } from "./media/transcode.service";
import { BullModule } from "@nestjs/bullmq";
import { WorkerService } from "./queue/worker.service";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { StatusService } from "./media/status.service";

@Module({
    imports: [
        BullModule.forRoot({
            connection: {
                host: "redis",
                port: 6379
            }
        }),
        BullModule.registerQueue({
            name: "video"
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, "..", "public")
        })
    ],
    controllers: [MediaController],
    providers: [
        QueueService, TranscodeService, WorkerService,
        StatusService,
    ]
})

export class AppModule { }