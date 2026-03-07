import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Download, CheckCircle, Clock, AlertCircle, X, FileText } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { api } from "../lib/api";

const timeline = [
  {
    stage: "Application Submitted",
    date: "28 Feb 2024, 10:30 AM",
    status: "completed",
    description: "Your application has been successfully submitted",
  },
  {
    stage: "Document Verification",
    date: "28 Feb 2024, 02:15 PM",
    status: "completed",
    description: "All documents have been verified successfully",
  },
  {
    stage: "Eligibility Assessment",
    date: "In Progress",
    status: "current",
    description: "Your eligibility is being assessed by the authorities",
    estimatedDate: "Expected by 5 Mar 2024",
  },
  {
    stage: "Approval Process",
    date: "Pending",
    status: "pending",
    description: "Final approval from authorities",
    estimatedDate: "Expected by 10 Mar 2024",
  },
  {
    stage: "Disbursement",
    date: "Pending",
    status: "pending",
    description: "Benefit disbursement to your account",
  },
];

export function ApplicationDetails() {
  const { id } = useParams();
  const [app, setApp] = useState<any>(null);

  useEffect(() => {
    if (id) {
      api.getApplicationDetails(id).then(setApp).catch(console.error);
    }
  }, [id]);

  if (!app) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="mb-6">
        <Link to="/applications">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Applications
          </Button>
        </Link>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{app.category}</Badge>
              <Badge className="bg-[#F59E0B] text-white">{app.status}</Badge>
            </div>
            <h1 className="text-2xl font-bold mb-1">
              {app.schemeName || app.scheme}
            </h1>
            <p className="text-muted-foreground font-mono">{id}</p>
          </div>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Application
          </Button>
        </div>
      </div>

      {/* Application Status Timeline */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Application Status Timeline</CardTitle>
          <CardDescription>
            Track the progress of your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      item.status === "completed"
                        ? "border-[#16A34A] bg-[#16A34A]"
                        : item.status === "current"
                        ? "border-[#F59E0B] bg-[#F59E0B]"
                        : "border-muted bg-background"
                    }`}
                  >
                    {item.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : item.status === "current" ? (
                      <Clock className="h-5 w-5 text-white" />
                    ) : (
                      <div className="h-3 w-3 rounded-full bg-muted" />
                    )}
                  </div>
                  {index < timeline.length - 1 && (
                    <div
                      className={`w-0.5 h-16 ${
                        item.status === "completed"
                          ? "bg-[#16A34A]"
                          : "bg-muted"
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="font-semibold">{item.stage}</h3>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                  {item.estimatedDate && (
                    <p className="text-xs text-[#F59E0B] mt-1">
                      {item.estimatedDate}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Application Details */}
        <Card>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Applicant Name</p>
              <p className="font-medium">Rajesh Kumar</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Submission Date</p>
              <p className="font-medium">28 February 2024</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Category</p>
              <p className="font-medium">EWS (Economically Weaker Section)</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Annual Income</p>
              <p className="font-medium">₹4,50,000</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Contact Number</p>
              <p className="font-medium">+91 98765 43210</p>
            </div>
          </CardContent>
        </Card>

        {/* Submitted Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Submitted Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: "Aadhaar Card", status: "verified" },
                { name: "Income Certificate", status: "verified" },
                { name: "Bank Statement", status: "verified" },
                { name: "Property Documents", status: "verified" },
                { name: "Passport Photos", status: "verified" },
              ].map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm">{doc.name}</span>
                  </div>
                  {doc.status === "verified" ? (
                    <Badge className="bg-[#16A34A] text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline">Pending</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card className="mt-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Need Help?</h3>
              <p className="text-sm text-muted-foreground">
                If you have any questions about your application, our support team is here to help.
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/help">
                <Button variant="outline">Contact Support</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
