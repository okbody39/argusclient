const { ipcRenderer, screen } = require('electron');
const path = require('path');
const url = require('url');

// Add the listener
document.addEventListener('DOMContentLoaded', function () {
  document.querySelector('#btn_home').addEventListener('click', function (event) {
    let height = document.querySelector('#container').clientHeight - 46;
    document.querySelector('#contents').innerHTML = '<object type="text/html" style="width: 100%; height: ' + height + 'px;" data="update.html"></object>';

  });
});
