import fs from "fs";
import { Jimp } from 'jimp';
import os from 'os';
import path from 'path';

const tempDir = os.tmpdir();

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    try {
      const photo = await Jimp.read(inputURL);
      // temp dir is changed to work in windows
      const outpath = path.join(tempDir, "filtered." + Math.floor(Math.random() * 2000) + ".jpg");
      photo.resize({ w: 256, h: 256})// resize
      photo.greyscale() // set greyscale
      await photo.write(outpath);
      resolve(outpath);
    } catch (error) {
      console.log(error)
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
