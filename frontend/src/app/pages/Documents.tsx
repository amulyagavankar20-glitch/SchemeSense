import { useState, useRef, useEffect } from "react";
import { Upload, File, CheckCircle, X, Eye, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Link, useNavigate } from "react-router";
import { api } from "../lib/api";

// Local type for document
type UserDocument = {
  id: string;
  name: string;
  fileName: string;
  size: string;
  uploadDate: string;
  status: "verified" | "pending";
  expiry: string | null;
};

export function Documents() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [docs, setDocs] = useState<UserDocument[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Session-based persistence for documents
    const savedDocs = sessionStorage.getItem("user_documents");
    if (savedDocs) setDocs(JSON.parse(savedDocs));
  }, []);

  const saveDocs = (updatedDocs: UserDocument[]) => {
    setDocs(updatedDocs);
    sessionStorage.setItem("user_documents", JSON.stringify(updatedDocs));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadError(null);
    }
  };

  const handleVerify = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const result = await api.verifyDocument(selectedFile);
      
      // Add to session docs
      const newDoc: UserDocument = {
        id: Math.random().toString(36).substr(2, 9),
        name: selectedFile.name.split('.')[0].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        fileName: selectedFile.name,
        size: (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB",
        uploadDate: new Date().toISOString().split('T')[0],
        status: "verified",
        expiry: null
      };
      saveDocs([...docs, newDoc]);
      setSelectedFile(null);

      navigate("/documents/verify", { state: { verificationData: result } });
    } catch (error) {
      console.error("Verification error:", error);
      setUploadError("Failed to verify document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeDoc = (id: string) => {
    saveDocs(docs.filter(d => d.id !== id));
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Document Management</h1>
        <p className="text-muted-foreground">
          Upload and manage your documents for scheme applications
        </p>
      </div>

      {/* Upload Area */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload documents to verify eligibility and speed up applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
              }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
            }}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Drag and drop files here
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse from your device
            </p>
            <Button onClick={() => fileInputRef.current?.click()}>
              Select File
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf"
            />
            <p className="text-xs text-muted-foreground mt-4">
              Supported formats: PDF, JPG, PNG (Max 5MB per file)
            </p>
          </div>

          {uploadError && (
            <div className="mt-4 p-4 bg-destructive/10 text-destructive text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {uploadError}
            </div>
          )}

          {selectedFile && (
            <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>
                {docs.length} document{docs.length !== 1 ? "s" : ""} uploaded
              </CardDescription>
            </div>
            <Button
              onClick={handleVerify}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              {isUploading ? "Verifying..." : "Verify Document"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {docs.length === 0 ? (
              <div className="text-center py-12 border border-dashed rounded-lg bg-muted/20">
                <File className="h-10 w-10 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground font-medium">No documents uploaded yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Upload your identity or income proofs to get started.</p>
              </div>
            ) : (
              docs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-lg group hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <File className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{doc.name}</p>
                        {doc.status === "verified" ? (
                          <Badge className="bg-[#16A34A] text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-[#F59E0B] text-white">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {doc.fileName} • {doc.size}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Uploaded {doc.uploadDate}
                        {doc.expiry && ` • Expires ${doc.expiry}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => removeDoc(doc.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
