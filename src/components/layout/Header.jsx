const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">TBA3 Demo</h1>
            <p className="text-sm text-gray-600 mt-1">
              VERA Auswertungsschnittstelle – Interaktive Datenvisualisierung
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Mock Server
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
