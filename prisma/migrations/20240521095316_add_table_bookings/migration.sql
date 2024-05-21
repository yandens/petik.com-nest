-- CreateTable
CREATE TABLE "bookings" (
    "id" VARCHAR(10) NOT NULL,
    "user_id" VARCHAR(10) NOT NULL,
    "flight_id" VARCHAR(10) NOT NULL,
    "flight_class" VARCHAR(100) NOT NULL,
    "total_passenger" INTEGER NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "status" VARCHAR(100) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_flight_id_fkey" FOREIGN KEY ("flight_id") REFERENCES "flights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
