import path from 'path';

import fs, { promises as fsPromises } from 'fs';
import { UPLOAD_GET_HOST } from '../config';
import { UPLOADS_DESTINATION, ROOT_PATH } from '../constants';
import { getCurrentUnixTimestamp } from './utils';
import { formatOptions } from './utils';

const { stat, readFile } = fsPromises;

export async function loadJson(jsonPath) {
  try {
    const data = await readFile(jsonPath, 'utf8');
    const jsonData = JSON.parse(data);

    return jsonData
    // console.log('Dữ liệu JSON:', jsonData);
  } catch (error) {
    console.error('Lỗi:', error);
    return null;
  }
};

export async function writeObjToJsonFile(data, jsonFilePath) {
  const dir = path.dirname(jsonFilePath);

  // Check if the directory exists, if not, create it
  try {
    await fs.promises.access(dir);
  } catch (err) {
    // Directory does not exist, create it
    try {
      await fs.promises.mkdir(dir, { recursive: true });
    } catch (mkdirErr) {
      console.error('Error creating directory:', mkdirErr);
      return;
    }
  }

  // Write the object to a JSON file
  try {
    await fs.promises.writeFile(jsonFilePath, JSON.stringify(data, null, 2));
    console.log('Data written to file successfully!');
  } catch (err) {
    console.error('Error writing file:', err);
  }
}

export async function isFileExist(filePath) {
  try {
    // ファイルが存在するかどうかを確認する
    await stat(filePath);

    // ファイルが存在し空ではない場合
    const fileData = await readFile(filePath, 'utf-8');
    if (fileData.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      // ファイルが存在しません
      return false;
    } else {
      // 別のエラーが発生しました
      throw error;
    }
  }
}

/**
 * Convert a file path to a URL
 * @param {string} filePath - The file path to be converted
 * @returns {string} - The converted URL
 */
export function convertFilePathToUrl(filePath) {
  try {
    if (!filePath) return '';

    const filePathSlashes = filePath.replace(/\\/g, '/')

    // Extract the relevant part of the file path
    const relativePath = filePathSlashes.split(`/${UPLOADS_DESTINATION}/`)[1];

    const urlPath = path.posix.join(UPLOADS_DESTINATION, relativePath);

    // Create the full URL and replace backslashes with forward slashes
    const fullUrl = `${UPLOAD_GET_HOST}/${urlPath}`;

    return fullUrl;
  } catch (error) {
    return filePath
  }

}

/**
 * exp: http://localhost:3001/uploads/some/path/abc.png
 * -> /uploads/some/path/abc.png
 * @param {*} filePath 
 * @returns 
 */
export function removeHostName(filePath) {
  if (!filePath) return ''
  return filePath.replace(UPLOAD_GET_HOST, '')
}

export function convertFilePathToServerFilepath(filePath) {
  if (!filePath) return ''
  return path.join(ROOT_PATH, filePath)
}

export async function createFilesName(dataFilePath, options) {

  const newOptions = formatOptions(options)

  const currentTimestamp = getCurrentUnixTimestamp()

  // 元のデータファイルへの絶対パス
  const dataFullPath = path.join(ROOT_PATH, dataFilePath)
  // 元のデータファイルが含まれるフォルダーへのパス
  const desFolder = path.dirname(dataFullPath);
  // 元のデータファイルの名前のみ
  const srcDataFile = path.basename(dataFullPath);

  const jsonExtension = '.json';

  // 元のデータファイル名（拡張子なし）
  const basename = path.basename(srcDataFile, path.extname(srcDataFile))
  // オプションファイルの保存パス
  let optionFilePath = path.join(
    desFolder,
    `option_${currentTimestamp}_` + basename + jsonExtension
  );

  // チャートに表示するために使用されるデータを含む出力ファイルへのパス
  let outputDataFile = path.join(
    desFolder,
    `out_${currentTimestamp}_` + basename + jsonExtension
  );

  let outputHTMLFile = path.join(
    desFolder,
    `out_${currentTimestamp}_` + basename + '.html'
  );

  let outputHTMLFile_2 = path.join(
    desFolder,
    `out_${currentTimestamp}_` + basename + '_2.html'
  );

  let outputPngFile = path.join(
    desFolder,
    `out_${currentTimestamp}_` + basename + '.png'
  );

  let outputJsonFile = path.join(
    desFolder,
    `out_${currentTimestamp}_` + basename + '.json'
  );

  let outputTextFile = path.join(
    desFolder,
    `out_${currentTimestamp}_` + basename + '.txt'
  );

  let outputSvgFile = path.join(
    desFolder,
    `out_${currentTimestamp}_` + basename + '.svg'
  );

  // オプションファイル保存
  await writeObjToJsonFile(newOptions, optionFilePath)

  return {
    dataFullPath,
    optionFilePath,
    outputDataFile,
    outputHTMLFile,
    outputPngFile,
    outputJsonFile,
    outputTextFile,
    outputHTMLFile_2,
    outputSvgFile
  }

}