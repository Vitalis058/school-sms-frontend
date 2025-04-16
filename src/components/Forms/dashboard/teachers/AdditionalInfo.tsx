import React from "react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

function AdditionalInfo() {
  const { control } = useFormContext();
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
      <div className="space-y-6">
        <FormField
          control={control}
          name="certifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certifications & Licenses</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List any teaching certifications, licenses, or other relevant credentials"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include certification numbers and expiration dates if applicable
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="skills"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Skills & Abilities</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List any special skills relevant to teaching (e.g., technology proficiency, coaching abilities)"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="languages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Languages</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List languages you can speak and your proficiency level"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="additionalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any other information that might be relevant"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export default AdditionalInfo;
