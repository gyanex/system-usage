const os = require('os');
const util = require('os-utils');
const si = require('systeminformation');

exports.systemUsage = () => {
    console.log(SystemHealth)
    SystemHealth.AvailableMemory=freeMemory().toFixed(2);
    SystemHealth.MemoryUsed=usedMemory().toFixed(2);
    SystemHealth.TotalMemory=totalMemory().toFixed(2)
    return(SystemHealth)
            // return ([{"Free Memory (GB)": freeMemory().toFixed(2),
            // "Total Memory (GB)": totalMemory().toFixed(2),
            // "Used Memory (GB)": usedMemory().toFixed(2)
            // }])    
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

exports.SystemHealthData=()=>{
    si.currentLoad().then(result => {
        SystemHealth.CPU=(result.currentload).toFixed(2)
        //console.log((result.currentload).toFixed(2) + ' %')
    }).then(() => {
        si.osInfo().then(result => {
            SystemHealth.ServerName=result.hostname;
            SystemHealth.OS=result.distro;
            // console.log(result.distro)
            // console.log(result.hostname)
        })
    }).then(() => {
        si.mem().then(result => {
            SystemHealth.TotalMemory=result.total/(Math.pow(1024,3));
            SystemHealth.MemoryUsed=result.used/(Math.pow(1024,3));
            SystemHealth.AvailableMemory=result.free/(Math.pow(1024,3));
            // console.log(result.total/(Math.pow(1024,3)))
            // console.log(result.used/(Math.pow(1024,3)))
            // console.log(result.free/(Math.pow(1024,3)))
        })
    }).then(()=>{
        si.networkInterfaces().then(result=>{
            SystemHealth.ServerIP=result[0].ip4;
            //console.log(result[0].ip4)
            //console.log(result[0].speed)
        })
    }).then(()=>{
        si.networkStats().then(result=>{
            //console.log(result)
        })
    }).then(()=>{
        si.networkConnections(result=>{
            //console.log(result)
        })
    }).then(()=>{
        console.log(SystemHealth)
        return (SystemHealth)
    })

}
let SystemHealth={
    ServerName:"",
    ServerIP:"",
    Status:"",
    OS:"",
    CPU:"",
    TotalMemory:"",
    MemoryUsed:"",
    AvailableMemory:"",
    TotalBandwidth:"",
    UsedBandwidth:""
}

exports.test = ()=>{
    si.currentLoad().then(result => {
        SystemHealth.CPU=(result.currentload).toFixed(2);
        
        si.osInfo().then(result => {
            SystemHealth.ServerName=result.hostname;
            SystemHealth.OS=result.distro;
            si.mem().then(result => {
                SystemHealth.TotalMemory=result.total/(Math.pow(1024,3));
                SystemHealth.MemoryUsed=result.used/(Math.pow(1024,3));
                SystemHealth.AvailableMemory=result.free/(Math.pow(1024,3));

                si.networkInterfaces().then(result=>{
                    SystemHealth.ServerIP=result[0].ip4;
                    si.networkStats().then(result=>{
                        //console.log(result)
                        si.networkConnections(result=>{
                            //console.log(result)
                            return(SystemHealth)
                        })
                    })

                })
            })
        })
    })
}