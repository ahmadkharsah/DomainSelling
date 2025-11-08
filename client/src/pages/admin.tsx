import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertSiteConfigSchema, type SiteConfig } from "@shared/schema";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut } from "lucide-react";
import { useLocation } from "wouter";

type SiteConfigForm = z.infer<typeof insertSiteConfigSchema>;

export default function Admin() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: config, isLoading } = useQuery<Omit<SiteConfig, "resendApiKey">>({
    queryKey: ["/api/site-config"],
  });

  const updateConfigMutation = useMutation({
    mutationFn: async (data: SiteConfigForm) => {
      const res = await apiRequest("PUT", "/api/site-config", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-config"] });
      toast({
        title: "Success",
        description: "Site configuration updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<SiteConfigForm>({
    resolver: zodResolver(insertSiteConfigSchema),
    defaultValues: {
      domainName: "",
      backgroundColor: "#FFFFFF",
      accentColor: "#000000",
      fontColor: "#000000",
      resendApiKey: "",
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  if (config && !form.formState.isDirty) {
    form.reset({
      domainName: config.domainName,
      backgroundColor: config.backgroundColor,
      accentColor: config.accentColor,
      fontColor: config.fontColor,
      resendApiKey: "",
    });
  }

  const onSubmit = (data: SiteConfigForm) => {
    updateConfigMutation.mutate(data);
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setLocation("/login");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold" data-testid="text-admin-title">Admin Panel</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground" data-testid="text-username">
              {user?.username}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              data-testid="button-logout"
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle data-testid="text-config-title">Site Configuration</CardTitle>
              <CardDescription data-testid="text-config-description">
                Update your site settings. Changes will be reflected on the landing page immediately.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="domainName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domain Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            data-testid="input-domain-name"
                            placeholder="YourDomain.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="backgroundColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Background Color</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input
                                {...field}
                                type="color"
                                className="w-16 h-10 p-1 cursor-pointer"
                                data-testid="input-background-color"
                              />
                              <Input
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="#FFFFFF"
                                data-testid="input-background-color-text"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accentColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Accent Color</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input
                                {...field}
                                type="color"
                                className="w-16 h-10 p-1 cursor-pointer"
                                data-testid="input-accent-color"
                              />
                              <Input
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="#000000"
                                data-testid="input-accent-color-text"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fontColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Font Color</FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input
                                {...field}
                                type="color"
                                className="w-16 h-10 p-1 cursor-pointer"
                                data-testid="input-font-color"
                              />
                              <Input
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="#000000"
                                data-testid="input-font-color-text"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="resendApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resend API Key (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="password"
                            data-testid="input-resend-api-key"
                            placeholder="Enter Resend API key"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      data-testid="button-save-config"
                      disabled={updateConfigMutation.isPending}
                      className="flex-1"
                    >
                      {updateConfigMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocation("/")}
                      data-testid="button-view-site"
                    >
                      View Site
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
