import { readFile } from "fs/promises";
import { MediaDto } from "src/media/dto";

export const whisper = async (
    audioPath: string,
    dto: MediaDto
) => {
    const baseUrl = "http://whisper:9000/v1/audio/transcriptions";

    if (dto.translate) baseUrl.replace("transcriptions", "translate");

    const queryParams = new URLSearchParams({
        language: dto.language!,
        prompt: dto.prompt || "",
        response_format: "srt",
        temperature: String(dto.temperature || 0)
    });

    const buffer = await readFile(audioPath);
    
    const formData = new FormData();

    formData.append("model", "whisper-1");
    formData.append("language", dto.language || "en");
    formData.append("prompt", dto.prompt || "");
    formData.append("response_format", "srt");
    formData.append("temperature", String(dto.temperature || 0));

    formData.append(
        "file",
        new Blob([buffer], { type: "audio/wav" }),
        "audio.wav"
    );

    const res = await fetch(`${baseUrl}?${queryParams}`, {
        method: "POST",
        body: formData
    });

    return await res.text();
}