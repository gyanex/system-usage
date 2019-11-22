const os = require('os');
const util = require('os-utils');

exports.systemUsage = () => {
            return ([{"Free Memory (GB)": freeMemory().toFixed(2),
            "Total Memory (GB)": totalMemory().toFixed(2),
            "Used Memory (GB)": usedMemory().toFixed(2)
            }])    
}

freeMemory = () => {
    return os.freemem() / Math.pow(1024, 3)
}

totalMemory = () => {
    return os.totalmem() / Math.pow(1024, 3)
}

usedMemory = () => {
    let used = (os.totalmem() - os.freemem()) / Math.pow(1024, 3);
    return used
}


processOfnode = () => {
    return process.memoryUsage();
}

cpuUsage = () => {
  util.cpuUsage((result)=>{
    console.log(result)
   })
}