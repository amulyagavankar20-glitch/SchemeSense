import { ArrowLeft, CheckCircle, X } from "lucide-react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

const schemes = [
  {
    id: "1",
    name: "PM Awas Yojana",
    category: "Housing",
    benefit: "₹2.5L subsidy",
    income: "< ₹18L",
    age: "18+",
    property: "No",
  },
  {
    id: "2",
    name: "National Scholarship",
    category: "Education",
    benefit: "₹50K/year",
    income: "< ₹8L",
    age: "< 30",
    property: "N/A",
  },
  {
    id: "3",
    name: "PM Kisan",
    category: "Agriculture",
    benefit: "₹6K/year",
    income: "Any",
    age: "18+",
    property: "Farmland",
  },
];

export function SchemeComparison() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <Link to="/search">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mb-2">Compare Schemes</h1>
        <p className="text-muted-foreground">
          Compare different schemes side by side to find the best fit
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Scheme Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Feature</TableHead>
                  {schemes.map((scheme) => (
                    <TableHead key={scheme.id} className="text-center">
                      <div className="space-y-2">
                        <p className="font-semibold">{scheme.name}</p>
                        <Badge variant="outline">{scheme.category}</Badge>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Benefits</TableCell>
                  {schemes.map((scheme) => (
                    <TableCell key={scheme.id} className="text-center">
                      {scheme.benefit}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Income Criteria</TableCell>
                  {schemes.map((scheme) => (
                    <TableCell key={scheme.id} className="text-center">
                      {scheme.income}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Age Requirement</TableCell>
                  {schemes.map((scheme) => (
                    <TableCell key={scheme.id} className="text-center">
                      {scheme.age}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Property Ownership</TableCell>
                  {schemes.map((scheme) => (
                    <TableCell key={scheme.id} className="text-center">
                      {scheme.property === "No" ? (
                        <X className="h-5 w-5 mx-auto text-destructive" />
                      ) : scheme.property === "N/A" ? (
                        "-"
                      ) : (
                        <CheckCircle className="h-5 w-5 mx-auto text-[#16A34A]" />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Actions</TableCell>
                  {schemes.map((scheme) => (
                    <TableCell key={scheme.id} className="text-center">
                      <div className="flex flex-col gap-2">
                        <Link to={`/scheme/${scheme.id}`}>
                          <Button size="sm" className="w-full">
                            View Details
                          </Button>
                        </Link>
                        <Link to={`/apply/${scheme.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            Apply
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
