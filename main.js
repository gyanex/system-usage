const express = require('express');
const app = express();
const webSocket = require('ws');
const findProcess = require('find-process');
const pidusage = require('pidusage');
const path = require('path');
const { createServer } = require('http');
const server = createServer(app)
const su = require('./system-usage.js');
const wss = new webSocket.Server({ server });
const util = require('os-utils');
app.use(express.static(path.join(__dirname, '/public')));
app.get("/api/system", (req, res) => {
    res.json(su.systemUsage())
});

app.get('/api/cpu', (req, res) => {
    util.cpuUsage((result) => {
        res.json({ "CPU Usage: (%)": (result * 100).toFixed(2) })
    })
});

wss.on('connection', (ws, req) => {
    if (req.url === '/system') {
        setInterval(() => {
            util.cpuUsage((result) => {
                ws.send(JSON.stringify((su.systemUsage()).concat([{ "CPU Usage: (%)": (result * 100).toFixed(2) }])))
            })
        }, 5000);
    }
    else {
        setInterval(() => {
            findProcess('name', (req.url).slice(1), true).then((result) => {
                if (result.length != 0) {
                    pidusage(result[0].pid, (err, stats) => {
                        if (err) {
                            ws.send(err)
                        }
                        else {
                            ws.send(JSON.stringify([stats]));
                        }
                    })
                }
                else {
                    console.log('no such process is running')
                }
            }).catch((err) => {
                console.log(err)
            });
        }, 5000);
    }
});

server.listen(3000, () => {
    console.log('running on port 3000')
});

//var exec = require('child_process').exec;
// execute(){
//     exec('cmd.exe ipconfig', function(error, stdout, stderr){ callback(stdout); });
// };
//string = typeperf  "\\Process(mongod)\\% processor time" "\\Process(mongod)\\Private Bytes" "Process(mongod)\\Working Set" -si 10
// exec('typeperf  "\\Process(mongod)\\% Processor Time" "Process(mongod)\\Working Set" -sc 1', (err, stdout, stderr) => {
//     if (err) {
//       console.error(err);
//       return;
//     }
//     console.log(stdout);
//   });