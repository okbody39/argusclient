const easyvc = require('easyvc')();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
  process.exit();
});

const vcOrEsxiHost = '172.16.1.18';
const user = 'root';
const password = 'vdi@dm1n';

const vmName = 'HJY-VM001';
const guestUser = 'root';
const guestPwd = 'vdi@dm1n';

(async function() {
  let start = new Date();
  console.log("Start...", start);
  await easyvc.login(vcOrEsxiHost, user, password);
  console.log("Login time...", new Date() - start);
  start = new Date();
  // console.log(await easyvc.findVMsByName(/./));

  let vm = (await easyvc.findVMsByName(vmName))[0];
  if (!vm) {
    throw 'VM not found: ' + vmName;
  }
  console.log("VM search time...", new Date() - start);
  console.log('vm:', vm.mor.value);

  //------------------------------------------------------------------------
  //	list properties of VM. Refer to vSphere MOB browser for model details
  //------------------------------------------------------------------------
  //console.log('summary', await vm.get('summary'));
  //console.log('config', await vm.get('config'));
  //console.log('config', await vm.get('config.guestId'));

  let esxiHost = await vm.get('summary.runtime.host');
  let esxiAddr = await esxiHost.get('name');
  let vmIp = await vm.get('summary.guest.ipAddress');
  console.log(`The vm ${vmIp} is on ESXi ${esxiAddr}`);

  let guest = vm.guest(guestUser, guestPwd /*, {log: true}*/);


  console.log(await vm.getCdromInfo());

  //------------------------------------------------------------------------
  //	File operations
  //------------------------------------------------------------------------
  console.log('[test upload/download]');

  let fileMgr = guest.file();
  let text = 'Hello, mortal';
  let tempPath = await fileMgr.tempPath();
  let target = tempPath + '/test.txt';
  await fileMgr.uploadText(text, target);
  let downloaded = await fileMgr.downloadText(target);

  console.log(downloaded, text);

  // assert(downloaded === text)
  await fileMgr.delete(tempPath);

  //------------------------------------------------------------------------
  //	In-guest commands
  //------------------------------------------------------------------------
  console.log('[test run script]');
  //works on both windows/linux (with expected errors)
  let script =
    `
date
echo hello
`;
  let processMgr = guest.process();
  let result = await processMgr.runScript(script, 10000);
  console.log(result.toString());


  console.log('summary', await vm.get('summary'));
  console.log('config', await vm.get('config'));
  console.log('config.guestId', await vm.get('config.guestId'));

  await easyvc.logout();

  return 'DONE';

})().then(console.log).catch(e => console.error('ERROR: ' + e));
