import { Search, MessageCircle, Phone, Mail, FileQuestion, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";

const faqs = [
  {
    question: "How do I check my eligibility for a scheme?",
    answer:
      "You can check your eligibility by uploading your documents in the Document Management section. Our AI will automatically verify your details and show you all schemes you're eligible for. You can also use the 'Check My Eligibility' button on any scheme details page.",
  },
  {
    question: "How long does it take to process an application?",
    answer:
      "Processing time varies by scheme. Generally, document verification takes 2-3 days, eligibility assessment takes 3-5 days, and final approval can take 7-10 days. You can track your application status in real-time on the Applications page.",
  },
  {
    question: "What documents do I need to apply?",
    answer:
      "Required documents vary by scheme but commonly include: Aadhaar Card, Income Certificate, Bank Account Details, and Passport Photos. Some schemes may require additional documents like Caste Certificate, Property Documents, or Educational Certificates.",
  },
  {
    question: "Can I apply for multiple schemes at once?",
    answer:
      "Yes, you can apply for multiple schemes simultaneously as long as you meet the eligibility criteria for each. Our platform allows you to manage multiple applications from a single dashboard.",
  },
  {
    question: "How do I save a scheme for later?",
    answer:
      "Click the bookmark icon on any scheme card to save it. You can access all your saved schemes from the 'Saved Schemes' page in the navigation menu.",
  },
  {
    question: "What if my application is rejected?",
    answer:
      "If your application is rejected, you'll receive a detailed explanation via email and in your application dashboard. You can review the rejection reason and reapply if you believe there was an error or if your circumstances have changed.",
  },
  {
    question: "How secure is my personal information?",
    answer:
      "We take security seriously. All data is encrypted in transit and at rest. We use industry-standard security practices and comply with government data protection regulations. Your information is never shared without your consent.",
  },
  {
    question: "Can I update my application after submission?",
    answer:
      "Once submitted, applications cannot be edited. However, you can save drafts before final submission. If you need to make changes after submission, please contact our support team.",
  },
];

export function Help() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Help & Support</h1>
        <p className="text-muted-foreground">
          Find answers to common questions or get in touch with our support team
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for help articles..."
            className="pl-10 h-12 text-base"
          />
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <MessageCircle className="h-10 w-10 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Live Chat</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Chat with our support team
            </p>
            <Button className="w-full">Start Chat</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Phone className="h-10 w-10 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Phone Support</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Mon-Fri, 9 AM - 6 PM IST
            </p>
            <Button variant="outline" className="w-full">
              1800-XXX-XXXX
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Mail className="h-10 w-10 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold mb-2">Email Support</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Response within 24 hours
            </p>
            <Button variant="outline" className="w-full">
              support@schemes.gov.in
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileQuestion className="h-5 w-5" />
            <CardTitle>Frequently Asked Questions</CardTitle>
          </div>
          <CardDescription>
            Quick answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Send us a message</CardTitle>
          <CardDescription>
            Can't find what you're looking for? Send us a message and we'll get back to you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" placeholder="How can we help?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Describe your issue or question in detail..."
                rows={5}
              />
            </div>
            <Button className="w-full sm:w-auto">Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
