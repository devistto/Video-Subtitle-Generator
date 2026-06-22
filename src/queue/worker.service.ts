import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { TranscodeService } from "../media/transcode.service";
import { StatusService } from "../media/status.service";
import { whisper } from "src/processors/whisper";

@Processor("video", { concurrency: 3 })
export class WorkerService extends WorkerHost {
    constructor(
        private transcode: TranscodeService,
        private status: StatusService,
    ) { super() }

    async process(job: Job): Promise<Record<string, any>> {
        const audioPath = await this.transcode.extractAudio(
            job.data.videoPath
        );

        const subtitles = await whisper(audioPath, job.data);

        const outputPath = await this.transcode.embedSubtitles(
            job.data.videoPath,
            subtitles
        );

        return { outputPath };
    }

    @OnWorkerEvent('progress')
    async progress(job: Job) {
        this.status.progress({
            id: job.id!,
            progress: job.progress
        })
    }
}