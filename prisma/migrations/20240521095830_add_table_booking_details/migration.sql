-- CreateTable
CREATE TABLE "booking_details" (
    "id" VARCHAR(10) NOT NULL,
    "booking_id" VARCHAR(10) NOT NULL,
    "passenger_name" VARCHAR(255) NOT NULL,
    "passenger_age" VARCHAR(2) NOT NULL,
    "nik" VARCHAR(20) NOT NULL,
    "seat_number" VARCHAR(10) NOT NULL,
    "qr_code" VARCHAR(255) NOT NULL,

    CONSTRAINT "booking_details_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "booking_details" ADD CONSTRAINT "booking_details_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
