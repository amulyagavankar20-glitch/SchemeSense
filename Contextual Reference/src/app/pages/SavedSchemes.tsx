import { Bookmark, ExternalLink, Trash2, Filter } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const savedSchemes = [
  {
    id: "1",
    name: "Pradhan Mantri Awas Yojana",
    category: "Housing",
    description: "Affordable housing for all with financial assistance",
    savedDate: "2 days ago",
    status: "Not Applied",
  },
  {
    id: "2",
    name: "National Scholarship Portal",
    category: "Education",
    description: "Scholarships for students from various backgrounds",
    savedDate: "1 week ago",
    status: "Applied",
  },
  {
    id: "4",
    name: "Ayushman Bharat - PMJAY",
    category: "Healthcare",
    description: "Free health insurance coverage for families",
    savedDate: "2 weeks ago",
    status: "Not Applied",
  },
];

export function SavedSchemes() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Saved Schemes</h1>
          <p className="text-muted-foreground">
            Schemes you've bookmarked for later review
          </p>
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Schemes</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="not-applied">Not Applied</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {savedSchemes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No saved schemes</h3>
            <p className="text-muted-foreground mb-4">
              Start browsing schemes and bookmark the ones you're interested in
            </p>
            <Link to="/search">
              <Button>Browse Schemes</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {savedSchemes.map((scheme) => (
            <Card key={scheme.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{scheme.category}</Badge>
                      {scheme.status === "Applied" && (
                        <Badge className="bg-[#16A34A] text-white">Applied</Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{scheme.name}</CardTitle>
                    <CardDescription>{scheme.description}</CardDescription>
                    <p className="text-xs text-muted-foreground">
                      Saved {scheme.savedDate}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/scheme/${scheme.id}`}>
                    <Button>View Details</Button>
                  </Link>
                  {scheme.status === "Not Applied" && (
                    <Link to={`/apply/${scheme.id}`}>
                      <Button variant="outline">Apply Now</Button>
                    </Link>
                  )}
                  {scheme.status === "Applied" && (
                    <Link to="/applications">
                      <Button variant="outline">View Application</Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
