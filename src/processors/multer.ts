import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer"
import path from "path";
import fs from "node:fs"
import { randomInt } from "crypto"
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

const MIMETYPES = [
    "video/mp4", "video/mpeg", "video/quicktime", "video/mov", "video/wmv",
    "video/x-msvideo", "video/avi", "video/webm", "video/ogg", "video/x-flv",
    "video/3gpp", "video/3gpp2", "video/x-matroska", "video/x-ms-wmv", "video/ts",
    "video/mp2t", "video/x-f4v", "video/x-m4v", "video/x-mpeg", "video/x-mng",
    "video/3gpp-tt", "video/ivf", "video/vnd.rn-realvideo", "video/vnd.vivo",
    "video/x-sgi-movie", "video/x-ms-asf", "video/x-msvideo", "video/x-ms-wvx",
    "video/x-ms-wmx", "video/x-ms-wm", "video/x-ms-wmv", "video/x-ms-wmvd",
    "video/x-ms-wmvr", "video/x-ms-wmx", "video/x-ms-wvx", "video/x-flv",
    "video/webm", "video/ogg", "video/x-theora", "video/x-dv", "video/x-mkv",
    "video/3gpp", "video/3gpp2",
];

export const multer: MulterOptions = {
    storage: diskStorage({
        destination(req, file, callback) {
            const folder = path.join(
                process.cwd(),
                "uploads",
                randomInt(5000).toString()
            );

            fs.mkdirSync(folder, { recursive: true });
            callback(null, folder);
        },
        filename(req, file, callback) {
            callback(null, "input" + path.extname(file.originalname))
        },
    }),
    fileFilter(req, file, callback) {
        if (!MIMETYPES.includes(file.mimetype))
            callback(new BadRequestException(
                `Acceptable values are: ${MIMETYPES}`),
                false
            )

        callback(null, true)
    }
} 