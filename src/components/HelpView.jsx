/**
 * Help / documentation view: MCP server connection and tools.
 * Shown in the "Hilfe" tab of the dashboard.
 */
const HelpView = () => {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          MCP-Server für TBA3-Ergebnisdaten
        </h2>
        <p className="text-gray-600 text-sm">
          Über den TBA3 Results MCP-Server können KI-Assistenten (z. B. Cursor) direkt auf
          Kompetenzstufen, Aggregationen und Item-Statistiken zugreifen.
        </p>
      </div>

      {/* Connection: Cursor (stdio) */}
      <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">In Cursor verbinden (lokal)</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Der Server läuft als Prozess und kommuniziert per stdio mit Cursor.
          </p>
        </div>
        <div className="p-5 space-y-4 text-sm">
          <p className="text-gray-700">
            Im Projekt ist bereits eine <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">.cursor/mcp.json</code> hinterlegt.
            Cursor startet den Server automatisch. Nach Änderungen an der Konfiguration Cursor neu starten oder Fenster neu laden.
          </p>
          <div>
            <p className="text-gray-600 mb-2">Beispiel-Konfiguration:</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
{`{
  "mcpServers": {
    "tba3-results": {
      "command": "node",
      "args": ["mcp-server/index.js"],
      "env": {
        "TBA3_API_BASE_URL": "http://localhost:8000"
      }
    }
  }
}`}
            </pre>
          </div>
          <p className="text-gray-600">
            <strong>TBA3_API_BASE_URL</strong> muss auf Ihre TBA3-API zeigen (z. B. Mock-Server auf Port 8000).
            Vor dem Verbinden: <code className="bg-gray-100 px-1 rounded">cd mcp-server && npm install</code> ausführen.
          </p>
        </div>
      </section>

      {/* Connection: HTTP (deployed) */}
      <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Per HTTP verbinden (Deployment)</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Wenn der MCP-Server als Container läuft, nutzt er Streamable HTTP.
          </p>
        </div>
        <div className="p-5 space-y-4 text-sm">
          <p className="text-gray-700">
            Endpunkt: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">POST /mcp</code>.
            In Cursor unter Einstellungen → MCP einen <strong>Streamable HTTP</strong>-Server anlegen und die URL
            eintragen, z. B. <code className="bg-gray-100 px-1 rounded">https://ihr-server.example/mcp</code>.
          </p>
          <p className="text-gray-600">
            Das Docker-Image wird in der CI als <code className="bg-gray-100 px-1 rounded">…-mcp</code> gebaut.
            Im Container die Umgebungsvariable <strong>TBA3_API_BASE_URL</strong> auf die TBA3-API setzen.
          </p>
        </div>
      </section>

      {/* Tools */}
      <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Verfügbare Tools</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Diese Tools stehen dem Assistenten nach der Verbindung zur Verfügung.
          </p>
        </div>
        <div className="p-5 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 pr-4 font-semibold text-gray-700">Tool</th>
                <th className="text-left py-2 font-semibold text-gray-700">Beschreibung</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              <tr className="border-b border-gray-100">
                <td className="py-2.5 pr-4 font-mono text-xs text-primary">tba3_list_entities</td>
                <td className="py-2.5">Listet verfügbare Gruppen-, Schul- oder Landes-IDs (<code>entityType</code>: group | school | state).</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 pr-4 font-mono text-xs text-primary">tba3_get_competence_levels</td>
                <td className="py-2.5">Kompetenzstufen-Statistik (I–V) für eine Gruppe, Schule oder ein Land.</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 pr-4 font-mono text-xs text-primary">tba3_get_aggregations</td>
                <td className="py-2.5">Aggregations-Statistiken (z. B. Mittelwert, Häufigkeit) für eine Einheit.</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 pr-4 font-mono text-xs text-primary">tba3_get_items</td>
                <td className="py-2.5">Item-Statistiken (z. B. Lösungsquote) pro Gruppe/Schule/Land.</td>
              </tr>
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-3">
            Bei den get-*-Tools kann optional <strong>type</strong> übergeben werden: <code>group</code>, <code>students</code> oder <code>group,students</code>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HelpView;
