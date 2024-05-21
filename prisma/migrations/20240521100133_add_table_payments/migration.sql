-- CreateTable
CREATE TABLE "payments" (
    "id" VARCHAR(10) NOT NULL,
    "booking_id" VARCHAR(10) NOT NULL,
    "payment_method" VARCHAR(100) NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_booking_id_key" ON "payments"("booking_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
