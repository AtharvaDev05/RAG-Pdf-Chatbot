import { useState } from "react";

function UploadArea() {

  const [selectedFile, setSelectedFile] = useState(null) // Which PDF did the user choose?
  const [uploading, setUploading] = useState(false) // Is the API currently processing it?
  const [message, setMessage] = useState("") // What should we tell the user?

  function handleFileChange(event) {
    const file = event.target.files[0] // files[0] means: Give me the first selected file.

    if(!file) return

    if(file.type != "application/pdf") {
      setMessage("Please select a PDF file.")
      return
    }

    setSelectedFile(file)
    setMessage("")
  }

  async function handleUpload() {
    if(!selectedFile) {
      setMessage("Please select a PDF first.")
      return
    }
    setUploading(true)
    setMessage("")

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method : "POST",
        body : formData
      })

      if(!response.ok) {
        throw new Error("Upload Failed.")
      }

      const data = response.json();
      setMessage(data.message || "PDF Uploaded Successfully!")
    } catch (error) {
      setMessage("Something went wrong while uploading the PDF.")
    }
    finally {
      setUploading(false)
    }
  }

    
  return (
    <section className="mt-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Upload Your PDF
        </h2>

        <p className="mt-3 text-gray-500">
          Select a PDF document to start chatting with it.
        </p>

        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="mt-6 block w-full text-sm text-gray-500"
        />

        {selectedFile && (
          <p className="mt-4 text-sm text-gray-700">
            Selected: <span className="font-medium">{selectedFile.name}</span>
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>

        {message && (
          <p className="mt-4 text-sm text-gray-600">
            {message}
          </p>
        )}
      </div>
    </section>
  );
}

export default UploadArea;