const fs = require('fs').promises;

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function updateJsonFile(outputJsonFile, convertFilePathToUrl) {
  try {
    // JSONファイルを開く
    const data = await fs.readFile(outputJsonFile, 'utf8');

    // JSONコンテンツをオブジェクトに変換する
    let jsonData;
    try {
      jsonData = JSON.parse(data);
    } catch (parseError) {
      console.error('JSON ファイルの解析中にエラーが発生しました:', parseError);
      return;
    }

    // ConvertFilePathToUrl 関数を使用して JSON 内の各要素を更新します。
    for (let index = 0; index < jsonData.length; index++) {
      const item = jsonData[index];
      item.output = convertFilePathToUrl(item.output);
    }

    // 更新されたJSONオブジェクトを文字列に変換します
    const updatedJsonData = JSON.stringify(jsonData, null, 4);

    // 更新されたコンテンツを JSON ファイルに記録する
    await fs.writeFile(outputJsonFile, updatedJsonData, 'utf8');
    console.log('JSONファイルが正常に更新されました');
  } catch (err) {
    console.error('エラーが発生しました:', err);
  }
}

function isNumeric(value) {
  return !isNaN(value) && value !== null && value !== '';
}

function stringToNumber(str) {
  if (!str) return 0
  const num = Number(str);
  return isNaN(num) ? 0 : num;
}

function convertFormula(obj) {
  const result = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const subObj = obj[key];
      const params = [];

      for (const subKey in subObj) {
        if (subObj.hasOwnProperty(subKey) && subObj[subKey] !== "") {
          params.push(Number(subObj[subKey]));
        }
      }

      if (params.length > 0) {
        result.push({ name: key, params: params });
      } else {
        result.push({ name: key });
      }
    }
  }

  return result;
}

export function formatOptionFilters(filters) {
  console.log('formatOptionFilters: ', filters)
  // フィルターに要素があるかどうかを確認する
  if (filters.length > 0) {
    // フィルター関数を使用して、値の配列の長さが 0 である項目を削除します。
    filters = filters.filter(item => item.value.length > 0);
  }

  for (let index = 0; index < filters.length; index++) {
    const filter = filters[index];
    console.log('filter: ', filter)
    if (!filter.hasOwnProperty('filterVariant')) {

      filter.filterVariant = 'text'
    } else if (filter.filterVariant === 'range') {
      filter.value = filter.value.map(val => {
        // if (val === null || val === "" || isNaN(val) || val === undefined) {
        if (val === null || val === "" || isNaN(Number(val)) || val === undefined) {
          return "";
        } else {
          return Number(val);
        }
      });
    }
  }

  return filters
}

export function formatOptions(options) {
  options.filters = formatOptionFilters(options.filters)

  if (options.hasOwnProperty('customDataRange')) {
    ['xAxis', 'yAxis'].forEach(axis => {
      if (isNumeric(options?.customDataRange?.[axis]?.minValue) && isNumeric(options?.customDataRange?.[axis]?.maxValue)) {
        options.customDataRange[axis].minValue = parseInt(options.customDataRange[axis].minValue);
        options.customDataRange[axis].maxValue = parseInt(options.customDataRange[axis].maxValue);
      } else {
        options.customDataRange[axis] = null;
      }
    });
  }

  if (options.hasOwnProperty('customLagLen')) {
    options.customLagLen = stringToNumber(options.customLagLen)
  }


  if (options.hasOwnProperty('formulaValues')) {
    options.formulaValues = convertFormula(options.formulaValues)
  }


  return options
}

// return curent timestamp in format 1716364998
export function getCurrentUnixTimestamp() {
  return Math.floor(Date.now() / 1000);
}