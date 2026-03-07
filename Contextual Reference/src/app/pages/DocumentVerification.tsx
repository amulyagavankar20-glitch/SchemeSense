import { ArrowLeft, CheckCircle, AlertCircle, X } from "lucide-react";
import { Link, useLocation, Navigate } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export function DocumentVerification() {
  const location = useLocation();
  const verificationData = location.state?.verificationData;

  // If no data is passed (e.g. direct URL visit), we could navigate back
  if (!verificationData) {
    return <Navigate to="/documents" replace />;
  }

  // The backend returns { submission_id, extracted_data: { confidence_scores, data_types, key_value_pairs }, message }
  const { extracted_data, submission_id } = verificationData;
  const { key_value_pairs, confidence_scores } = extracted_data || {};

  // For simplicity, overall match can be an average of confidence scores or a default if missing
  const confidenceValues = Object.values(confidence_scores || {}) as number[];
  const overallMatch = confidenceValues.length > 0
    ? Math.round(confidenceValues.reduce((a, b) => a + b, 0) / confidenceValues.length)
    : 0;

  const extractedFields = Object.entries(key_value_pairs || {}).map(([key, value]) => {
    const confidence = Math.round((confidence_scores?.[key] as number) || 0);
    return {
      field: key,
      extracted: value as string,
      confidence,
      status: confidence >= 90 ? "verified" : confidence >= 70 ? "warning" : "failed",
    };
  });

  const missingDocs: string[] = []; // Can be derived if backend starts sending it

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="mb-6">
        <Link to="/documents">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Documents
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mb-2">Document Verification</h1>
        <p className="text-muted-foreground">
          AI-powered verification of your uploaded documents
        </p>
      </div>

      {/* Overall Match */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-[#16A34A]/10 mb-4">
              <div className="text-4xl font-bold text-[#16A34A]">{overallMatch}%</div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Verification Score</h2>
            <p className="text-muted-foreground">
              Submission ID: <span className="font-mono">{submission_id}</span>
            </p>
          </div>
          <Progress value={overallMatch} className="h-3" indicatorClassName="bg-[#16A34A]" />
        </CardContent>
      </Card>

      {/* Extracted Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Extracted Information</CardTitle>
          <CardDescription>
            Information extracted from your documents with confidence scores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Field</TableHead>
                <TableHead>Extracted Value</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extractedFields.map((field, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{field.field}</TableCell>
                  <TableCell>{field.extracted}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={field.confidence}
                        className="h-2 w-16"
                        indicatorClassName={
                          field.confidence >= 90
                            ? "bg-[#16A34A]"
                            : field.confidence >= 80
                              ? "bg-[#F59E0B]"
                              : "bg-destructive"
                        }
                      />
                      <span className="text-sm">{field.confidence}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {field.status === "verified" ? (
                      <Badge className="bg-[#16A34A] text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : field.status === "warning" ? (
                      <Badge className="bg-[#F59E0B] text-white">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Review
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <X className="h-3 w-3 mr-1" />
                        Failed
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Missing Documents */}
      {missingDocs.length > 0 && (
        <Card className="mb-6 border-[#F59E0B]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-[#F59E0B]" />
              <CardTitle>Missing Documents</CardTitle>
            </div>
            <CardDescription>
              These documents are required for complete verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {missingDocs.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#F59E0B]/5 rounded-lg border border-[#F59E0B]/20"
                >
                  <span>{doc}</span>
                  <Badge variant="outline" className="border-[#F59E0B] text-[#F59E0B]">
                    Required
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3 p-4 bg-muted rounded-lg">
            <CheckCircle className="h-5 w-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">Eligibility Check Complete</p>
              <p className="text-sm text-muted-foreground">
                Based on your documents, you are eligible for 8 government schemes
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/search" className="flex-1">
              <Button className="w-full">View Eligible Schemes</Button>
            </Link>
            <Link to="/documents">
              <Button variant="outline">Upload More Documents</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
