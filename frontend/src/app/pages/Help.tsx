import { Search, MessageCircle, FileQuestion } from "lucide-react";
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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-3">Help & Support</h1>
        <p className="text-muted-foreground text-lg">
          Find answers to common questions or get in touch with our AI support
        </p>
      </div>

      {/* Search */}
      <div className="mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for help articles..."
            className="pl-12 h-14 text-lg rounded-2xl border-border/60 shadow-sm"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Chat Card - Highlighted */}
        <Card className="lg:col-span-1 border-primary/20 bg-primary/5 shadow-md">
          <CardContent className="pt-8 text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Live AI Support</h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Get instant answers to your questions about government schemes and applications through our AI assistant.
            </p>
            <Button className="w-full h-11 rounded-xl font-semibold">Start Chat Support</Button>
          </CardContent>
        </Card>

        {/* FAQs - Inset */}
        <Card className="lg:col-span-2 border-border/40 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileQuestion className="h-6 w-6 text-primary" />
              <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
            </div>
            <CardDescription>
              Quick answers to most common eligibility and application queries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b last:border-0">
                  <AccordionTrigger className="text-left py-4 hover:no-underline font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Message Form Section */}
      <div className="bg-muted/30 rounded-3xl p-8 border border-border/40">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
            <p className="text-muted-foreground">Send us a direct message and our team will get back to you via the portal.</p>
          </div>
          
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold ml-1">Your Name</Label>
                <Input id="name" placeholder="Enter your full name" className="h-11 rounded-xl bg-background border-border/60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold ml-1">Email Address</Label>
                <Input id="email" type="email" placeholder="email@example.com" className="h-11 rounded-xl bg-background border-border/60" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-sm font-semibold ml-1">Subject</Label>
              <Input id="subject" placeholder="What do you need help with?" className="h-11 rounded-xl bg-background border-border/60" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-semibold ml-1">Message</Label>
              <Textarea
                id="message"
                placeholder="Please provide as much detail as possible..."
                rows={5}
                className="rounded-2xl transition-all bg-background border-border/60"
              />
            </div>
            <div className="text-center pt-2">
              <Button size="lg" className="px-12 h-12 rounded-2xl font-bold shadow-lg shadow-primary/20">
                Send Support Request
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
