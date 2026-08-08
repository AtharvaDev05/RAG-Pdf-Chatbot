import UploadArea from "./UploadArea";
import ChatPlaceholder from "./ChatPlaceholder"

function MainLayout() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <UploadArea />
        <ChatPlaceholder />
      </div>
    </main>
  );
}

export default MainLayout;