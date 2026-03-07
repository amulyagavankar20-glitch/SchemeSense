import { Key, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Link } from "react-router";

export function AccountRecovery() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Key className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Account Recovery</CardTitle>
          <CardDescription>
            Enter one of your recovery codes to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recoveryCode">Recovery Code</Label>
            <Input
              id="recoveryCode"
              placeholder="XXXX-XXXX-XXXX-XXXX"
              className="text-center tracking-wider"
            />
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              Recovery codes were provided when you enabled two-factor authentication.
              Each code can only be used once.
            </p>
          </div>

          <Button className="w-full" size="lg">
            Verify Recovery Code
          </Button>

          <Link to="/auth/login">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
