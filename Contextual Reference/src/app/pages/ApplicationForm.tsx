import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ArrowLeft, Save, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Progress } from "../components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { api } from "../lib/api";

const steps = [
  { id: 1, name: "Personal Details", fields: 6 },
  { id: 2, name: "Address Information", fields: 5 },
  { id: 3, name: "Financial Details", fields: 4 },
  { id: 4, name: "Review & Submit", fields: 0 },
];

export function ApplicationForm() {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [appId, setAppId] = useState<string | null>(null);

  useEffect(() => {
    if (schemeId) {
      api.getSchemeDetails(schemeId).then(data => setScheme(data)).catch(console.error);
    }
  }, [schemeId]);

  const progress = (currentStep / steps.length) * 100;

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const response = await api.submitApplication({
          schemeId,
          schemeName: scheme?.name || "Unknown Scheme",
          category: scheme?.category || "Unknown",
        });
        setAppId(response.id);
        setShowSuccessModal(true);
      } catch (error) {
        console.error("Failed to submit", error);
        alert("Failed to submit application");
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <Link to={`/scheme/${schemeId}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Scheme Details
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mb-2">Application Form</h1>
        <p className="text-muted-foreground">
          {scheme ? scheme.name : "Loading scheme details..."}
        </p>
      </div>

      {/* Progress Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-muted-foreground">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center ${
                    step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                      step.id < currentStep
                        ? "border-primary bg-primary text-primary-foreground"
                        : step.id === currentStep
                        ? "border-primary"
                        : "border-muted"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="hidden sm:block text-xs text-center">{step.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          <CardDescription>
            {currentStep === 1 && "Enter your personal information"}
            {currentStep === 2 && "Provide your current address details"}
            {currentStep === 3 && "Share your financial information"}
            {currentStep === 4 && "Review your application before submitting"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name <span className="text-destructive">*</span>
                  </Label>
                  <Input id="firstName" defaultValue="Rajesh" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name <span className="text-destructive">*</span>
                  </Label>
                  <Input id="lastName" defaultValue="Kumar" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">
                  Date of Birth <span className="text-destructive">*</span>
                </Label>
                <Input id="dob" type="date" defaultValue="1985-08-15" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender <span className="text-destructive">*</span>
                </Label>
                <Select defaultValue="male">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadhaar">
                  Aadhaar Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="aadhaar"
                  placeholder="XXXX-XXXX-XXXX"
                  defaultValue="XXXX-XXXX-4567"
                  className="bg-muted"
                  disabled
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-[#16A34A]" />
                  Auto-filled from verified documents
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobile">
                  Mobile Number <span className="text-destructive">*</span>
                </Label>
                <Input id="mobile" type="tel" defaultValue="+91 98765 43210" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="rajesh.kumar@email.com" />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">
                  Address Line 1 <span className="text-destructive">*</span>
                </Label>
                <Input id="address" placeholder="House No., Street" defaultValue="123 MG Road" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address2">Address Line 2</Label>
                <Input id="address2" placeholder="Locality, Landmark" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input id="city" defaultValue="New Delhi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Select defaultValue="delhi">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delhi">Delhi</SelectItem>
                      <SelectItem value="mumbai">Maharashtra</SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">
                  PIN Code <span className="text-destructive">*</span>
                </Label>
                <Input id="pincode" placeholder="110001" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="residenceType">
                  Type of Residence <span className="text-destructive">*</span>
                </Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select residence type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rented">Rented</SelectItem>
                    <SelectItem value="owned">Owned</SelectItem>
                    <SelectItem value="family">Family Owned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="annualIncome">
                  Annual Household Income <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="annualIncome"
                  type="text"
                  placeholder="₹"
                  defaultValue="₹4,50,000"
                  className="bg-muted"
                  disabled
                />
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckCircle className="h-3 w-3 text-[#16A34A]" />
                  Auto-filled from income certificate
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="occupation">
                  Occupation <span className="text-destructive">*</span>
                </Label>
                <Input id="occupation" placeholder="e.g., Software Engineer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccount">
                  Bank Account Number <span className="text-destructive">*</span>
                </Label>
                <Input id="bankAccount" placeholder="Enter account number" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifsc">
                  IFSC Code <span className="text-destructive">*</span>
                </Label>
                <Input id="ifsc" placeholder="e.g., SBIN0001234" />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="rounded-lg bg-[#16A34A]/10 p-4 border border-[#16A34A]/20">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-[#16A34A] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Application Ready for Submission</p>
                    <p className="text-sm text-muted-foreground">
                      Please review all information before submitting. You cannot edit the
                      application after submission.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Personal Details</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Full Name</p>
                      <p className="font-medium">Rajesh Kumar</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">15/08/1985</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Aadhaar</p>
                      <p className="font-medium">XXXX-XXXX-4567</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Mobile</p>
                      <p className="font-medium">+91 98765 43210</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Address</h3>
                  <p className="text-sm">123 MG Road, New Delhi, Delhi - 110001</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Financial Information</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Annual Income</p>
                      <p className="font-medium">₹4,50,000</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bank Account</p>
                      <p className="font-medium">XXXXXX1234</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="sm:w-auto w-full"
        >
          Previous
        </Button>
        <Button variant="outline" className="sm:w-auto w-full">
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        <Button onClick={handleNext} className="sm:flex-1 w-full">
          {currentStep === steps.length ? "Submit Application" : "Next Step"}
        </Button>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#16A34A]/10">
              <CheckCircle className="h-8 w-8 text-[#16A34A]" />
            </div>
            <DialogTitle className="text-center text-2xl">
              Application Submitted Successfully!
            </DialogTitle>
            <DialogDescription className="text-center">
              Your application has been submitted and is now under review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Application ID</p>
              <p className="text-xl font-bold font-mono">{appId || "PENDING"}</p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">What happens next?</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Document verification (2-3 days)</li>
                <li>Eligibility assessment (3-5 days)</li>
                <li>Final approval (7-10 days)</li>
              </ol>
            </div>
          </div>
          <DialogFooter className="sm:justify-center gap-2">
            <Link to="/applications" className="flex-1">
              <Button className="w-full">View Application Status</Button>
            </Link>
            <Link to="/search">
              <Button variant="outline">Back to Schemes</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
