"""
NEXUS Tool Registry — Complete database of all forensic, IDS, cloning and monitoring tools
"""

from typing import List, Optional
from pydantic import BaseModel

class Tool(BaseModel):
    id: str
    name: str
    category: str
    platform: str          # android | ios | both
    description: str
    command_template: str
    install_cmd: str
    check_cmd: str
    docs_url: str
    tags: List[str]
    risk_level: str        # low | medium | high
    requires_root: bool

TOOL_REGISTRY: List[Tool] = [

    # ─── MOBILE FORENSICS ──────────────────────────────────────────────
    Tool(id="adb", name="ADB", category="forensics", platform="android",
         description="Android Debug Bridge — shell access, data extraction, APK management, logcat",
         command_template="adb {action}",
         install_cmd="sudo apt install adb",
         check_cmd="adb version",
         docs_url="https://developer.android.com/studio/command-line/adb",
         tags=["forensics","extraction","android","shell"],
         risk_level="medium", requires_root=False),

    Tool(id="andriller", name="Andriller", category="forensics", platform="android",
         description="Extract SMS, contacts, call logs, app data from Android without root",
         command_template="andriller -d {device} -o {output_dir}",
         install_cmd="pip install andriller",
         check_cmd="andriller --version",
         docs_url="https://andriller.com",
         tags=["forensics","extraction","android","artifacts"],
         risk_level="low", requires_root=False),

    Tool(id="aleapp", name="ALEAPP", category="forensics", platform="android",
         description="Android Logs, Events & Plists Parser — artifact extraction and analysis",
         command_template="python3 aleapp.py -t {input_type} -i {input} -o {output}",
         install_cmd="pip install aleapp",
         check_cmd="python3 aleapp.py --version",
         docs_url="https://github.com/abrignoni/ALEAPP",
         tags=["forensics","artifacts","android","parser"],
         risk_level="low", requires_root=False),

    Tool(id="ileapp", name="iLEAPP", category="forensics", platform="ios",
         description="iOS Logs, Events & Plists Parser — comprehensive iOS artifact extraction",
         command_template="python3 ileapp.py -t {input_type} -i {input} -o {output}",
         install_cmd="pip install ileapp",
         check_cmd="python3 ileapp.py --version",
         docs_url="https://github.com/abrignoni/iLEAPP",
         tags=["forensics","artifacts","ios","parser"],
         risk_level="low", requires_root=False),

    Tool(id="frida", name="Frida", category="forensics", platform="both",
         description="Dynamic instrumentation toolkit — runtime hooks, function tracing, API monitoring",
         command_template="frida -U -f {package} --no-pause -l {script}",
         install_cmd="pip install frida-tools",
         check_cmd="frida --version",
         docs_url="https://frida.re/docs/",
         tags=["dynamic","hooking","runtime","both"],
         risk_level="high", requires_root=True),

    Tool(id="objection", name="objection", category="forensics", platform="both",
         description="Runtime mobile exploration powered by Frida — SSL pinning bypass, root detection bypass",
         command_template="objection -g {package} explore",
         install_cmd="pip install objection",
         check_cmd="objection version",
         docs_url="https://github.com/sensepost/objection",
         tags=["runtime","hooking","ssl-pinning","both"],
         risk_level="high", requires_root=True),

    Tool(id="mobsf", name="MobSF", category="forensics", platform="both",
         description="Mobile Security Framework — static and dynamic analysis of APKs and IPAs",
         command_template="docker run -it --rm -p 8000:8000 opensecurity/mobile-security-framework-mobsf",
         install_cmd="docker pull opensecurity/mobile-security-framework-mobsf",
         check_cmd="docker images | grep mobsf",
         docs_url="https://mobsf.github.io/Mobile-Security-Framework-MobSF/",
         tags=["static","dynamic","apk","ipa","analysis"],
         risk_level="low", requires_root=False),

    Tool(id="autopsy", name="Autopsy", category="forensics", platform="both",
         description="GUI digital forensics platform — analyzes mobile images, file carving, artifact extraction",
         command_template="autopsy --nogui --dataSourcePath={image}",
         install_cmd="sudo apt install autopsy",
         check_cmd="autopsy --version",
         docs_url="https://www.autopsy.com/",
         tags=["forensics","imaging","gui","artifacts"],
         risk_level="low", requires_root=False),

    Tool(id="qark", name="QARK", category="forensics", platform="android",
         description="Quick Android Review Kit — static vulnerability analysis for Android APKs",
         command_template="python3 qark.py --apk {apk} --report-type html",
         install_cmd="pip install qark",
         check_cmd="python3 qark.py --version",
         docs_url="https://github.com/linkedin/qark",
         tags=["static","apk","vulnerabilities","android"],
         risk_level="low", requires_root=False),

    Tool(id="libimobiledevice", name="libimobiledevice", category="forensics", platform="ios",
         description="CLI tools for iOS device communication — backup, restore, filesystem access",
         command_template="idevicebackup2 backup --full {output}",
         install_cmd="sudo apt install libimobiledevice-utils",
         check_cmd="idevice_id --version",
         docs_url="https://libimobiledevice.org/",
         tags=["ios","backup","extraction","cli"],
         risk_level="low", requires_root=False),

    # ─── INTRUSION DETECTION ──────────────────────────────────────────
    Tool(id="suricata", name="Suricata", category="ids", platform="both",
         description="Multi-threaded IDS/IPS/NSM engine with Lua scripting support",
         command_template="suricata -c /etc/suricata/suricata.yaml -i {interface}",
         install_cmd="sudo apt install suricata",
         check_cmd="suricata --version",
         docs_url="https://suricata.io/documentation/",
         tags=["ids","ips","network","rules"],
         risk_level="low", requires_root=True),

    Tool(id="snort", name="Snort", category="ids", platform="both",
         description="Classic rule-based network intrusion detection system",
         command_template="snort -A console -q -c /etc/snort/snort.conf -i {interface}",
         install_cmd="sudo apt install snort",
         check_cmd="snort --version",
         docs_url="https://www.snort.org/documents",
         tags=["ids","nids","rules","network"],
         risk_level="low", requires_root=True),

    Tool(id="zeek", name="Zeek", category="ids", platform="both",
         description="Network analysis framework with behavioral detection and scripting",
         command_template="zeek -i {interface} local",
         install_cmd="sudo apt install zeek",
         check_cmd="zeek --version",
         docs_url="https://docs.zeek.org/",
         tags=["network","behavioral","analysis","logging"],
         risk_level="low", requires_root=True),

    Tool(id="wazuh", name="Wazuh", category="ids", platform="both",
         description="Open-source SIEM + HIDS — log analysis, alerting, threat detection",
         command_template="sudo systemctl start wazuh-manager",
         install_cmd="curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | apt-key add -",
         check_cmd="wazuh-control status",
         docs_url="https://documentation.wazuh.com/",
         tags=["siem","hids","log-analysis","alerting"],
         risk_level="low", requires_root=True),

    Tool(id="drozer", name="Drozer", category="ids", platform="android",
         description="Android security testing framework — attack surface analysis, component testing",
         command_template="drozer console connect --server {target_ip}",
         install_cmd="pip install drozer",
         check_cmd="drozer --version",
         docs_url="https://github.com/WithSecureLabs/drozer",
         tags=["android","attack-surface","components","testing"],
         risk_level="high", requires_root=False),

    Tool(id="needle", name="Needle", category="ids", platform="ios",
         description="iOS security testing framework — binary analysis, data storage testing",
         command_template="python needle.py -t {target_ip} -p {port}",
         install_cmd="pip install needle",
         check_cmd="python needle.py --version",
         docs_url="https://github.com/WithSecureLabs/needle",
         tags=["ios","security","testing","binary"],
         risk_level="high", requires_root=True),

    Tool(id="sniffnet", name="Sniffnet", category="ids", platform="both",
         description="Lightweight real-time network traffic monitoring and alerts",
         command_template="sniffnet --interface {interface} --output {report}",
         install_cmd="cargo install sniffnet",
         check_cmd="sniffnet --version",
         docs_url="https://github.com/GyulyVGC/sniffnet",
         tags=["monitoring","network","realtime","lightweight"],
         risk_level="low", requires_root=False),

    # ─── CLONING & IMAGING ────────────────────────────────────────────
    Tool(id="dcfldd", name="dcfldd", category="cloning", platform="both",
         description="DoD Computer Forensics Lab dd — forensic disk cloning with hashing and logging",
         command_template="dcfldd if={input} of={output} hash=md5,sha256 bs=512 conv=noerror,sync",
         install_cmd="sudo apt install dcfldd",
         check_cmd="dcfldd --version",
         docs_url="https://github.com/adulau/dcfldd",
         tags=["imaging","hashing","forensic","disk"],
         risk_level="medium", requires_root=True),

    Tool(id="ftk_imager", name="FTK Imager", category="cloning", platform="both",
         description="Forensic image creation tool — E01/AFF format with metadata preservation",
         command_template="ftkimager {source} {output} --e01 --compress 6",
         install_cmd="# Download from https://www.exterro.com/ftk-imager",
         check_cmd="ftkimager --version",
         docs_url="https://www.exterro.com/ftk-imager",
         tags=["imaging","e01","forensic","metadata"],
         risk_level="medium", requires_root=True),

    Tool(id="guymager", name="Guymager", category="cloning", platform="both",
         description="GUI forensic disk imager supporting E01 and AFF format output",
         command_template="guymager --auto {device}",
         install_cmd="sudo apt install guymager",
         check_cmd="guymager --version",
         docs_url="https://guymager.sourceforge.io/",
         tags=["imaging","gui","e01","aff"],
         risk_level="medium", requires_root=True),

    Tool(id="dc3dd", name="dc3dd", category="cloning", platform="both",
         description="US DoD-enhanced dd — bit-for-bit copy with hashing, logging and progress",
         command_template="dc3dd if={input} of={output} hash=sha256 log={logfile}",
         install_cmd="sudo apt install dc3dd",
         check_cmd="dc3dd --version",
         docs_url="https://sourceforge.net/projects/dc3dd/",
         tags=["imaging","hashing","forensic","dod"],
         risk_level="medium", requires_root=True),

    Tool(id="adb_backup", name="ADB Backup", category="cloning", platform="android",
         description="Full Android app data and system backup via ADB",
         command_template="adb backup -apk -shared -all -f {output}.ab",
         install_cmd="sudo apt install adb",
         check_cmd="adb version",
         docs_url="https://developer.android.com/studio/command-line/adb#backup",
         tags=["backup","android","apps","data"],
         risk_level="low", requires_root=False),

    Tool(id="idevicebackup2", name="idevicebackup2", category="cloning", platform="ios",
         description="Full encrypted iOS device backup via USB",
         command_template="idevicebackup2 backup --full {output_dir}",
         install_cmd="sudo apt install libimobiledevice-utils",
         check_cmd="idevicebackup2 --version",
         docs_url="https://libimobiledevice.org/",
         tags=["backup","ios","encrypted","usb"],
         risk_level="low", requires_root=False),

    Tool(id="clonezilla", name="Clonezilla", category="cloning", platform="both",
         description="Partition and disk cloning tool — bare metal backup and restore",
         command_template="clonezilla -d {source} -t {destination} --batch",
         install_cmd="sudo apt install clonezilla",
         check_cmd="clonezilla --version",
         docs_url="https://clonezilla.org/",
         tags=["disk","partition","bare-metal","backup"],
         risk_level="medium", requires_root=True),

    # ─── DEVICE MONITORING ────────────────────────────────────────────
    Tool(id="wireshark", name="Wireshark", category="monitoring", platform="both",
         description="Deep packet capture and protocol analysis — GUI and CLI (tshark)",
         command_template="tshark -i {interface} -f '{filter}' -w {output}.pcap",
         install_cmd="sudo apt install wireshark tshark",
         check_cmd="wireshark --version",
         docs_url="https://www.wireshark.org/docs/",
         tags=["packets","capture","protocol","analysis"],
         risk_level="medium", requires_root=True),

    Tool(id="bettercap", name="Bettercap", category="monitoring", platform="both",
         description="Swiss army knife for WiFi, BLE, ARP, HID and network attacks",
         command_template="sudo bettercap -iface {interface} -eval 'net.probe on; net.sniff on'",
         install_cmd="sudo apt install bettercap",
         check_cmd="bettercap --version",
         docs_url="https://www.bettercap.org/docs/",
         tags=["wifi","ble","arp","mitm","network"],
         risk_level="high", requires_root=True),

    Tool(id="mitmproxy", name="mitmproxy", category="monitoring", platform="both",
         description="Interactive HTTPS proxy — intercept, inspect, modify mobile traffic",
         command_template="mitmproxy --mode transparent --listen-host 0.0.0.0 -p 8080",
         install_cmd="pip install mitmproxy",
         check_cmd="mitmproxy --version",
         docs_url="https://docs.mitmproxy.org/",
         tags=["proxy","https","intercept","ssl"],
         risk_level="medium", requires_root=False),

    Tool(id="burpsuite", name="Burp Suite", category="monitoring", platform="both",
         description="Web and mobile API security testing proxy — scanner, intruder, repeater",
         command_template="java -jar burpsuite_community.jar --config-file=mobile.json",
         install_cmd="# Download from https://portswigger.net/burp/communitydownload",
         check_cmd="java -jar burpsuite_community.jar --version",
         docs_url="https://portswigger.net/burp/documentation",
         tags=["proxy","api","scanner","ssl-pinning"],
         risk_level="medium", requires_root=False),

    Tool(id="aircrack", name="Aircrack-ng", category="monitoring", platform="both",
         description="Complete WiFi security auditing suite — monitor, inject, capture, crack",
         command_template="airmon-ng start {interface} && airodump-ng {interface}mon",
         install_cmd="sudo apt install aircrack-ng",
         check_cmd="aircrack-ng --version",
         docs_url="https://www.aircrack-ng.org/documentation.html",
         tags=["wifi","monitor","inject","cracking"],
         risk_level="high", requires_root=True),

    Tool(id="kismet", name="Kismet", category="monitoring", platform="both",
         description="Wireless network detector and IDS — passive discovery, logging",
         command_template="kismet -c {interface} --log-prefix={log_dir}",
         install_cmd="sudo apt install kismet",
         check_cmd="kismet --version",
         docs_url="https://www.kismetwireless.net/docs/",
         tags=["wifi","detection","ids","wireless"],
         risk_level="medium", requires_root=True),

    Tool(id="osquery", name="OSQuery", category="monitoring", platform="both",
         description="SQL-based endpoint telemetry — query device state like a database",
         command_template="osqueryi 'SELECT * FROM {table} WHERE {condition};'",
         install_cmd="sudo apt install osquery",
         check_cmd="osqueryi --version",
         docs_url="https://osquery.readthedocs.io/",
         tags=["endpoint","sql","telemetry","monitoring"],
         risk_level="low", requires_root=False),

    Tool(id="velociraptor", name="Velociraptor", category="monitoring", platform="both",
         description="Endpoint monitoring and digital forensics at scale — artifact collection",
         command_template="velociraptor --config {config} frontend -v",
         install_cmd="# Download from https://github.com/Velocidex/velociraptor/releases",
         check_cmd="velociraptor --version",
         docs_url="https://docs.velociraptor.app/",
         tags=["endpoint","dfir","artifacts","scale"],
         risk_level="low", requires_root=True),

    Tool(id="charles", name="Charles Proxy", category="monitoring", platform="both",
         description="HTTP/HTTPS proxy for mobile traffic interception and debugging",
         command_template="# GUI application — configure device proxy to {host}:8888",
         install_cmd="# Download from https://www.charlesproxy.com/",
         check_cmd="charles --version",
         docs_url="https://www.charlesproxy.com/documentation/",
         tags=["proxy","https","mobile","debugging"],
         risk_level="low", requires_root=False),
]

CATEGORIES = {
    "forensics": {"label": "Mobile Forensics", "icon": "🔬", "color": "#00ff9d"},
    "ids":       {"label": "Intrusion Detection", "icon": "🛡️", "color": "#ff6b35"},
    "cloning":   {"label": "Cloning & Imaging", "icon": "💾", "color": "#a78bfa"},
    "monitoring":{"label": "Device Monitoring", "icon": "📡", "color": "#38bdf8"},
}

PRESETS = [
    {"id": "android_pentest", "label": "Android App Pentest",
     "tools": ["adb","mobsf","frida","objection","burpsuite","drozer","qark"],
     "description": "Full Android application security assessment"},
    {"id": "ios_pentest", "label": "iOS App Pentest",
     "tools": ["frida","objection","mobsf","needle","mitmproxy","ileapp","libimobiledevice"],
     "description": "Full iOS application security assessment"},
    {"id": "network_monitor", "label": "Network Monitoring",
     "tools": ["suricata","zeek","wireshark","bettercap","kismet","sniffnet"],
     "description": "Passive and active network traffic analysis"},
    {"id": "full_dfir", "label": "Full DFIR Lab",
     "tools": ["wazuh","velociraptor","autopsy","osquery","dc3dd","guymager"],
     "description": "Digital forensics and incident response workflow"},
    {"id": "rf_hardware", "label": "RF / Wireless",
     "tools": ["bettercap","aircrack","kismet","wireshark"],
     "description": "Wireless and RF security testing"},
    {"id": "android_forensics", "label": "Android Forensics",
     "tools": ["adb","andriller","aleapp","autopsy","adb_backup","frida"],
     "description": "Complete Android device forensic extraction"},
    {"id": "ios_forensics", "label": "iOS Forensics",
     "tools": ["libimobiledevice","ileapp","idevicebackup2","autopsy","frida"],
     "description": "Complete iOS device forensic extraction"},
]

def get_tool(tool_id: str) -> Optional[Tool]:
    return next((t for t in TOOL_REGISTRY if t.id == tool_id), None)

def get_tools_by_category(category: str) -> List[Tool]:
    return [t for t in TOOL_REGISTRY if t.category == category]

def get_tools_by_platform(platform: str) -> List[Tool]:
    if platform == "all":
        return TOOL_REGISTRY
    return [t for t in TOOL_REGISTRY if t.platform == platform or t.platform == "both"]
