import { BadRequestException, Injectable } from "@nestjs/common";
import { MediaDto } from "src/media/dto";
import { Queue } from "bullmq";
import { InjectQueue } from "@nestjs/bullmq";

@Injectable()
export class QueueService {
    constructor(@InjectQueue("video") private videoQueue: Queue) { }

    async enqueue(videoPath: string, dto: MediaDto) {
        const job = await this.videoQueue.add("transcode", {
            ...dto, videoPath
        }, {
            attempts: 3,
            removeOnFail: true,
            removeOnComplete: {
                age: 300
            }
        })

        return job.id
    }

    async findResult(id: string) {
        const job = await this.videoQueue.getJob(id);
        return job?.returnvalue.outputPath
    }
}