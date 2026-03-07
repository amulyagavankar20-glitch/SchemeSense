import { Camera, Edit, Mail, Phone, MapPin, Calendar, User as UserIcon, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Link } from "react-router";

export function Profile() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            View and manage your personal information
          </p>
        </div>
        <Link to="/settings">
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </Link>
      </div>

      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" alt="Rajesh Kumar" />
                <AvatarFallback className="text-2xl">RK</AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">Rajesh Kumar</h2>
                <Badge className="bg-[#16A34A] text-white w-fit mx-auto md:mx-0">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              </div>
              <p className="text-muted-foreground mb-4">
                Member since December 2023
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>rajesh.kumar@email.com</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>New Delhi, India</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Full Name</p>
              <p className="font-medium">Rajesh Kumar</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Date of Birth</p>
              <p className="font-medium">15 August 1985</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Gender</p>
              <p className="font-medium">Male</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Aadhaar Number</p>
              <p className="font-medium">XXXX-XXXX-4567</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">PAN Number</p>
              <p className="font-medium">ABCDE1234F</p>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Address</p>
              <p className="font-medium">
                123 MG Road<br />
                New Delhi, Delhi<br />
                110001, India
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">State</p>
              <p className="font-medium">Delhi</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">District</p>
              <p className="font-medium">Central Delhi</p>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Annual Income</p>
              <p className="font-medium">₹4,50,000</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Occupation</p>
              <p className="font-medium">Software Engineer</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Bank Account</p>
              <p className="font-medium">XXXXXX1234 (SBI)</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground mb-1">IFSC Code</p>
              <p className="font-medium">SBIN0001234</p>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <UserIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-[#16A34A]">1</p>
                </div>
                <Shield className="h-8 w-8 text-[#16A34A]" />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Saved Schemes</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
