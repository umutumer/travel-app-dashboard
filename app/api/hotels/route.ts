import { prismadb } from "@/lib/db";
import { NextResponse, NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const hotel = await prismadb.hotel.create({
      data: {
        name: body.name,
        description: body.description,
        location: body.location,
        address: body.address,
        rating: body.rating ?? 0.0,
        photos: body.photos ?? [],
        pricePerNight: body.pricePerNight,
      },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { error: "Something went wrong while creating the hotel!" },
      { status: 500 }
    );
  }
}

export async function GET(request:Request) {
    const { searchParams } = new URL(request.url);
    const rating = searchParams.get("rating");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const name = searchParams.get("name");
    const pageStr = searchParams.get("page") || "1";
    const page = Number(pageStr);
    const limit = 10;
    const skip = (page - 1) * limit;

    const filters = [];

    if (priceMin || priceMax) {
        const priceFilter: any = {};
        if (priceMin) {
          priceFilter.gte = Number(priceMin);
        }
        if (priceMax) {
          priceFilter.lte = Number(priceMax);
        }
        filters.push({ pricePerNight: priceFilter });
      }

      if (rating) {
        filters.push({ rating: { gte: Number(rating) } });
      }

        
    if (name) {
        filters.push({ name: { contains: name, mode: "insensitive" } });
      }

      const whereClause = filters.length > 0 ? { AND: filters } : {};


      try {

        const hotels = await prismadb.hotel.findMany({
            where: whereClause,
            skip,
            take: limit,
            include: {
              rooms: true,
            },
          });

          const totalCount = await prismadb.hotel.count({ where: whereClause });

          return NextResponse.json({ hotels, totalCount });

      } catch (error) {
        return NextResponse.json({ error: "Something went wrong!" }, { status: 500 });

      }



}

export async function PUT(request:NextRequest) {
  try {

    const body = await request.json();
    const {
      id,
      name,
      description,
      location,
      address,
      rating,
      photos,
      pricePerNight,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "Hotel 'id' is required." }, { status: 400 });
    }

    const updatedHotel = await prismadb.hotel.update({
      where:{id},
      data:{
        name,
        description,
        location,
        address,
        rating,
        photos,
        pricePerNight,
        
      }
    })
    return NextResponse.json(updatedHotel);

    
  } catch (error) {
    
    console.error("PUT error:", error);
    return NextResponse.json(
      { error: "Something went wrong while updating the hotel!" },
      { status: 500 }
    );
  }
  
}