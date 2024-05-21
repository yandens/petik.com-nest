-- CreateTable
CREATE TABLE "flights" (
    "id" VARCHAR(10) NOT NULL,
    "airline_id" VARCHAR(10) NOT NULL,
    "origin" VARCHAR(255) NOT NULL,
    "origin_city" VARCHAR(255) NOT NULL,
    "destination" VARCHAR(255) NOT NULL,
    "destination_city" VARCHAR(255) NOT NULL,
    "departure" TIME NOT NULL,
    "arrival" TIME NOT NULL,

    CONSTRAINT "flights_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "flights" ADD CONSTRAINT "flights_airline_id_fkey" FOREIGN KEY ("airline_id") REFERENCES "airlines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
