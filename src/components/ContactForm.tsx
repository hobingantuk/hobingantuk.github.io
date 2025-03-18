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
    <div className="relative flex flex-col items-center justify-center px-6 py-12">
      {/* 🔥 Subtle Background Effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 to-background blur-2xl opacity-40"></div>

      {/* Title */}
      <div className="text-center glow-effect">
        <h2 className="text-4xl font-nis-m9-condensed text-primary">
          GET IN TOUCH
        </h2>
        <p className="text-muted-primary font-matisse-standard max-w-md mx-auto mt-2">
          Hit that send button and—BOOM!—your default email app will pop open
          like magic 🎩✨. Pre-filled subject and message included. Because who
          has time to type everything?
        </p>
      </div>

      {/* Contact Form */}
      <Card className="w-full max-w-2xl bg-card-foreground shadow-lg border border-gray-700 rounded-xl mt-8 transition-all duration-300 hover:shadow-primary/30">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="👀 Your Name Here"
                {...register("name", { required: true })}
                className="bg-gray-900 border-gray-700 text-primary focus:border-primary focus:ring-primary focus:ring-2 transition-all duration-200"
              />
              {errors.name && (
                <p className="text-red-500 text-sm animate-pulse">
                  Your name is missing 👀
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="📧 Drop your email"
                {...register("email", { required: true })}
                className="bg-gray-900 border-gray-700 text-primary focus:border-primary focus:ring-primary focus:ring-2 transition-all duration-200"
              />
              {errors.email && (
                <p className="text-red-500 text-sm animate-pulse">
                  Email is required 📧
                </p>
              )}
            </div>

            {/* Inquiry Type */}
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
                    <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-primary focus:border-primary focus:ring-primary focus:ring-2 transition-all duration-200">
                      <SelectValue placeholder="🔍 Select an inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Job Offer">💼 Job Offer</SelectItem>
                        <SelectItem value="Inquiry">❓ Inquiry</SelectItem>
                        <SelectItem value="Collaboration">
                          🤝 Collaboration
                        </SelectItem>
                        <SelectItem value="Support">🛠️ Support</SelectItem>
                        <SelectItem value="Other">🤷 Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.inquiryType && (
                <p className="text-red-500 text-sm animate-pulse">
                  Pick an inquiry type 🔍
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="💬 Spill the details..."
                {...register("message", { required: true })}
                className="bg-gray-900 border-gray-700 text-primary resize-y focus:border-primary focus:ring-primary focus:ring-2 transition-all duration-200"
              />
              {errors.message && (
                <p className="text-red-500 text-sm animate-pulse">
                  Don't leave me hanging 🤔
                </p>
              )}
            </div>

            {/* Submit Button */}
            <CardFooter className="flex justify-center pt-2">
              <Button
                type="submit"
                variant={"default"}
                className="w-full py-3 hover:bg-primary/80 transition-transform hover:scale-105 active:scale-95"
              >
                🚀 Blast Off
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
