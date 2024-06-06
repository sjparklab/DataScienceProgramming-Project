const { exec, execSync } = require('child_process');

const PORTS = [5173, 3001]; // 점유 해제할 포트 목록

// 포트를 점유하고 있는 프로세스를 종료하는 함수
function killPortProcess(port) {
  try {
    // 포트를 사용하는 프로세스의 PID를 찾습니다 (Linux/MacOS)
    const pid = execSync(`lsof -ti:${port}`).toString().trim();
    
    if (pid) {
      // PID로 프로세스를 강제로 종료합니다
      execSync(`kill -9 ${pid}`);
      console.log(`포트 ${port}에서 실행 중인 프로세스를 종료했습니다: PID ${pid}`);
    } else {
      console.log(`포트 ${port}를 점유하고 있는 프로세스가 없습니다.`);
    }
  } catch (error) {
    console.error(`포트 ${port}에서 실행 중인 프로세스를 찾는 도중 오류가 발생했습니다:`, error);
  }
}

// 지정된 모든 포트를 점유하고 있는 프로세스를 종료합니다
PORTS.forEach(killPortProcess);

// 개발 서버를 실행하는 함수
function startDevServer() {
  const dev = exec('npm run dev');

  dev.stdout.on('data', (data) => {
    console.log(data);
  });

  dev.stderr.on('data', (data) => {
    console.error(data);
  });

  dev.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  dev.on('error', (err) => {
    console.error('Failed to start child process:', err);
  });
}

// 개발 서버를 시작합니다
startDevServer();
