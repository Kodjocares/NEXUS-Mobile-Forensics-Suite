// Offline tool data — mirrors backend registry
export const CATEGORIES = {
  forensics:  { label: 'Mobile Forensics',    icon: '🔬', color: '#00ff9d' },
  ids:        { label: 'Intrusion Detection', icon: '🛡️', color: '#ff6b35' },
  cloning:    { label: 'Cloning & Imaging',   icon: '💾', color: '#a78bfa' },
  monitoring: { label: 'Device Monitoring',   icon: '📡', color: '#38bdf8' },
};

export const TOOLS = [
  // FORENSICS
  { id:'adb',              name:'ADB',              category:'forensics', platform:'android', description:'Android Debug Bridge — shell access, data extraction, APK management, logcat', command:'adb {action}', risk:'medium', rootRequired:false },
  { id:'andriller',        name:'Andriller',        category:'forensics', platform:'android', description:'Extract SMS, contacts, call logs, app data without root', command:'andriller -d {device} -o {output}', risk:'low', rootRequired:false },
  { id:'aleapp',           name:'ALEAPP',           category:'forensics', platform:'android', description:'Android artifact and event log parser', command:'python3 aleapp.py -t zip -i {input} -o {output}', risk:'low', rootRequired:false },
  { id:'ileapp',           name:'iLEAPP',           category:'forensics', platform:'ios',     description:'iOS Logs, Events & Plists Parser', command:'python3 ileapp.py -t zip -i {input} -o {output}', risk:'low', rootRequired:false },
  { id:'frida',            name:'Frida',            category:'forensics', platform:'both',    description:'Dynamic instrumentation — runtime hooks, function tracing', command:'frida -U -f {package} --no-pause -l {script}', risk:'high', rootRequired:true },
  { id:'objection',        name:'objection',        category:'forensics', platform:'both',    description:'Runtime mobile exploration — SSL pinning bypass, root detection bypass', command:'objection -g {package} explore', risk:'high', rootRequired:true },
  { id:'mobsf',            name:'MobSF',            category:'forensics', platform:'both',    description:'Mobile Security Framework — static + dynamic analysis', command:'docker run -it --rm -p 8000:8000 opensecurity/mobile-security-framework-mobsf', risk:'low', rootRequired:false },
  { id:'autopsy',          name:'Autopsy',          category:'forensics', platform:'both',    description:'GUI digital forensics platform — file carving, artifact extraction', command:'autopsy --nogui --dataSourcePath={image}', risk:'low', rootRequired:false },
  { id:'qark',             name:'QARK',             category:'forensics', platform:'android', description:'Quick Android Review Kit — static vulnerability analysis', command:'python3 qark.py --apk {apk} --report-type html', risk:'low', rootRequired:false },
  { id:'libimobiledevice', name:'libimobiledevice', category:'forensics', platform:'ios',     description:'CLI tools for iOS device communication and backup', command:'idevicebackup2 backup --full {output}', risk:'low', rootRequired:false },
  // IDS
  { id:'suricata',  name:'Suricata',  category:'ids', platform:'both',    description:'Multi-threaded IDS/IPS with Lua scripting', command:'suricata -c /etc/suricata/suricata.yaml -i {interface}', risk:'low', rootRequired:true },
  { id:'snort',     name:'Snort',     category:'ids', platform:'both',    description:'Classic rule-based network intrusion detection', command:'snort -A console -q -c /etc/snort/snort.conf -i {interface}', risk:'low', rootRequired:true },
  { id:'zeek',      name:'Zeek',      category:'ids', platform:'both',    description:'Network analysis framework — behavioral detection', command:'zeek -i {interface} local', risk:'low', rootRequired:true },
  { id:'wazuh',     name:'Wazuh',     category:'ids', platform:'both',    description:'Open-source SIEM + HIDS — log analysis, alerting', command:'sudo systemctl start wazuh-manager', risk:'low', rootRequired:true },
  { id:'drozer',    name:'Drozer',    category:'ids', platform:'android', description:'Android attack surface analysis framework', command:'drozer console connect --server {target_ip}', risk:'high', rootRequired:false },
  { id:'needle',    name:'Needle',    category:'ids', platform:'ios',     description:'iOS security testing framework', command:'python needle.py -t {target_ip} -p {port}', risk:'high', rootRequired:true },
  { id:'sniffnet',  name:'Sniffnet', category:'ids', platform:'both',    description:'Lightweight real-time network traffic monitoring', command:'sniffnet --interface {interface}', risk:'low', rootRequired:false },
  // CLONING
  { id:'dcfldd',          name:'dcfldd',          category:'cloning', platform:'both',    description:'Forensic disk cloning with hashing and logging', command:'dcfldd if={input} of={output} hash=md5,sha256 bs=512', risk:'medium', rootRequired:true },
  { id:'ftk_imager',      name:'FTK Imager',      category:'cloning', platform:'both',    description:'Forensic image creation — E01/AFF with metadata', command:'ftkimager {source} {output} --e01 --compress 6', risk:'medium', rootRequired:true },
  { id:'guymager',        name:'Guymager',        category:'cloning', platform:'both',    description:'GUI forensic disk imager — E01 and AFF format', command:'guymager --auto {device}', risk:'medium', rootRequired:true },
  { id:'dc3dd',           name:'dc3dd',           category:'cloning', platform:'both',    description:'DoD-enhanced dd with hashing and progress logging', command:'dc3dd if={input} of={output} hash=sha256 log={logfile}', risk:'medium', rootRequired:true },
  { id:'adb_backup',      name:'ADB Backup',      category:'cloning', platform:'android', description:'Full Android app data and system backup', command:'adb backup -apk -shared -all -f {output}.ab', risk:'low', rootRequired:false },
  { id:'idevicebackup2',  name:'idevicebackup2',  category:'cloning', platform:'ios',     description:'Full encrypted iOS device backup via USB', command:'idevicebackup2 backup --full {output}', risk:'low', rootRequired:false },
  { id:'clonezilla',      name:'Clonezilla',      category:'cloning', platform:'both',    description:'Partition and disk cloning — bare metal backup', command:'clonezilla -d {source} -t {destination} --batch', risk:'medium', rootRequired:true },
  // MONITORING
  { id:'wireshark',     name:'Wireshark',     category:'monitoring', platform:'both',    description:'Deep packet capture and protocol analysis', command:'tshark -i {interface} -f \'{filter}\' -w {output}.pcap', risk:'medium', rootRequired:true },
  { id:'bettercap',     name:'Bettercap',     category:'monitoring', platform:'both',    description:'WiFi, BLE, ARP, HID attack and monitoring framework', command:'sudo bettercap -iface {interface} -eval \'net.probe on; net.sniff on\'', risk:'high', rootRequired:true },
  { id:'mitmproxy',     name:'mitmproxy',     category:'monitoring', platform:'both',    description:'Interactive HTTPS proxy — intercept and modify traffic', command:'mitmproxy --mode transparent -p 8080', risk:'medium', rootRequired:false },
  { id:'burpsuite',     name:'Burp Suite',    category:'monitoring', platform:'both',    description:'Web and mobile API proxy — scanner, intruder, repeater', command:'java -jar burpsuite_community.jar --config-file=mobile.json', risk:'medium', rootRequired:false },
  { id:'aircrack',      name:'Aircrack-ng',   category:'monitoring', platform:'both',    description:'Complete WiFi security auditing — monitor, inject, crack', command:'airmon-ng start {interface} && airodump-ng {interface}mon', risk:'high', rootRequired:true },
  { id:'kismet',        name:'Kismet',        category:'monitoring', platform:'both',    description:'Wireless network detector and IDS — passive discovery', command:'kismet -c {interface} --log-prefix={logdir}', risk:'medium', rootRequired:true },
  { id:'osquery',       name:'OSQuery',       category:'monitoring', platform:'both',    description:'SQL-based endpoint telemetry and device state queries', command:'osqueryi \'SELECT * FROM {table} WHERE {condition};\'', risk:'low', rootRequired:false },
  { id:'velociraptor',  name:'Velociraptor',  category:'monitoring', platform:'both',    description:'Endpoint monitoring and digital forensics at scale', command:'velociraptor --config {config} frontend -v', risk:'low', rootRequired:true },
  { id:'charles',       name:'Charles Proxy', category:'monitoring', platform:'both',    description:'HTTP/HTTPS proxy for mobile traffic interception', command:'# GUI — configure device proxy to {host}:8888', risk:'low', rootRequired:false },
];

export const PRESETS = [
  { id:'android_pentest',  label:'Android App Pentest',  tools:['adb','mobsf','frida','objection','burpsuite','drozer','qark'], description:'Full Android application security assessment' },
  { id:'ios_pentest',      label:'iOS App Pentest',      tools:['frida','objection','mobsf','needle','mitmproxy','ileapp','libimobiledevice'], description:'Full iOS application security assessment' },
  { id:'network_monitor',  label:'Network Monitoring',   tools:['suricata','zeek','wireshark','bettercap','kismet','sniffnet'], description:'Passive and active network traffic analysis' },
  { id:'full_dfir',        label:'Full DFIR Lab',        tools:['wazuh','velociraptor','autopsy','osquery','dc3dd','guymager'], description:'Digital forensics and incident response' },
  { id:'rf_hardware',      label:'RF / Wireless',        tools:['bettercap','aircrack','kismet','wireshark'], description:'Wireless and RF security testing' },
  { id:'android_forensics',label:'Android Forensics',   tools:['adb','andriller','aleapp','autopsy','adb_backup','frida'], description:'Complete Android device forensic extraction' },
  { id:'ios_forensics',    label:'iOS Forensics',        tools:['libimobiledevice','ileapp','idevicebackup2','autopsy','frida'], description:'Complete iOS device forensic extraction' },
];

export const RISK_COLOR = { low:'#00ff9d', medium:'#f59e0b', high:'#ff6b35' };
export const PLATFORM_COLOR = { android:'#3ddc84', ios:'#007aff', both:'#f59e0b' };
