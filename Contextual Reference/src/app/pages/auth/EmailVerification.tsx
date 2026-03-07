import { Mail, CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";

export function EmailVerification() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-3">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#16A34A]/10">
            <CheckCircle className="h-8 w-8 text-[#16A34A]" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification link to <strong>your.email@example.com</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Please check your email and click on the verification link to activate your account.
          </p>
          <div className="rounded-lg bg-muted p-4 text-left">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the email?
            </p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure the email address is correct</li>
              <li>• Wait a few minutes and try again</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" size="lg">
            Resend Verification Email
          </Button>
          <Button variant="ghost" className="w-full">
            Change Email Address
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
