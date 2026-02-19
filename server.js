const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// CONFIGURATION
const SERIAL_PATH = "/dev/ttyUSB0"; // Change to your port (e.g., 'COM3' on Windows)
const BAUD_RATE = 115200;

const port = new SerialPort({
  path: SERIAL_PATH,
  baudRate: BAUD_RATE,
  autoOpen: false,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

port.open((err) => {
  if (err) return console.error("❌ Port Error: ", err.message);
  console.log(`✅ Serial Port Connected on ${SERIAL_PATH}`);
});

parser.on("data", (data) => {
  const parts = data.split(",");
  if (parts.length === 4) {
    io.emit("telemetry", {
      t: parts[0],
      h: parts[1],
      v: parts[2],
      touch: parts[3],
    });
  }
});

server.listen(6767, () =>
  console.log("🚀 Web Dashboard: http://localhost:6767"),
);
