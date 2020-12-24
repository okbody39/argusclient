"use strict";

function get(gb, params) {
    let retValue = "";

    switch(gb) {
        case "session-kill":
            retValue = `<?xml version="1.0"?>
                <broker version="1.0">
                  <kill-session>
                    <session-id>${params}</session-id>
                  </kill-session>
                </broker>`;
            break;

        case "vm-reset":
            retValue = `<?xml version="1.0"?>
                <broker version="2.0">
                    <reset-desktop>
                    <desktop-id>${params}</desktop-id>
                    </reset-desktop>
                </broker>`;
            break;

        case "logout":
            retValue = `<?xml version='1.0' encoding='UTF-8'?><broker version='15.0'><do-logout/></broker>`;
            break;

        case "login-config":
            retValue = `<?xml version="1.0"?><broker version="1.0"><get-configuration/></broker>`;
            break;

        case "login":
            retValue = `<?xml version="1.0" encoding="UTF-8"?>
                    <broker version="15.0">
                    <do-submit-authentication>
                        <screen>
                        <name>windows-password</name>
                        <params>
                            <param>
                            <name>username</name>
                            <values>
                                <value>${params.username}</value>
                            </values>
                            </param>
                            <param>
                            <name>domain</name>
                            <values>
                                <value>${params.domain}</value>
                            </values>
                            </param>
                            <param>
                            <name>password</name>
                            <values>
                                <value>${params.password}</value>
                            </values>
                            </param>
                        </params>
                        </screen>
                        <environment-information>
                            <info name="Type">Windows</info>
                            <info name="MAC_Address">${params.mac}</info>
                            <info name="Device_UUID">${params.mac}</info>
                        </environment-information>
                    </do-submit-authentication>
                    </broker>`;

            break;

        case "login-cp":
            retValue = `<?xml version="1.0" encoding="UTF-8"?>
                    <broker version="15.0">
                    <do-submit-authentication>
                        <screen>
                        <name>securid-passcode</name>
                        <params>
                            <param>
                            <name>username</name>
                            <values>
                                <value>${params.username}</value>
                            </values>
                            </param>
                            <param>
                            <name>passcode</name>
                            <values>
                                <value>${params.passcode}</value>
                            </values>
                            </param>
                        </params>
                        </screen>
                        <environment-information>
                            <info name="Type">Windows</info>
                            <info name="MAC_Address">${params.mac}</info>
                            <info name="Device_UUID">${params.mac}</info>
                        </environment-information>
                    </do-submit-authentication>
                    </broker>`;

            break;

        case "login-cp2":
            retValue = `<?xml version="1.0" encoding="UTF-8"?>
                        <broker version="15.0">
                          <do-submit-authentication>
                            <screen>
                              <name>windows-password</name>
                              <params>
                                <param>
                                  <name>username</name>
                                  <values>
                                    <value>${params.username}</value>
                                  </values>
                                </param>
                                <param>
                                  <name>domain</name>
                                  <values>
                                    <value>${params.Domain}</value>
                                  </values>
                                </param>
                                <param>
                                  <name>password</name>
                                  <values>
                                    <value>${params.password}</value>
                                  </values>
                                </param>
                              </params>
                            </screen>
                            <environment-information>
                              <info name="Type">Windows</info>
                              <info name="MAC_Address">${params.mac}</info>
                              <info name="Device_UUID">${params.mac}</info>
                            </environment-information>
                          </do-submit-authentication>
                        </broker>`;

            break;

        case "login-pc":
            retValue = `<?xml version="1.0" encoding="UTF-8"?>
                    <broker version="15.0">
                    <do-submit-authentication>
                        <screen>
                        <name>securid-passcode</name>
                        <params>
                            <param>
                            <name>username</name>
                            <values>
                                <value>${arg.username}</value>
                            </values>
                            </param>
                            <param>
                            <name>passcode</name>
                            <values>
                                <value>${arg.password}</value>
                            </values>
                            </param>
                        </params>
                        </screen>
                        <environment-information>
                            <info name="Type">Windows</info>
                            <info name="MAC_Address">${__OS__.nics[0].mac}</info>
                            <info name="Device_UUID">${__OS__.nics[0].mac}</info>
                        </environment-information>
                    </do-submit-authentication>
                    </broker>`;

            break;

        case "login-pc2":
            retValue = `<?xml version="1.0" encoding="UTF-8"?>
                        <broker version="15.0">
                          <do-submit-authentication>
                            <screen>
                              <name>securid-nexttokencode</name>
                              <params>
                                <param>
                                  <name>tokencode</name>
                                  <values>
                                    <value>${arg.passcode}</value>
                                  </values>
                                </param>
                              </params>
                            </screen>
                            <environment-information>
                              <info name="Type">Windows</info>
                              <info name="MAC_Address">${__OS__.nics[0].mac}</info>
                              <info name="Device_UUID">${__OS__.nics[0].mac}</info>
                            </environment-information>
                          </do-submit-authentication>
                        </broker>`;

            break;

        case "vm-list":
            retValue = `<?xml version="1.0" encoding="UTF-8"?>
                <broker version="15.0">
                  <get-tunnel-connection>
                    <certificate-thumbprint-algorithms>
                      <algorithm>SHA-1</algorithm>
                      <algorithm>SHA-256</algorithm>
                    </certificate-thumbprint-algorithms>
                  </get-tunnel-connection>
                  <get-user-global-preferences/>
                  <get-launch-items>
                    <desktops>
                      <supported-protocols>
                        <protocol>
                          <name>PCOIP</name>
                        </protocol>
                        <protocol>
                          <name>RDP</name>
                        </protocol>
                        <protocol>
                          <name>BLAST</name>
                        </protocol>
                      </supported-protocols>
                    </desktops>
                    <applications>
                      <supported-types>
                        <type>
                          <name>remote</name>
                          <supported-protocols>
                            <protocol>
                              <name>PCOIP</name>
                            </protocol>
                            <protocol>
                              <name>BLAST</name>
                            </protocol>
                          </supported-protocols>
                        </type>
                      </supported-types>
                    </applications>
                    <application-sessions/>
                    <shadow-sessions>
                      <supported-protocols>
                        <protocol>
                          <name>BLAST</name>
                        </protocol>
                      </supported-protocols>
                    </shadow-sessions>
                    <environment-information>
                      <info name="IP_Address">${params.address}</info>
                      <info name="MAC_Address">${params.mac}</info>
                      <info name="Device_UUID">${params.mac}</info>
                      <info name="Machine_Domain">WORKGROUP</info>
                      <info name="Machine_Name">DESKTOP-TEST</info>
                      <info name="Client_ID"></info>
                      <info name="Type">Windows</info>
                      <info name="Machine_FQDN"></info>
                      <info name="Client_Version">8.0.0-16531419</info>
                    </environment-information>
                  </get-launch-items>
                </broker>`;
            break;

    }

    return retValue;
}

module.exports = {
    get
};
