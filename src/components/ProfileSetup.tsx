
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
  diabetes: z.boolean(),
  hypertension: z.boolean(),
  thyroidIssues: z.boolean(),
  foodAllergies: z.array(z.string()),
});

const ProfileSetup = () => {
  const [allergies, setAllergies] = React.useState<string[]>([]);
  const [allergyInput, setAllergyInput] = React.useState<string>('');
  const { healthProfile, updateHealthCondition } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      diabetes: healthProfile.hasCondition.diabetes,
      hypertension: healthProfile.hasCondition.hypertension,
      thyroidIssues: healthProfile.hasCondition.thyroidIssues,
      foodAllergies: healthProfile.hasCondition.foodAllergies,
    },
  });

  React.useEffect(() => {
    setAllergies(healthProfile.hasCondition.foodAllergies);
  }, [healthProfile.hasCondition.foodAllergies]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateHealthCondition('diabetes', values.diabetes);
    updateHealthCondition('hypertension', values.hypertension);
    updateHealthCondition('thyroidIssues', values.thyroidIssues);
    updateHealthCondition('foodAllergies', allergies);

    toast({
      title: "Profile Updated",
      description: "Your health profile has been saved successfully.",
    });

    navigate('/upload');
  };

  const addAllergy = () => {
    if (allergyInput.trim() && !allergies.includes(allergyInput.trim())) {
      const newAllergies = [...allergies, allergyInput.trim()];
      setAllergies(newAllergies);
      form.setValue('foodAllergies', newAllergies);
      setAllergyInput('');
    }
  };

  const removeAllergy = (allergy: string) => {
    const newAllergies = allergies.filter(a => a !== allergy);
    setAllergies(newAllergies);
    form.setValue('foodAllergies', newAllergies);
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
              <Label htmlFor="food-allergies">Food Allergies</Label>
              <div className="flex space-x-2">
                <Input
                  id="food-allergies"
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
                {allergies.map((allergy) => (
                  <Badge key={allergy} variant="secondary" className="px-2 py-1">
                    {allergy}
                    <X 
                      className="ml-1 h-3 w-3 cursor-pointer" 
                      onClick={() => removeAllergy(allergy)} 
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">Save Profile</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ProfileSetup;
