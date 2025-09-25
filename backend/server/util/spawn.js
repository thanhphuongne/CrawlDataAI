import { spawn, exec } from 'child_process';
import path from 'path';
import { RSCRIPT_PATH } from '../config';
import { ROOT_PATH } from '../constants';

export function getPythonScriptPath(scriptName, scriptSubFolder = 'scripts') {
  return path.join(ROOT_PATH, scriptSubFolder, scriptName)
}

// export async function runPyscript(scriptname, inputArray) {
//   return new Promise((resolve, reject) => {
//     const scriptPath = getPythonScriptPath(scriptname)

//     const processParams = [scriptPath].concat(inputArray)
//     // const pythonProcess = spawn('python', [scriptPath, JSON.stringify(inputArray)]);

//     const pythonProcess = spawn('python', processParams);

//     pythonProcess.stdout.on('data', (data) => {
//       try {
//         // console.log(data);
//         const parsedResult = JSON.parse(data.toString());
//         // parsedResult.pvalue = parseFloat(parsedResult.pvalue.toFixed(4));
//         resolve(parsedResult);
//       } catch (jsonError) {
//         reject(`Error parsing JSON: ${jsonError}`);
//       }

//       // resolve(data.toString());
//     });

//     pythonProcess.stderr.on('data', (data) => {
//       reject(data.toString());
//     });

//     pythonProcess.on('close', (code) => {
//       if (code !== 0) {
//         reject(`Python process exited with code ${code}`);
//       }
//     });
//   });
// }

export async function runPyscript(scriptname, inputArray) {
  return new Promise((resolve, reject) => {
    const scriptPath = getPythonScriptPath(scriptname)

    const processParams = [scriptPath].concat(inputArray)
    // const pythonProcess = spawn('python', [scriptPath, JSON.stringify(inputArray)]);

    const pythonProcess = spawn('python', processParams);

    // console.log('pythonProcess: ', processParams)

    let resultData = '';

    pythonProcess.stdout.on('data', (data) => {
      resultData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python script exited with code ${code}`));
      }
      try {
        // console.log('resultData: ', resultData);
        const result = JSON.parse(resultData);
        resolve(result);
      } catch (error) {
        reject(new Error('Failed to parse JSON from Python script'));
      }
    });
  });
}

export async function runChiScript(observed, expected, ddof) {
  return new Promise((resolve, reject) => {

    const data = JSON.stringify({
      f_obs: observed,
      f_exp: expected,
      ddof
    });

    const scriptPath = getPythonScriptPath('cal_chisquare_fitness.py')
    const pythonProcess = spawn('python', [scriptPath, data]);

    let result = '';
    let error = '';

    // Lắng nghe dữ liệu từ stdout
    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    // Lắng nghe dữ liệu từ stderr
    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    // Xử lý khi tiến trình kết thúc
    pythonProcess.on('close', (code) => {
      if (code === 0) {
        try {
          console.log(result);
          const parsedResult = JSON.parse(result);
          // parsedResult.pvalue = parseFloat(parsedResult.pvalue.toFixed(4));
          resolve(parsedResult);
        } catch (jsonError) {
          reject(`Error parsing JSON: ${jsonError}`);
        }
      } else {
        reject(`Python process exited with code ${code}: ${error}`);
      }
    });
  });
}

export async function runPythonScript(scriptName, params) {
  // inputFile, outputFile, optionJsonFilePath

  return new Promise((resolve, reject) => {
    let scriptPath = path.join(ROOT_PATH, 'scripts', scriptName)

    const processParams = [scriptPath].concat(params)
    // if (optionJsonFilePath) processParams.push(optionJsonFilePath)
    // console.log('Python scriptPath: ', scriptPath)
    console.log("runPythonScript: ", processParams)

    let process = spawn('python', processParams);

    let result = '';

    // Capture stdout data
    process.stdout.on('data', (data) => {
      result += data.toString();
    });

    // Capture stderr data
    process.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    // Handle process exit
    process.on('close', (code) => {
      if (code !== 0) {
        reject(`script exited with code ${code}`);
      } else {
        resolve(result.trim());
      }
    });
  });
}

export async function getRawExcelDataPython(inputFile, outputFile) {
  return new Promise((resolve, reject) => {
    let scriptPath = path.join(ROOT_PATH, 'scripts', 'get_raw_data.py')
    let process = spawn('python', [scriptPath, inputFile, outputFile]);

    console.log('Python scriptPath: ', scriptPath)
    let result = '';

    // Capture stdout data
    process.stdout.on('data', (data) => {
      result += data.toString();
    });

    // Capture stderr data
    process.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    // Handle process exit
    process.on('close', (code) => {
      if (code !== 0) {
        reject(`script exited with code ${code}`);
      } else {
        resolve(result.trim());
      }
    });
  });
}

export async function runRScript3(scriptName, inputFile, outputFile, optionJsonFilePath = "") {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(ROOT_PATH, 'scripts', scriptName);
    const command = `"${RSCRIPT_PATH}"`;

    const args = [scriptPath, inputFile, outputFile, optionJsonFilePath];
    console.log('Running command: ', command, args);

    // Sử dụng spawn để chạy tiến trình R
    const rProcess = spawn(command, args, { shell: true });

    let stdoutData = '';
    let stderrData = '';

    rProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    rProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    rProcess.on('close', (code) => {
      if (code === 0) {
        resolve(stdoutData);
      } else {
        reject(`R script exited with code ${code}: ${stderrData}`);
      }
    });

    rProcess.on('error', (err) => {
      reject(`Failed to start R process: ${err.message}`);
    });
  });
}


export async function runRScript2(scriptName, inputFile, outputFile, optionJsonFilePath = "") {
  return new Promise((resolve, reject) => {
    // Construct the command to run Rscript with the script and arguments

    const scriptPath = path.join(ROOT_PATH, 'scripts', scriptName)
    const command = `"${RSCRIPT_PATH}" ${scriptPath} ${inputFile} ${outputFile} ${optionJsonFilePath}`;

    console.log('command: ', command)
    // Run the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
}

export async function runRScript(inputFile, outputFile) {
  return new Promise((resolve, reject) => {
    // Construct the command to run Rscript with the script and arguments

    const scriptPath = path.join(ROOT_PATH, 'scripts', 'create_pareto.R')
    const command = `"${RSCRIPT_PATH}" ${scriptPath} ${inputFile} ${outputFile}`;

    console.log('command: ', command)
    // Run the command
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
}