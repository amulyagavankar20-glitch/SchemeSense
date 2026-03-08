import { Rocket } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router";

export function Applications() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 min-h-[calc(100vh-8rem)]">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center blur-2xl opacity-20">
             <div className="w-32 h-32 bg-primary rounded-full" />
          </div>
          <div className="relative bg-muted/50 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-border/40 shadow-sm">
            <Rocket className="h-12 w-12 text-primary animate-pulse" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-black tracking-tight text-foreground">Coming Soon</h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            The **Applications** feature is currently under development. Soon, you'll be able to apply for government schemes directly within the portal.
          </p>
        </div>

        <div className="pt-6">
          <Link to="/">
            <Button size="lg" className="rounded-2xl px-8 h-12 font-bold shadow-lg shadow-primary/20">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="pt-8 grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/20 text-left">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Status</p>
            <p className="text-sm font-medium">In Development</p>
          </div>
          <div className="p-4 rounded-2xl bg-muted/30 border border-border/20 text-left">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Estimated</p>
            <p className="text-sm font-medium">Spring 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
