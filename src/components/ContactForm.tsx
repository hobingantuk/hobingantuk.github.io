"use client";

import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { generateEmailContent } from "@/utils/emailFormatter";

type FormValues = {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
};

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = (data: FormValues) => {
    const { name, email, inquiryType, message } = data;
    const emailBody = generateEmailContent(name, email, inquiryType, message);
    const mailtoLink = `mailto:bagusnugrahaxd@gmail.com?subject=${encodeURIComponent(
      `New ${inquiryType} from ${name}`
    )}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  return (
    <Card className="w-full max-w-2xl bg-card-foreground shadow-lg border border-gray-700">
      <CardHeader className="text-center">
        <h2 className="text-2xl font-bold text-white">Get in Touch</h2>
        <p className="text-gray-400 text-sm">We'd love to hear from you.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Insert your name here"
              {...register("name", { required: true })}
              className="bg-gray-800 border-gray-600 text-primary focus:border-primary focus:ring-primary"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">Name is required</p>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Insert your email here"
              {...register("email", { required: true })}
              className="bg-gray-800 border-gray-600 text-primary focus:border-primary focus:ring-primary"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">Email is required</p>
            )}
          </div>

          {/* Inquiry Type Dropdown */}
          <div>
            <Label htmlFor="inquiryType">Inquiry Type</Label>
            <Controller
              name="inquiryType"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full bg-gray-800 border-gray-600 text-primary focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Select an Inquiry Type that suits you best" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Job Offer">Job Offer</SelectItem>
                      <SelectItem value="Inquiry">Inquiry</SelectItem>
                      <SelectItem value="Collaboration">
                        Collaboration
                      </SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.inquiryType && (
              <p className="text-red-500 text-sm">
                Please select an inquiry type
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Write your message here..."
              {...register("message", { required: true })}
              className="bg-gray-800 border-gray-600 text-primary resize-y  focus:border-primary focus:ring-primary"
            />
            {errors.message && (
              <p className="text-red-500 text-sm">Message is required</p>
            )}
          </div>

          {/* Submit Button */}
          <CardFooter className="flex justify-center">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/80 text-white font-semibold"
            >
              Send Message
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
