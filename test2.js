const easyvc = require('easyvc')();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at:', p, 'reason:', reason);
    process.exit();
});

const vcOrEsxiHost = '172.16.1.159';
const user = 'vdiadmin@seed02.dfocus.net';
const password = 'Dfocus@dm1n';

// const vcOrEsxiHost = '172.16.1.11';
// const user = 'root';
// const password = 'vdi@dm1n';

const vmName = /.*/; //"ManualD-mhkim"; ///.*/;
const guestUser = '';
const guestPwd = '';

(async function() {
    await easyvc.login(vcOrEsxiHost, user, password);
    console.log('logged in')

    let vms = await easyvc.findVMsByName(vmName);
    if (vms.length === 0)
        throw 'VM not found: ' + vmName
    let vm = vms[0]
    let uuid = null;

    vms.map((vm) = async(vm) => {
       let vv = await vm.get('config');
       let vconf = vv.extraConfig;

        vconf.map((v) => {
            // {
            //       key: 'guestinfo.vmware.view.vdmagent.activebroker',
            //       value: 'vcs80.seed02.dfocus.net vcs80.seed02.dfocus.net/172.17.1.52'
            //     }

           if(v.key==="machine.id") {
               let val = v.value;
               let vcs = "";
               let id = "";

               val.split(";").map((i) => {
                   // console.log(i);
                   if(i.indexOf("vdi.broker.poolDn") !== -1) {
                       // id = i;
                       id = i.split("=")[2];
                       id = id.substr(0, id.indexOf(","));
                   }
                   if(i.indexOf("vdi.broker.brokers") !== -1) {
                       vcs = i.split("=")[1];
                   }
               });
               // console.log(vv);

               console.log(id, vcs, vv.name);



               // if(v.value.indexOf("cn=manuald") !== -1) {
               //     // delete vv.hardware.device;
               //     // console.log(vv); //, vv.uuid, vv.name, vv.version, vv.guestFullName, vv.hardware);
               //     uuid = vv.uuid;
               // }
           }
       });
    });

    vms.map((vm) = async(vm) => {
        let vv = await vm.get('summary');

        if(vv.config.uuid === uuid) {
            console.log(vv.vm, vv.runtime, vv.quickStats, vv.config, vv.overallStatus);
        }

    });

//     let guest = await vm.guest(guestUser, guestPwd, {log: false})
//     let fileMgr = guest.file()
//     let processMgr = guest.process()
//
// //------------------------------------
//     console.log('[test upload/download]')
//     let text = 'Hello, mortal'
//     let tempPath = fileMgr.tempPath()
//     let target = tempPath + '/test.txt'
//     await fileMgr.uploadText(text, target)
//
//     let downloaded = await fileMgr.downloadText(target)
//     if (downloaded !== text)
//         console.error('Failed: upload/download mismatch')
//     await fileMgr.delete(tempPath)
//
// //------------------------------------
//     console.log('[test run script]')
// //works on both windows/linux (with expected errors)
//     let script = 'date /t\r\necho hello'
//     let result = await processMgr.runScript(script, 10000)
//     console.log(result.toString())
//
// //------------------------------------
// //list properties of VM. Refer to vSphere MOB browser for model details
//     console.log('summary', await vm.get('summary'))
//     console.log('config', await vm.get('config'))
//     console.log('config.guestId', await vm.get('config.guestId'))
//
//     return 'DONE'
})(vmName, guestUser, guestPwd).catch(e => console.error('ERROR: ' + e));

// test();
