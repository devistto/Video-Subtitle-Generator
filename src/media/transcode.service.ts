import { BadRequestException, Injectable } from "@nestjs/common";
import { writeFileSync } from "fs";
import path from "path";
import ffmpeg from "src/processors/ffmpeg";

@Injectable()
export class TranscodeService {
    private validateFile(videoPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(videoPath, (err, metadata) => {
                if (err) return reject(
                    new BadRequestException("Unable to read file metadata")
                );

                const isVideo = metadata.streams?.some(
                    stream => stream.codec_type === "video"
                );

                if (!isVideo) return reject(
                    new BadRequestException("Unable to validate file properities")
                )

                resolve()
            });
        })
    }

    async extractAudio(videoPath: string): Promise<string> {
        await this.validateFile(videoPath)

        const dir = path.dirname(videoPath);
        const audioPath = path.join(dir, "audio.wav");

        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .noVideo()
                .audioCodec('pcm_s16le')
                .format("wav")
                .on('end', () => resolve(audioPath))
                .on("error", err => {
                    console.log(err);
                    reject(new Error("Audio processing failed"))
                })
                .save(audioPath);
        })
    }

    async embedSubtitles(
        videoPath: string,
        subtitles: string
    ): Promise<string> {
        const dir = path.dirname(videoPath);
        const srtPath = path.join(dir, 'subtitles.srt');

        writeFileSync(srtPath, subtitles, { encoding: "utf8" });

        const outputPath = path.join(dir, "output.mp4");
        const normalizedSrtPath = srtPath.split(path.sep).join("/");

        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .outputOptions([
                    `-vf subtitles='${normalizedSrtPath}:force_style=FontName=Arial,FontSize=10,PrimaryColour=&H00FFFFFF,Outline=0.6,OutlineColour=&H70000000,BackColour=&H80000000,Alignment=2,MarginV=20'`,
                    "-c:a copy"
                ])
                .videoCodec("libx264")
                .format("mp4")
                .on("end", () => resolve(outputPath))
                .on("error", err => {
                    reject(new Error("File processing failed"))
                })
                .save(outputPath);
        });
    }
}