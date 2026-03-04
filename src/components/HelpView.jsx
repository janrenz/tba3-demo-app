/**
 * Help / documentation view: MCP server connection and tools.
 * Shown in the "Hilfe" tab of the dashboard.
 */
const HelpView = () => {
  const mcpHttpUrl =
    import.meta.env.VITE_MCP_HTTP_URL ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}/mcp`
      : 'https://ihr-mcp-server.example/mcp');

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          MCP-Server für TBA3-Ergebnisdaten
        </h2>
        <p className="text-gray-600 text-sm">
          Über den TBA3 Results MCP-Server können KI-Assistenten (z. B. Cursor, Claude) direkt auf
          Kompetenzstufen, Aggregationen und Item-Statistiken zugreifen.
        </p>
      </div>

      {/* Connection: Claude (stdio) */}
      <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">In Claude verbinden (lokal)</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Claude Desktop startet den MCP-Server als Prozess (stdio). Konfiguration über <code className="bg-gray-100 px-1 rounded">claude_desktop_config.json</code>.
          </p>
        </div>
        <div className="p-5 space-y-4 text-sm">
          <p className="text-gray-700">
            <strong>Konfigurationsdatei</strong> (je nach System):
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>macOS: <code className="bg-gray-100 px-1 rounded">~/Library/Application Support/Claude/claude_desktop_config.json</code></li>
            <li>Windows: <code className="bg-gray-100 px-1 rounded">%APPDATA%\Claude\claude_desktop_config.json</code></li>
            <li>Linux: <code className="bg-gray-100 px-1 rounded">~/.config/Claude/claude_desktop_config.json</code></li>
          </ul>
          <p className="text-gray-600">
            In Claude Desktop: <strong>Einstellungen → Developer → Edit Config</strong>, oder die Datei direkt bearbeiten.
          </p>
          <div>
            <p className="text-gray-600 mb-2">Beispiel-Konfiguration (Pfad zum Projekt anpassen):</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
{`{
  "mcpServers": {
    "tba3-results": {
      "command": "node",
      "args": ["/Pfad/zu/Ihrem/Projekt/mcp-server/index.js"],
      "env": {
        "TBA3_API_BASE_URL": "http://localhost:8000"
      }
    }
  }
}`}
            </pre>
          </div>
          <p className="text-gray-600">
            <strong>args</strong>: absoluter Pfad zu <code className="bg-gray-100 px-1 rounded">mcp-server/index.js</code> im ausgecheckten Projekt.
            <strong>TBA3_API_BASE_URL</strong>: Basis-URL der TBA3-API (z. B. Mock-Server auf Port 8000).
            Vor dem ersten Start: <code className="bg-gray-100 px-1 rounded">cd mcp-server && npm install</code>.
            Nach Änderungen an der Config Claude Desktop vollständig neu starten.
          </p>
        </div>
      </section>

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
            <strong>Anlegen:</strong> Im Projektroot (dort, wo der Ordner <code className="bg-gray-100 px-1 rounded">mcp-server</code> liegt) Ordner <code className="bg-gray-100 px-1 rounded">.cursor</code> anlegen und darin die Datei <code className="bg-gray-100 px-1 rounded">mcp.json</code> mit folgendem Inhalt speichern. Cursor startet den Server automatisch. Nach Änderungen Cursor neu starten oder Fenster neu laden.
          </p>
          <div>
            <p className="text-gray-600 mb-2">Inhalt für <code className="bg-gray-100 px-1 rounded">.cursor/mcp.json</code> (zum Kopieren):</p>
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
            In Cursor unter Einstellungen → MCP einen <strong>Streamable HTTP</strong>-Server anlegen und als URL
            <code className="bg-gray-100 px-1 ml-1 rounded">{mcpHttpUrl}</code> eintragen.
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
                <td className="py-2.5">Schulen, Lerngruppen/Klassen oder Bundesländer mit id, name, ggf. Fach/Klasse/Schulart. Optional filtern: <code>subject</code>, <code>grade</code> (bei group), <code>type</code> (bei school).</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 pr-4 font-mono text-xs text-primary">tba3_list_subjects</td>
                <td className="py-2.5">Liste der Fächer (code, name): Deutsch, Mathematik, Englisch, Französisch.</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2.5 pr-4 font-mono text-xs text-primary">tba3_list_grades</td>
                <td className="py-2.5">Jahrgangsstufen (Klasse 3, Klasse 8) mit code, name, description.</td>
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
