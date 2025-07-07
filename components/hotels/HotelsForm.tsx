"use client";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useHotelStore } from "@/store/useHotelStore";

const hotelFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    description: z.string().optional(),
    location: z.string().min(2, { message: "Location is required." }),
    address: z.string().min(5, { message: "Address is required and must be at least 5 characters." }),
    rating: z.preprocess((val) => Number(val), z.number().min(0).max(5)).optional(),
    pricePerNight: z.preprocess((val) => Number(val), z.number().min(0, { message: "Price must be a positive number." })),
});

const HotelsForm = () => {
  const { fetchHotels } = useHotelStore();

 const form = useForm<z.infer<typeof hotelFormSchema>>({
        resolver: zodResolver(hotelFormSchema),
        defaultValues: {
            name: "",
            description: "",
            location: "",
            address: "",
            rating: 0,
            photos: "",
            pricePerNight: 0,
        },
    });

  const onSubmit = async (values: z.infer<typeof hotelFormSchema>) => {
    const hotelData = {
      name: values.name,
      description: values.description,
      location: values.location,
      address: values.address,
      rating: values.rating || 0,
      pricePerNight: values.pricePerNight,
    };

    try {
      const response = await fetch("/api/hotels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hotelData),
      });

      if (!response.ok) {
        throw new Error("Failed to add hotel");
      }

      console.log("Hotel added successfully");
      form.reset();
      fetchHotels();
    } catch (error) {
      console.error("Error adding hotel:", error);
    }

    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter hotel name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description (optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Enter location" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (0-5)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Enter rating" {...field} />
              </FormControl>
              <FormDescription>
                Optional. Defaults to 0 if not provided.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pricePerNight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price Per Night</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter price per night"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Add Hotel</Button>
      </form>
    </Form>
  );
};

export default HotelsForm;
