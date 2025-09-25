const http = require('http');

const flowId = process.argv[2];

if (!flowId) {
  console.error('FlowId を提供してください。例: yarn runflow <flowId>');
  process.exit(1);
}

const postData = JSON.stringify({ 
  flowId,
  runType: 'cmd',
 });

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/v1/flow/execute-flow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const runFlow = (flowId) => {
  const req = http.request(options, (res) => {
    let data = '';

    // Lắng nghe các chunk dữ liệu
    res.on('data', (chunk) => {
      data += chunk;
    });

    // Khi nhận toàn bộ dữ liệu
    res.on('end', () => {
      if (res.statusCode === 200) {
        console.log(`Flow ${flowId} 正常に実行されました:`, JSON.parse(data));
      } else {
        console.error(`Flow ${flowId} 実行に失敗しました: ${data}`);
        process.exit(1);
      }
    });
  });

  // Xử lý lỗi nếu xảy ra
  req.on('error', (error) => {
    console.error(`Flow ${flowId}実行に失敗しました`, error.message);
    process.exit(1);
  });

  // Gửi dữ liệu POST
  req.write(postData);
  req.end();
};

runFlow(flowId);
