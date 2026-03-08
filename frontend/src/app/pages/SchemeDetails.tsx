import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Bookmark, Share2, ExternalLink, CheckCircle, FileText, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Separator } from "../components/ui/separator";
import { api } from "../lib/api";

export function SchemeDetails() {
  const { id } = useParams();
  const [scheme, setScheme] = useState<any>(null);

  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      api.getSchemeDetails(id).then(data => setScheme(data)).catch(console.error);
    }
    const saved = localStorage.getItem("saved_schemes");
    if (saved) setSavedSchemeIds(JSON.parse(saved));
  }, [id]);

  const toggleBookmark = () => {
    if (!id) return;
    let updated;
    if (savedSchemeIds.includes(id)) {
      updated = savedSchemeIds.filter(sid => sid !== id);
    } else {
      updated = [...savedSchemeIds, id];
    }
    setSavedSchemeIds(updated);
    localStorage.setItem("saved_schemes", JSON.stringify(updated));
  };

  if (!scheme) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;


  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <Link to="/search">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </Link>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <Badge>{scheme.category}</Badge>
              <Badge className="bg-[#16A34A] text-white">{scheme.relevance || 95}% match</Badge>
            </div>
            <h1 className="text-3xl font-bold">{scheme.name}</h1>
            <p className="text-muted-foreground">
              {scheme.description}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={toggleBookmark} className={savedSchemeIds.includes(id || "") ? "text-primary fill-primary" : ""}>
              <Bookmark className={`h-4 w-4 ${savedSchemeIds.includes(id || "") ? "fill-current" : ""}`} />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Link to="/applications">
              <Button size="lg">Apply Now</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="apply">How to Apply</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Key Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Financial Subsidy</p>
                    <p className="text-sm text-muted-foreground">
                      {scheme.benefits}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Affordable Housing</p>
                    <p className="text-sm text-muted-foreground">
                      Pucca houses with basic amenities
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Pan-India Coverage</p>
                    <p className="text-sm text-muted-foreground">
                      Available in urban and rural areas
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Toilet & Water</p>
                    <p className="text-sm text-muted-foreground">
                      All houses come with toilet and water connection
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About */}
          <Card>
            <CardHeader>
              <CardTitle>About the Scheme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                {scheme.description} The {scheme.name} is an initiative to provide benefits to eligible citizens. Check the eligibility criteria for detailed requirements.
              </p>
              <Separator />
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ministry</p>
                  <p className="font-medium">Housing & Urban Affairs</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Launch Date</p>
                  <p className="font-medium">25 June 2015</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <Badge className="bg-[#16A34A] text-white">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Official Links */}
          <Card>
            <CardHeader>
              <CardTitle>Official Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href={scheme.official_url || "#"} target="_blank" rel="noopener noreferrer">
                  <span>Official Website</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href={scheme.official_url || "#"} target="_blank" rel="noopener noreferrer">
                  <span>Download Guidelines (PDF)</span>
                  <FileText className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-between" asChild>
                <a href={scheme.official_url || "#"} target="_blank" rel="noopener noreferrer">
                  <span>FAQs</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eligibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Eligibility Criteria</CardTitle>
              <CardDescription>
                Check if you meet the requirements for this scheme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3 p-4 bg-muted rounded-lg">
                  <CheckCircle className="h-5 w-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Eligibility Rules</p>
                    <p className="text-sm text-muted-foreground">
                      {scheme.eligibility}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 p-4 bg-muted rounded-lg">
                  <CheckCircle className="h-5 w-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">No Pucca House</p>
                    <p className="text-sm text-muted-foreground">
                      Beneficiary should not own a pucca house in their name in any part of India
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 p-4 bg-muted rounded-lg">
                  <CheckCircle className="h-5 w-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Adult Member</p>
                    <p className="text-sm text-muted-foreground">
                      Beneficiary should not have availed Central assistance under any housing scheme
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 p-4 bg-muted rounded-lg">
                  <AlertCircle className="h-5 w-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Priority Groups</p>
                    <p className="text-sm text-muted-foreground">
                      Priority given to SC/ST, minorities, women-headed households, and persons with disabilities
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <Link to="/documents/verify">
                <Button className="w-full" size="lg">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Check My Eligibility
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>
                Documents you need to apply for this scheme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(scheme.documents || ["Aadhaar Card", "Income Certificate", "Identity Proof"]).map((doc: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border"
                  >
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="flex-1">{doc}</span>
                    <Badge variant="outline">Required</Badge>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              <Link to="/documents">
                <Button className="w-full" variant="outline">
                  Upload Documents
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="apply" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Process</CardTitle>
              <CardDescription>
                Step-by-step guide to apply for this scheme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-lg border border-dashed text-center">
                  <p className="text-sm font-medium">Application submission through this portal for {scheme.name} will be available soon.</p>
                  <p className="text-xs text-muted-foreground mt-2">Please follow the instructions on the official portal below.</p>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <a href={scheme.official_url || "#"} target="_blank" rel="noopener noreferrer">
                    Visit Official Portal <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
              <Separator className="my-6" />
              <Link to="/applications">
                <Button className="w-full" size="lg">
                  Apply Now (Coming Soon)
                </Button>
              </Link>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
