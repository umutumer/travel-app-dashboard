import React from 'react'
import HotelsForm from '@/components/hotels/HotelsForm'
import { DataTable } from "@/components/hotels/DataTable"

const HotelPage = () => {
  return (
    <div className="min-h-screen py-10 px-4">

      <div className="max-w-screen-[2000px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="w-full lg:w-2/3 border-r border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Hotels</h2>
            {/* Placeholder içeriğiniz */}
            <p className="text-gray-600">
              Hotel list goes here. You can display a list of hotels with cards
              or a table layout. If you have a sidebar, it will be on the left or
              right, but this container is now wider to accommodate that.
            </p>
            <DataTable />
          </div>

          <div className="w-full lg:w-1/3 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Hotel</h2>
            <HotelsForm/>

          </div>

        </div>
      </div>
    </div>
  )
}

export default HotelPage