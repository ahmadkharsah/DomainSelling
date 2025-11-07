import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { insertContactSubmissionSchema, type InsertContactSubmission } from '@shared/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertContactSubmission>({
    resolver: zodResolver(insertContactSubmissionSchema),
    defaultValues: {
      fullName: '',
      email: '',
      offerAmount: 500,
      message: '',
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertContactSubmission) => {
      const response = await apiRequest('POST', '/api/contact', data);
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
    },
    onError: (error: any) => {
      console.error('Submission error:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was an error submitting your offer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertContactSubmission) => {
    submitMutation.mutate(data);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    form.reset();
  };

  if (isSubmitted) {
    return (
      <section className="py-12 md:py-16 px-6">
        <div className="max-w-lg mx-auto">
          <div className="border-2 border-green-500 bg-green-500/10 rounded-md p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold mb-3">Thank You!</h3>
            <p className="text-muted-foreground mb-4">
              Your offer has been received successfully. We'll review your submission and get back to you within 24-48 hours.
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Please check your email for confirmation.
            </p>
            <Button 
              onClick={handleReset}
              variant="outline"
              className="mt-4"
              data-testid="button-reset"
            >
              Submit Another Offer
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-semibold mb-3">Make an Offer</h2>
          <p className="text-muted-foreground">
            Interested in acquiring this domain? Submit your offer below.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <input
              type="text"
              name="website"
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Full Name <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      className="px-4 py-3 bg-transparent border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
                      data-testid="input-fullname"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Email Address <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="john@example.com"
                      className="px-4 py-3 bg-transparent border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
                      data-testid="input-email"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-destructive" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offerAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Offer Amount (USD) <span className="text-primary">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        {...field}
                        type="number"
                        min="500"
                        step="100"
                        placeholder="500"
                        className="pl-8 px-4 py-3 bg-transparent border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20"
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        data-testid="input-offer"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-sm text-destructive" />
                  <p className="text-xs text-muted-foreground mt-1">Minimum offer: $500 USD</p>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={6}
                      placeholder="Tell us about your interest in this domain and how you plan to use it... (optional)"
                      className="px-4 py-3 bg-transparent border-2 border-input focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                      data-testid="input-message"
                    />
                  </FormControl>
                  <FormMessage className="text-sm text-destructive" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={submitMutation.isPending}
              className="w-full py-4 text-base font-semibold tracking-wide"
              data-testid="button-submit"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Offer'
              )}
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
