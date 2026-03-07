import { useState, useEffect } from "react";
import { Search as SearchIcon, Filter, SlidersHorizontal, Bookmark, ExternalLink, RefreshCw, Database } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Link } from "react-router";
import { api } from "../lib/api";

type Scheme = {
  id: string;
  name: string;
  category: string;
  description: string;
  relevance: number;
  benefits: string;
  eligibility: string;
};

export function Search() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const data = await api.getSchemes();
        setSchemes(data);
      } catch (error) {
        console.error("Failed to fetch schemes", error);
      }
    };
    fetchSchemes();
  }, []);

  const handleScrape = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await api.scrape();
      setSyncMessage(res.message || "Scraping completed.");
    } catch (error) {
      console.error(error);
      setSyncMessage("Error during scrape.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleProcess = async () => {
    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const res = await api.process();
      setSyncMessage(res.message || "Processing completed.");
    } catch (error) {
      console.error(error);
      setSyncMessage("Error during processing.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Search Header */}
      <div className="space-y-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Discover Government Schemes</h1>
          <p className="text-muted-foreground">
            Find schemes that match your profile and needs
          </p>
        </div>

        {/* Admin actions block purely for integration demonstration */}
        <div className="flex items-center gap-2 p-3 bg-muted rounded-md mb-2">
          <span className="text-sm font-semibold mr-2 flex items-center">
            <Database className="w-4 h-4 mr-1" /> Admin Data Sync:
          </span>
          <Button variant="outline" size="sm" onClick={handleScrape} disabled={isSyncing}>
            <RefreshCw className={`h-3 w-3 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
            Run Scrape
          </Button>
          <Button variant="outline" size="sm" onClick={handleProcess} disabled={isSyncing}>
            <Database className={`h-3 w-3 mr-2 ${isSyncing ? "animate-pulse" : ""}`} />
            Process Data
          </Button>
          {syncMessage && (
            <span className="text-xs text-primary ml-2">{syncMessage}</span>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search schemes by name, category, or benefits..."
              className="pl-10"
            />
          </div>
          <Button>
            <SearchIcon className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="housing">Housing</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <strong>{schemes.length}</strong> schemes
          </p>
          <Link to="/compare">
            <Button variant="outline" size="sm">
              Compare Selected (0)
            </Button>
          </Link>
        </div>
      </div>

      {/* Scheme Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {schemes.map((scheme) => (
          <Card key={scheme.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2 mb-2">
                <Badge variant="outline">{scheme.category}</Badge>
                <div className="flex items-center gap-1">
                  <Badge
                    className={`${scheme.relevance >= 80
                        ? "bg-[#16A34A] text-white"
                        : scheme.relevance >= 70
                          ? "bg-[#F59E0B] text-white"
                          : "bg-muted"
                      }`}
                  >
                    {scheme.relevance}% match
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{scheme.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {scheme.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Benefits</p>
                  <p className="font-medium">{scheme.benefits}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Eligibility</p>
                  <p className="font-medium text-xs">{scheme.eligibility}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/scheme/${scheme.id}`} className="flex-1">
                  <Button className="w-full" size="sm">
                    View Details
                  </Button>
                </Link>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
