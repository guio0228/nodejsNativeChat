import net from "net";
import readline from "readline/promises";
// 创建 readline 接口实例，用于读取命令行输入和输出
const rl = readline.createInterface({
  input: process.stdin, // 使用标准输入（键盘）作为输入源
  output: process.stdout, // 使用标准输出（控制台）作为输出目标
});
// 定义一个函数来清除命令行中的当前行
const clearLine = () => {
  // 返回一个新的 Promise
  return new Promise((resolve, reject) => {
    // 使用 process.stdout.clearLine 方法清除当前行
    // 0 作为参数表示清除从光标位置到行尾的内容
    process.stdout.clearLine(0, () => {
      // 当清除操作完成后，解决（resolve）这个 Promise
      resolve();
    });
  });
};
// 定义一个函数来移动命令行中的光标
const moveCursor = (x, y) => {
  // 返回一个新的 Promise
  return new Promise((resolve, reject) => {
    // 使用 process.stdout.moveCursor 方法移动光标
    // x 和 y 参数指定光标在水平和垂直方向上移动的距离
    process.stdout.moveCursor(x, y, () => {
      // 当移动操作完成后，解决（resolve）这个 Promise
      resolve();
    });
  });
};
let id;
// 创建一个到指定主机和端口的 TCP 连接
const socket = net.createConnection(
  { host: "127.0.0.1", port: 3008 },
  async () => {
    console.log("connect!!\n"); // 连接建立后打印消息

    // 定义一个异步函数用于提示用户输入并发送消息
    const ask = async () => {
      // 使用 readline 接口提示用户输入消息
      const message = await rl.question("Enter a message> ");
      await moveCursor(0, -1); // 移动光标到上一行
      await clearLine(); // 清除当前行
      socket.write(`${id}-->${message}`); // 将输入的消息发送到服务器
    };

    // 首次调用 ask 函数以开始交互
    ask();

    // 当接收到来自服务器的数据时触发
    socket.on("data", async (data) => {
      console.log(""); // 打印空行
      await moveCursor(0, -1); // 移动光标到上一行
      await clearLine(); // 清除当前行
      if (data.toString("utf-8").substring(0, 2) === "id") {
        id = data.toString("utf-8").substring(3);
        console.log(`your id is ${id}\n`);
      } else {
        console.log(data.toString("utf-8")); // 打印接收到的数据
      }

      ask(); // 再次调用 ask 函数以继续交互
    });
    //
    socket.on("error", (err) => {
      console.error("Socket error:", err);
    });
    //
  }
);

// 当服务器端关闭连接时触发
socket.on("error", () => {
  console.log("connect is over!!!!!!!!");
  socket.end();
  process.exit(0);
});
