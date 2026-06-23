import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { TranscodeService } from "../media/transcode.service";
import { WebsocketService } from "../media/websocket";
import { whisper } from "src/processors/whisper";

@Processor("video", { concurrency: 3 })
export class WorkerService extends WorkerHost {
    constructor(
        private transcode: TranscodeService,
        private websocket: WebsocketService,
    ) { super() }

    async process(job: Job): Promise<Record<string, any>> {
        job.updateProgress(0)
        const audioPath = await this.transcode.extractAudio(
            job.data.videoPath
        );

        job.updateProgress(1)
        const subtitles = await whisper(audioPath, job.data);

        job.updateProgress(2)
        const outputPath = await this.transcode.embedSubtitles(
            job.data.videoPath,
            subtitles
        );

        job.updateProgress(3)
        return { outputPath };
    }

    @OnWorkerEvent('progress')
    async progress(job: Job) {
        this.websocket.progress({
            jobId: job.id!,
            progress: job.progress
        })
    }
}