import { Trash2, Users, HeartPulse, GraduationCap, Tractor, BookmarkX } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function SavedSchemes() {
  const [savedSchemes, setSavedSchemes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedSchemes = async () => {
    try {
      const allSchemes = await api.getSchemes();
      const savedIds = JSON.parse(localStorage.getItem("saved_schemes") || "[]");
      const filtered = allSchemes.filter((s: any) => savedIds.includes(s.id));
      setSavedSchemes(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedSchemes();
  }, []);

  const removeScheme = (id: string) => {
    const savedIds = JSON.parse(localStorage.getItem("saved_scheme_ids") || localStorage.getItem("saved_schemes") || "[]");
    const updated = savedIds.filter((sid: string) => sid !== id);
    localStorage.setItem("saved_schemes", JSON.stringify(updated));
    setSavedSchemes(prev => prev.filter(s => s.id !== id));
  };

  const categories = [
    { name: "Farmers", icon: Tractor, color: "text-amber-600", bg: "bg-amber-50" },
    { name: "Healthcare", icon: HeartPulse, color: "text-rose-600", bg: "bg-rose-50" },
    { name: "Women", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Students", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50" },
  ];

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading your saved schemes...</div>;

  const hasAnySaved = savedSchemes.length > 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3 tracking-tight">Saved Schemes</h1>
        <p className="text-muted-foreground text-lg">
          Your bookmarked schemes organized by target beneficiary groups.
        </p>
      </div>

      {!hasAnySaved ? (
        <div className="flex flex-col items-center justify-center p-12 bg-muted/20 rounded-3xl border-2 border-dashed border-border min-h-[300px]">
          <div className="p-4 bg-muted rounded-full mb-4">
            <BookmarkX className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold mb-2">You have not saved any schemes yet.</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-xs">
            Explore government schemes and bookmark them to keep track of benefits you're eligible for.
          </p>
          <Link to="/search">
            <Button className="rounded-xl px-8 font-bold">Start Exploring</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat) => {
            const catSchemes = savedSchemes.filter(s => 
              s.category.toLowerCase().includes(cat.name.toLowerCase()) || 
              (cat.name === "Healthcare" && s.category.toLowerCase().includes("health")) ||
              (cat.name === "Farmers" && (s.category.toLowerCase().includes("agri") || s.category.toLowerCase().includes("farm")))
            );
            
            if (catSchemes.length === 0) return null;

            const Icon = cat.icon;
            return (
              <div key={cat.name} className="space-y-4">
                <div className="flex items-center gap-3 px-1">
                  <div className={`p-2 rounded-xl ${cat.bg} ${cat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">{cat.name}</h2>
                  <Badge variant="secondary" className="ml-auto rounded-full px-3">
                    {catSchemes.length}
                  </Badge>
                </div>

                <div className="space-y-4">
                  {catSchemes.map((scheme) => (
                    <Card key={scheme.id} className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                              {scheme.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 text-xs">
                              {scheme.description}
                            </CardDescription>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() => removeScheme(scheme.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between gap-4 mt-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Major Benefit</span>
                            <span className="text-sm font-semibold text-primary truncate max-w-[150px]">{scheme.benefits || "Refer to details"}</span>
                          </div>
                          <Link to={`/scheme/${scheme.id}`}>
                            <Button size="sm" className="rounded-xl px-5 h-9 font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-none">
                              Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
          
          {/* General category for schemes that don't fit the 4 groups */}
          {(() => {
            const mainCatNames = categories.map(c => c.name.toLowerCase());
            const generalSchemes = savedSchemes.filter(s => {
              const sc = s.category.toLowerCase();
              return !mainCatNames.some(cn => sc.includes(cn)) && 
                     !sc.includes("health") && !sc.includes("agri") && !sc.includes("farm");
            });

            if (generalSchemes.length === 0) return null;

            return (
              <div className="space-y-4 md:col-span-2">
                <div className="flex items-center gap-3 px-1 border-t pt-8 mt-4">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                    <BookmarkX className="h-6 w-6" />
                  </div>
                  <h2 className="text-xl font-bold tracking-tight">Other Categories</h2>
                  <Badge variant="secondary" className="ml-auto rounded-full px-3">
                    {generalSchemes.length}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generalSchemes.map(scheme => (
                     <Card key={scheme.id} className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                              {scheme.name}
                            </CardTitle>
                            <CardDescription className="line-clamp-2 text-xs">
                              {scheme.description}
                            </CardDescription>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                            onClick={() => removeScheme(scheme.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between gap-4 mt-2">
                          <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Category</span>
                            <span className="text-sm font-semibold text-primary">{scheme.category}</span>
                          </div>
                          <Link to={`/scheme/${scheme.id}`}>
                            <Button size="sm" className="rounded-xl px-5 h-9 font-bold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-none">
                              Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <div className="mt-16 p-8 rounded-3xl bg-muted/30 border border-dashed border-border flex flex-col items-center text-center">
        <h3 className="text-lg font-bold mb-2">Need more options?</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          Browse our complete database to find more schemes that match your specific profile.
        </p>
        <Link to="/search">
          <Button variant="outline" className="rounded-2xl px-8 h-12 font-bold bg-background">
            Discover More Schemes
          </Button>
        </Link>
      </div>
    </div>
  );
}
