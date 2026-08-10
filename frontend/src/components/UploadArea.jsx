import { useState } from "react";

function UploadArea({onUploadSuccess}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [uploaded, setUploaded] = useState(false);

  function handleFileChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage("Please select a PDF file.");
      return;
    }

    setSelectedFile(file);
    setUploaded(false);
    setMessage("");
  }

  async function handleUpload() {
    if (!selectedFile) {
      setMessage("Please select a PDF first.");
      return;
    }

    setUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload Failed.");
      }

      const data = await response.json();

      // Upload was successful
      setUploaded(true);
      onUploadSuccess(selectedFile)
      setMessage(data.message || "PDF uploaded successfully!");
      
    } catch (error) {
      setMessage("Something went wrong while uploading the PDF.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="shrink-0 border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-3xl">
        {!uploaded ? (
          /* Upload state */
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-3 transition hover:border-indigo-400 hover:bg-indigo-50/30 sm:p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Upload Icon */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 shadow-md">
                <span className="text-lg text-white">↑</span>
              </div>

              {/* Upload Information */}
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <h2 className="text-base font-semibold text-gray-900">
                  Upload your PDF
                </h2>

                <p className="text-xs text-gray-500">
                  Select a PDF document to start chatting with it.
                </p>

                {/* Selected File */}
                {selectedFile && (
                  <p className="mt-1 truncate text-xs text-gray-600">
                    <span className="text-gray-400">Selected:</span>{" "}
                    <span className="font-medium text-gray-900">
                      {selectedFile.name}
                    </span>
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex shrink-0 justify-center gap-2">
                {/* File Input */}
                <label className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm transition hover:border-indigo-400 hover:text-indigo-600">
                  Choose PDF
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </div>

            {/* Status Message */}
            {message && (
              <p className="mt-2 text-center text-xs text-gray-600 sm:text-left">
                {message}
              </p>
            )}
          </div>
        ) : (
          /* Uploaded state */
          <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                <span className="text-lg">📄</span>
              </div>

              <div className="min-w-0">
                <p className="text-xs text-gray-500">Current document</p>

                <p className="truncate text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
              </div>
            </div>

            <div className="ml-3 flex shrink-0 items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>

              <span className="text-xs font-medium text-green-600">Ready</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default UploadArea;
