import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useUser, HealthProfile } from "@/services/UserContext";
import { Plus, X, Heart } from 'lucide-react';

const formSchema = z.object({
  diabetes: z.boolean().default(false),
  hypertension: z.boolean().default(false),
  thyroidIssues: z.boolean().default(false),
  foodAllergies: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof formSchema>;

const ProfileSetup = () => {
  const [allergyInput, setAllergyInput] = React.useState<string>('');
  const { healthProfile, updateHealthCondition } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize form with values from healthProfile
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diabetes: healthProfile.hasCondition.diabetes,
      hypertension: healthProfile.hasCondition.hypertension,
      thyroidIssues: healthProfile.hasCondition.thyroidIssues,
      foodAllergies: [...healthProfile.hasCondition.foodAllergies], // Create a copy of the array
    },
  });

  // Add allergy handler
  const addAllergy = () => {
    if (!allergyInput.trim()) return;
    
    const currentAllergies = form.getValues('foodAllergies');
    
    // Check if allergy already exists (case insensitive)
    if (currentAllergies.some(allergy => 
      allergy.toLowerCase() === allergyInput.trim().toLowerCase()
    )) {
      toast({
        title: "Allergy already added",
        description: "This allergy is already in your list.",
        variant: "destructive"
      });
      return;
    }
    
    // Add new allergy and update form
    const newAllergies = [...currentAllergies, allergyInput.trim()];
    form.setValue('foodAllergies', newAllergies, { shouldValidate: true });
    setAllergyInput('');
  };

  // Remove allergy handler
  const removeAllergy = (allergyToRemove: string) => {
    const currentAllergies = form.getValues('foodAllergies');
    const newAllergies = currentAllergies.filter(
      allergy => allergy !== allergyToRemove
    );
    form.setValue('foodAllergies', newAllergies, { shouldValidate: true });
  };

  // Handle form submission
  const onSubmit = (values: FormData) => {
    updateHealthCondition('diabetes', values.diabetes);
    updateHealthCondition('hypertension', values.hypertension);
    updateHealthCondition('thyroidIssues', values.thyroidIssues);
    updateHealthCondition('foodAllergies', values.foodAllergies);

    toast({
      title: "Profile Updated",
      description: "Your health profile has been saved successfully.",
    });

    navigate('/upload');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Heart className="h-5 w-5 mr-2 text-health-blue" />
          Your Health Profile
        </CardTitle>
        <CardDescription>
          Tell us about your health conditions for personalized food recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="diabetes"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Diabetes</FormLabel>
                      <FormDescription>
                        I have diabetes and need to monitor sugar/carb intake
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hypertension"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Hypertension</FormLabel>
                      <FormDescription>
                        I have high blood pressure and need to monitor sodium intake
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thyroidIssues"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Thyroid Issues</FormLabel>
                      <FormDescription>
                        I have thyroid problems and need to avoid certain ingredients
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <FormField
                control={form.control}
                name="foodAllergies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food Allergies</FormLabel>
                    <div className="flex space-x-2">
                      <Input
                        value={allergyInput}
                        onChange={(e) => setAllergyInput(e.target.value)}
                        placeholder="e.g., peanuts, milk, eggs"
                        className="flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addAllergy();
                          }
                        }}
                      />
                      <Button 
                        type="button" 
                        onClick={addAllergy} 
                        variant="outline" 
                        size="icon"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {field.value.map((allergy) => (
                        <Badge key={allergy} variant="secondary" className="px-2 py-1">
                          {allergy}
                          <X 
                            className="ml-1 h-3 w-3 cursor-pointer" 
                            onClick={() => removeAllergy(allergy)} 
                          />
                        </Badge>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full">Save Profile</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileSetup;
