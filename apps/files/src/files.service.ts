import { Injectable, StreamableFile } from "@nestjs/common";
import * as path from "path";
import * as fs from "fs";
import { of } from "rxjs";
import { createReadStream } from 'fs';
import jimp from "jimp";

@Injectable()
export class FilesService {

  async getPicture(listPicture) {
    // const fileName = listPicture[0]; //'зеленая_миля.jpg';
    // const res = listPicture[1];
    // const filePath = path.resolve('C:\\learnjs-tasks\\backendChema\\apps\\files\\src', 'picture', `зеленая_миля.jpg`);
    // // if (!fs.existsSync(filePath)) {
    // //   fs.mkdirSync(filePath, {recursive: true});
    // // }
    // console.log('filePath = ' + filePath);
    // console.log('res = ' + res);
    // const file =  createReadStream(filePath);
    // console.log('file = ' + file.bytesRead);

    // const imagePath = `path/to/image`;
    // const jimpImageToBuffer = await jimp
    //   .read(filePath) // read image from path
    //   .then((ele) => {
    //     const mimeForImage = ele._originalMime;
    //     return ele.getBufferAsync(mimeForImage); // convert image to buffer(compatiable to save to database).
    //   })
    //   .catch((err) => console.log(err));
    // console.log(jimpImageToBuffer);
    // const b64 = Buffer.from(filePath).toString('base64');
    return "Hello frome fileservice!";
    // console.log(jimpImageToBuffer);
    // return {"image" : b64};
    // return jimpImageToBuffer;
  }
}
