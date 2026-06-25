import { Transform } from "class-transformer";
import { IsBoolean, IsEnum, IsString } from "class-validator";

export enum Language {
    auto = "auto",
    afrikaans = "af", arabic = "ar", armenian = "hy", azerbaijani = "az",
    belarusian = "be", bosnian = "bs", bulgarian = "bg", catalan = "ca", chinese = "zh",
    croatian = "hr", czech = "cs", danish = "da", dutch = "nl", english = "en",
    estonian = "et", finnish = "fi", french = "fr", galician = "gl", german = "de",
    greek = "el", hebrew = "he", hindi = "hi", hungarian = "hu", icelandic = "is",
    indonesian = "id", italian = "it", japanese = "ja", kannada = "kn", kazakh = "kk",
    korean = "ko", latvian = "lv", lithuanian = "lt", macedonian = "mk", malay = "ms",
    marathi = "mr", maori = "mi", nepali = "ne", norwegian = "no", persian = "fa",
    polish = "pl", portuguese = "pt", romanian = "ro", russian = "ru", serbian = "sr",
    slovak = "sk", slovenian = "sl", spanish = "es", swahili = "sw", swedish = "sv",
    tagalog = "tl", tamil = "ta", thai = "th", turkish = "tr", ukrainian = "uk",
    urdu = "ur", vietnamese = "vi", welsh = "cy"
}

export class MediaDto {
    @IsEnum(Language)
    @Transform(({ value }) =>
        Object.values(Language).includes(value)
            ? value
            : Language.auto
    )
    language!: Language;

    @Transform(({ value }) => value ?? "")
    @IsString()
    prompt!: string;

    @IsBoolean()
    @Transform(({ value }) => value === true || value === "true")
    translate!: boolean
}