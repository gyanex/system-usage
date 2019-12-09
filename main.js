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
const si = require('systeminformation');

app.use(express.static(path.join(__dirname, '/public')));

app.get("/api/system", (req, res) => {
    si.currentLoad().then(result => {
        SystemHealth.CPU = (result.currentload).toFixed(2);

        si.osInfo().then(result => {
            SystemHealth.ServerName = result.hostname;
            SystemHealth.OS = result.distro;
            si.mem().then(result => {
                SystemHealth.TotalMemory = (result.total / (Math.pow(1024, 3))).toFixed(2);
                SystemHealth.MemoryUsed = (result.used / (Math.pow(1024, 3))).toFixed(2);
                SystemHealth.AvailableMemory = (result.free / (Math.pow(1024, 3))).toFixed(2);

                si.networkInterfaces().then(result => {
                    SystemHealth.ServerIP = result[0].ip4;
                    si.networkStats().then(result => {
                        //console.log(result)
                        si.networkConnections(result => {
                            //console.log(result)
                            console.log(SystemHealth)
                            res.send(SystemHealth)
                        })
                    })

                })
            })
        })
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
                console.log(result)
                if (result.length > 0) {
                    result.forEach(element => {
                        pidusage(element.pid, (err, stats) => {
                            if (err) {
                                ws.send(err)
                            }
                            else {
                                ws.send(JSON.stringify([stats]));
                            }
                        })
                    });
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

// si.networkInterfaces().then(result => {
//     // console.log(result[0].ip4)
//     //console.log(result)
// })

// setInterval(() => {
//     si.currentLoad().then((result => {
//         //console.log((result.currentload).toFixed(2) + ' %')
//     })).then(() => {
//         si.osInfo().then((result => {
//             // console.log(result.distro)
//             // console.log(result.hostname)
//         }))
//     }).then(() => {
//         si.mem().then((result => {
//             // console.log(result.total/(Math.pow(1024,3)))
//             // console.log(result.used/(Math.pow(1024,3)))
//             // console.log(result.free/(Math.pow(1024,3)))
//         }))
//     }).then(() => {
//         si.networkInterfaces().then(result => {
//             //console.log(result[0].ip4)
//             //console.log(result[0].speed)
//         })
//     }).then(() => {
//         si.networkStats().then(result => {
//             //console.log(result)
//         })
//     }).then(() => {
//         si.networkConnections(result => {
//             //console.log(result)
//         })
//     })
// }, 3000)

let SystemHealth = {
    ServerName: "",
    ServerIP: "",
    Status: "",
    OS: "",
    CPU: "",
    TotalMemory: "",
    MemoryUsed: "",
    AvailableMemory: "",
    TotalBandwidth: "",
    UsedBandwidth: ""
}

let processHealth={
    ServerName :"",
    ServerIP:"",
    OS:"",
    ProcessId:"",
    ProcessName:"",
    UpTime:"",
    Status:"",
    CPU:"",
    TotalMemory:"",
    MemoryUsed:"",
    AvailableMemory:"",
    TotalBandwidth:"",
    UsedBandwidth:""
}
// setInterval(()=>{
//     si.networkStats().then(result=>{
//         console.log(result)
//         console.log('Received '+(result[0].rx_sec))
//         console.log('Sent ' +(result[0].tx_sec)/1024)
//     })
// },1500)

// si.inetLatency((result)=>{
//     console.log(result)
// })

//si.getStaticData((result)=>{console.log(result)})
app.get('/api/process/:processName', (req, res)=>{
    findProcess('name', (req.params.processName), true).then((result)=>{
        if(result.length>0){
            let temp=[];
            result.forEach(element => {
                pidusage(element.pid, (err, stats) => {
                    if (err) {
                        res.send(err)
                    }
                    else {
                        console.log(stats)
                        res.send(JSON.stringify([stats]));
                    }
                })
            });
            
        }
        
        else{
            res.send('no such process is running')
        }
    })
})