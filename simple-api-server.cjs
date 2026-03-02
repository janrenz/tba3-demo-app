// Simple Node.js API server for TBA3 demo
// Returns hardcoded realistic test data

const http = require('http');

const MOCK_DATA = {
  competenceLevels: {
    competence_levels: {
      I: 3,
      II: 7,
      III: 8,
      IV: 5,
      V: 2
    }
  },
  items: {
    items: [
      { id: 'DE-V3-2024-01', solution_frequency: 0.85, metadata: { exercise_id: 'Lesen_01', competence_level: 'III' } },
      { id: 'DE-V3-2024-02', solution_frequency: 0.72, metadata: { exercise_id: 'Lesen_02', competence_level: 'III' } },
      { id: 'DE-V3-2024-03', solution_frequency: 0.68, metadata: { exercise_id: 'Lesen_03', competence_level: 'III' } },
      { id: 'DE-V3-2024-04', solution_frequency: 0.55, metadata: { exercise_id: 'Schreiben_01', competence_level: 'III' } },
      { id: 'DE-V3-2024-05', solution_frequency: 0.48, metadata: { exercise_id: 'Schreiben_02', competence_level: 'IV' } },
      { id: 'DE-V3-2024-06', solution_frequency: 0.62, metadata: { exercise_id: 'Schreiben_03', competence_level: 'III' } },
      { id: 'DE-V3-2024-07', solution_frequency: 0.41, metadata: { exercise_id: 'Verstehen_01', competence_level: 'IV' } },
      { id: 'DE-V3-2024-08', solution_frequency: 0.78, metadata: { exercise_id: 'Verstehen_02', competence_level: 'II' } },
      { id: 'DE-V3-2024-09', solution_frequency: 0.35, metadata: { exercise_id: 'Verstehen_03', competence_level: 'V' } },
      { id: 'DE-V3-2024-10', solution_frequency: 0.58, metadata: { exercise_id: 'Sprechen_01', competence_level: 'III' } }
    ]
  }
};

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = req.url;

  // LTI 1.1 content-item callback – relay payload to opener/parent via postMessage
  if (url === '/lti-callback' || url.startsWith('/lti-callback?')) {
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('LTI callback endpoint ready');
      return;
    }
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      let payload;
      try {
        const params = new URLSearchParams(body);
        payload = Object.fromEntries(params.entries());
      } catch {
        payload = { raw: body };
      }
      const json = JSON.stringify(payload).replace(/</g, '\\u003c');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
<script>
  var data = ${json};
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ type: 'lti-content-items', payload: data }, '*');
  }
  if (window.opener) {
    window.opener.postMessage({ type: 'lti-content-items', payload: data }, '*');
  }
  document.body.innerHTML = '<p style="font-family:sans-serif;padding:20px">Materialien werden \u00fcbertragen\u2026</p>';
</script>
</body></html>`);
    });
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  // Handle different endpoints
  if (url.includes('/competence-levels')) {
    res.writeHead(200);
    res.end(JSON.stringify(MOCK_DATA.competenceLevels));
  } else if (url.includes('/items')) {
    res.writeHead(200);
    res.end(JSON.stringify(MOCK_DATA.items));
  } else if (url.includes('/aggregations')) {
    res.writeHead(200);
    res.end(JSON.stringify({ aggregations: {} }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`✅ Simple TBA3 API Server running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  - /groups/{id}/competence-levels');
  console.log('  - /groups/{id}/items');
  console.log('  - /schools/{id}/competence-levels');
  console.log('  - /schools/{id}/items');
  console.log('  - /states/{id}/competence-levels');
  console.log('  - /states/{id}/items');
});
