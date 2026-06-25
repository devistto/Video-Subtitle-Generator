import { readFile } from "fs/promises";
import { MediaDto } from "src/media/dto";

export const whisper = async (
    audioPath: string,
    dto: MediaDto
) => {
    const endpoint = dto.translate ? "translations" : "transcriptions";

    const buffer = await readFile(audioPath);

    const formData = new FormData();

    formData.append("language", dto.language);
    formData.append("prompt", dto.prompt);
    formData.append("response_format", "srt");
    formData.append("file",
        new Blob([buffer], { type: "audio/wav" }
        ));

    const res = await fetch(
        `http://whisper:9000/v1/audio/${endpoint}`, {
        method: "POST",
        body: formData
    });

    return res.text();
}