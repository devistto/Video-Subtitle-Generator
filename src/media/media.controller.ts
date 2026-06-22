import { Body, Controller, Get, Param, ParseFilePipe, Post, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { multer } from 'src/processors/multer';
import { MediaDto } from 'src/media/dto';
import { QueueService } from 'src/queue/queue.service';
import { createReadStream } from 'node:fs';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('videos')
export class MediaController {
    constructor(private queue: QueueService) { }

    @Post("subtitles")
    @UseInterceptors(FileInterceptor('video', multer))
    async generate(
        @UploadedFile(new ParseFilePipe({
            fileIsRequired: true
        })) file: Express.Multer.File,
        @Body() dto: MediaDto
    ) {
        const jobId = await this.queue.enqueue(file.path, dto);
        return { id: jobId, status: "queued" };
    }

    @Get('jobs/:id')
    async findComplete(@Param('id') id: string) {
        const output = await this.queue.findResult(id);
        const stream = createReadStream(output);

        return new StreamableFile(stream, {
            type: 'video/mp4',
            disposition: `attachment; filename="output.mp4"`,
        });
    }
}