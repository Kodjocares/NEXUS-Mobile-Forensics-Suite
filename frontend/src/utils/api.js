// NEXUS API client

const BASE = import.meta.env.VITE_API_URL || '/api';

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export const api = {
  // Tools
  getTools: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return req(`/tools${q ? '?' + q : ''}`);
  },
  getCategories: () => req('/tools/categories'),
  getPresets:    () => req('/tools/presets'),
  scanTools:     () => req('/tools/scan'),
  executeTool:   (tool_id, params, timeout) =>
    req('/tools/execute', { method: 'POST', body: { tool_id, params, timeout } }),

  // AI
  chat: (messages, system) =>
    req('/ai/chat', { method: 'POST', body: { messages, system } }),
  toolHelp:   (tool_name, context) =>
    req('/ai/tool-help', { method: 'POST', body: { tool_name, context } }),
  methodology: (preset_id, tools) =>
    req(`/ai/methodology?preset_id=${preset_id}`, { method: 'POST', body: tools }),
  analyzeOutput: (tool_id, output) =>
    req(`/ai/analyze?tool_id=${tool_id}`, { method: 'POST', body: output }),

  // Sessions
  createSession: (data) => req('/sessions', { method: 'POST', body: data }),
  getSessions:   () => req('/sessions'),
  addLog:        (entry) => req('/sessions/log', { method: 'POST', body: entry }),

  // Reports
  createReport: (data) => req('/reports', { method: 'POST', body: data }),
  getReports:   () => req('/reports'),
};

// WebSocket helper for streaming tool output
export function createToolStream(tool_id, params, onLine, onDone, onError) {
  const wsBase = import.meta.env.VITE_WS_URL || `ws://${window.location.host}`;
  const ws = new WebSocket(`${wsBase}/api/tools/stream/${tool_id}`);

  ws.onopen = () => ws.send(JSON.stringify({ params }));

  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data);
    if (msg.type === 'output') onLine(msg.line);
    else if (msg.type === 'done') { onDone?.(); ws.close(); }
    else if (msg.type === 'error') { onError?.(msg.message); ws.close(); }
  };

  ws.onerror = () => onError?.('WebSocket connection failed');

  return () => ws.close();
}
