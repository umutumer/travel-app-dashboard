"use client"
import React, { useEffect } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Hotel, useHotelStore } from '@/store/useHotelStore'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


const hotelFormSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters." }),
    description: z.string().optional(),
    location: z.string().min(2, { message: "Location is required." }),
    address: z.string().min(5, { message: "Address is required and must be at least 5 characters." }),
    rating: z.preprocess((val) => Number(val), z.number().min(0).max(5)).optional(),
    pricePerNight: z.preprocess((val) => Number(val), z.number().min(0, { message: "Price must be a positive number." })),
});

interface EditHotelFormProps {
    open: boolean;
    onOpenChange: (value: boolean) => void;
    initialHotel: Hotel | null;
}


const EditedHotelForm = ({ initialHotel, onOpenChange, open }: EditHotelFormProps) => {
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

    useEffect(() => {
        if (initialHotel) {
            form.reset({
                name: initialHotel.name || "",
                description: initialHotel.description || "",
                location: initialHotel.location || "",
                address: initialHotel.address || "",
                rating: initialHotel.rating || 0,
                pricePerNight: initialHotel.pricePerNight || 0,

            })
        }

    }, [initialHotel, form])

    const onSubmit = async (values: z.infer<typeof hotelFormSchema>) => {
        if (!initialHotel) return;

        const updatedHotel = {
            ...initialHotel,
            ...values
        }

        try {
            const response = await fetch("/api/hotels", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: updatedHotel.id,
                    name: updatedHotel.name,
                    description: updatedHotel.description,
                    location: updatedHotel.location,
                    address: updatedHotel.address,
                    rating: updatedHotel.rating,
                    pricePerNight: updatedHotel.pricePerNight,
                }),
            })

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Update error:", errorData);
                alert(
                    "Failed to update hotel: " + (errorData?.error || "Unknown error")
                );
                return;
            }

            console.log("Hotel updated successfully");
            onOpenChange(false);
            fetchHotels();


        } catch (error) {
            console.error("PUT request error:", error);
            alert("An error occurred while updating the hotel.");
        }


    }

    return (

        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Hotel</DialogTitle>
                    <DialogDescription asChild>
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
                                            <FormDescription>Optional. Defaults to 0 if not provided.</FormDescription>
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
                                                <Input type="number" placeholder="Enter price per night" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit">Edit Hotel</Button>
                            </form>
                        </Form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default EditedHotelForm