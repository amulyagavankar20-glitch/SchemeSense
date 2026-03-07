import { useState, useEffect } from "react";
import { FileText, Filter, Search, Download } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { api } from "../lib/api";

export function Applications() {
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    api.getApplications().then(setApplications).catch(console.error);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-500 text-white";
      case "processing":
        return "bg-[#F59E0B] text-white";
      case "approved":
        return "bg-[#16A34A] text-white";
      case "rejected":
        return "bg-destructive text-white";
      default:
        return "bg-muted";
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Applications</h1>
          <p className="text-muted-foreground">
            Track and manage your scheme applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search applications..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{applications.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#F59E0B]">
                {applications.filter((a) => a.status === "processing").length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Processing</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#16A34A]">
                {applications.filter((a) => a.status === "approved").length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-destructive">
                {applications.filter((a) => a.status === "rejected").length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.map((app) => (
          <Card key={app.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{app.category}</Badge>
                    <Badge className={getStatusColor(app.status)}>
                      {getStatusLabel(app.status)}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-1">{app.schemeName || app.scheme}</CardTitle>
                  <CardDescription>
                    Application ID: <span className="font-mono">{app.id}</span>
                  </CardDescription>
                  <p className="text-sm text-muted-foreground mt-2">
                    Submitted on {app.submittedDate ? new Date(app.submittedDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }) : "Recently"}
                  </p>
                </div>
                <Link to={`/applications/${app.id}`}>
                  <Button>View Details</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Current Stage:</span>
                  <span className="font-medium">{app.stage}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      app.status === "approved"
                        ? "bg-[#16A34A]"
                        : app.status === "rejected"
                        ? "bg-destructive"
                        : app.status === "processing"
                        ? "bg-[#F59E0B]"
                        : "bg-primary"
                    }`}
                    style={{ width: `${app.progress}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
