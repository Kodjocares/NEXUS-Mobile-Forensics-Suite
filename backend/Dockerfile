FROM python:3.11-slim

WORKDIR /app

# Install system forensics tools
RUN apt-get update && apt-get install -y \
    adb \
    dcfldd \
    dc3dd \
    guymager \
    libimobiledevice-utils \
    wireshark-common \
    tshark \
    aircrack-ng \
    zeek \
    suricata \
    snort \
    osquery \
    clonezilla \
    && rm -rf /var/lib/apt/lists/*

# Python tools
RUN pip install --no-cache-dir \
    frida-tools \
    objection \
    mitmproxy \
    andriller \
    qark \
    drozer

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
