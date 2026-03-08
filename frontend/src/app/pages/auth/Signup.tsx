import { Link } from "react-router";
import { UserPlus, Mail, Lock, User, Phone, Chrome, Facebook, Check, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Checkbox } from "../../components/ui/checkbox";
import { useState } from "react";
import { Progress } from "../../components/ui/progress";

export function Signup() {
  const [password, setPassword] = useState("");

  const passwordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength += 25;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength += 25;
    if (/\d/.test(pwd)) strength += 25;
    if (/[@$!%*?&#]/.test(pwd)) strength += 25;
    return strength;
  };

  const strength = passwordStrength(password);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <UserPlus className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Register to discover and apply for government schemes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {password && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Password strength:</span>
                  <span
                    className={`font-medium ${
                      strength < 50
                        ? "text-destructive"
                        : strength < 75
                        ? "text-[#F59E0B]"
                        : "text-[#16A34A]"
                    }`}
                  >
                    {strength < 50 ? "Weak" : strength < 75 ? "Medium" : "Strong"}
                  </span>
                </div>
                <Progress
                  value={strength}
                  className="h-2"
                  indicatorClassName={
                    strength < 50
                      ? "bg-destructive"
                      : strength < 75
                      ? "bg-[#F59E0B]"
                      : "bg-[#16A34A]"
                  }
                />
                <ul className="space-y-1 text-xs">
                  <li className="flex items-center gap-2">
                    {password.length >= 8 ? (
                      <Check className="h-3 w-3 text-[#16A34A]" />
                    ) : (
                      <X className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>At least 8 characters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {/[a-z]/.test(password) && /[A-Z]/.test(password) ? (
                      <Check className="h-3 w-3 text-[#16A34A]" />
                    ) : (
                      <X className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>Uppercase and lowercase letters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {/\d/.test(password) ? (
                      <Check className="h-3 w-3 text-[#16A34A]" />
                    ) : (
                      <X className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>At least one number</span>
                  </li>
                  <li className="flex items-center gap-2">
                    {/[@$!%*?&#]/.test(password) ? (
                      <Check className="h-3 w-3 text-[#16A34A]" />
                    ) : (
                      <X className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span>Special character (@$!%*?&#)</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox id="terms" className="mt-1" />
            <label
              htmlFor="terms"
              className="text-sm leading-relaxed peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          <Button className="w-full" size="lg">
            Create Account
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline">
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
